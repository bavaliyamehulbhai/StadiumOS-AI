import { aiEventBus, AI_EVENTS } from '../events/aiEvents.js';
import { generateCrowdInsights } from './crowdAIService.js';
import { analyzeIncident } from './incidentAIService.js';
import { getIO } from '../../socket/socketServer.js';
import NotificationService from '../../services/notificationService.js';
import User from '../../models/User.js';
import Incident from '../../models/Incident.js';
import EmergencyBroadcast from '../../models/EmergencyBroadcast.js';
import { IncidentSocketService } from '../../services/incidentSocketService.js';
import { auditService } from '../../audit/services/auditService.js';
import SystemConfig from '../../models/SystemConfig.js';

class AIEventOrchestrator {
  constructor() {
    this.timeouts = {};
    this.debounceMs = 300000; // 5 minute default debounce to protect Groq token limits
    this.isProcessing = false;
  }

  init() {
    console.log('🤖 AI Event Orchestrator Initialized');
    
    // Listen to various backend events
    aiEventBus.on(AI_EVENTS.CROWD_UPDATED, (data) => this.handleCrowdUpdated(data));
    aiEventBus.on(AI_EVENTS.INCIDENT_CREATED, (data) => this.handleIncidentCreated(data));
    aiEventBus.on(AI_EVENTS.INCIDENT_UPDATED, (data) => this.handleIncidentUpdated(data));
  }

  // --- Handlers ---

  async handleCrowdUpdated(data) {
    const { gateId, density } = data;
    
    // Fetch global config
    let config;
    try {
      config = await SystemConfig.findOne();
    } catch (e) {
      console.error('Failed to load SystemConfig:', e.message);
    }
    
    const triggerThreshold = config?.aiCrowdTriggerThreshold || 80;
    this.debounceMs = config?.aiAnalysisCooldownMs || 30000;

    // Only trigger AI if crowd density crosses the configurable threshold (e.g., >80%)
    if (!density || density < triggerThreshold) return;

    // If we are already waiting for a cooldown to finish, ignore this tick
    if (this.timeouts['crowd']) {
      return; 
    }

    // Process immediately, then set a cooldown lock
    if (this.isProcessing) return;
    this.isProcessing = true;
    
    try {
      console.log(`[AI Orchestrator] Triggering crowd analysis (Density: ${density}%)`);
      
      this.broadcastProcessingState(true, 'Analyzing crowd surge and generating redirect recommendations...');
      
      const insights = await generateCrowdInsights();
      
      if (insights) {
        await auditService.logAIDecision(
          'Crowd', 
          'AI Crowd Redirect Recommendation', 
          'WARNING', 
          { recommendation: insights.recommendation }
        );

        this.broadcastAIResult('ai:recommendation', {
          type: 'Crowd',
          ...insights,
          timestamp: new Date()
        });

        await this.notifyOrganizers('AI Crowd Alert', insights.recommendation || 'Crowd surge detected. Adjust routing.', 'High', 'Crowd');
      }
    } catch (error) {
      console.error('[AI Orchestrator] Crowd Error:', error);
    } finally {
      this.isProcessing = false;
      this.broadcastProcessingState(false);
      
      // Set the cooldown lock AFTER processing finishes
      this.timeouts['crowd'] = setTimeout(() => {
        this.timeouts['crowd'] = null; // Release the lock after cooldown
      }, this.debounceMs);
    }
  }

  async handleIncidentCreated(incidentData) {
    const { incidentId, priority } = incidentData;

    // Only auto-analyze High or Critical incidents immediately
    if (priority !== 'High' && priority !== 'Critical') return;

    try {
      this.broadcastProcessingState(true, 'Analyzing new critical incident to determine resource requirements...');
      
      const analysis = await analyzeIncident(incidentId, true);
      
      if (analysis) {
        // Save to Incident DB
        const incident = await Incident.findById(incidentId);
        if (incident) {
          incident.aiSummary = analysis.summary;
          incident.aiSeverity = analysis.severity;
          incident.aiRecommendation = analysis.recommendedActions;
          await incident.save();
          
          const popIncident = await Incident.findById(incidentId)
            .populate('reportedBy', 'name role')
            .populate('assignedVolunteer', 'name email')
            .populate('stadium', 'name city');
          
          IncidentSocketService.emitAIGenerated(popIncident);
        }

        // Log Audit
        await auditService.logAIDecision(
          'Incident', 
          `AI Incident Summary: ${analysis.severity}`, 
          analysis.severity === 'Critical' ? 'CRITICAL' : 'WARNING', 
          { recommendedActions: analysis.recommendedActions }
        );

        this.broadcastAIResult('ai:recommendation', {
          type: 'Incident',
          ...analysis,
          timestamp: new Date()
        });

        // Draft an Emergency Broadcast if severity is Critical
        if (analysis.severity === 'Critical') {
          await EmergencyBroadcast.create({
            incidentId,
            title: `AI Recommended Evacuation: ${incident.title}`,
            message: analysis.summary,
            type: 'GENERAL',
            severity: 'CRITICAL',
            status: 'DRAFT',
            source: 'AI',
            targetRoles: ['Fan', 'Volunteer', 'Organizer', 'Admin'],
            instructions: {
              fan: 'Proceed to nearest safe exit immediately.',
              volunteer: 'Assist with evacuation. Follow protocol.',
            },
            aiGenerated: true,
            aiMetadata: {
              recommendations: analysis.recommendedActions || []
            }
          });
          await this.notifyOrganizers(`AI Drafted Broadcast`, `A Critical emergency broadcast has been drafted for incident: ${incident.title}. Review in Command Center.`, 'Critical', 'Emergency');
        } else {
          await this.notifyOrganizers(`AI Incident Summary`, analysis.summary || 'Critical incident reported. Review required.', 'Critical', 'Incident');
        }
      }
    } catch (error) {
      console.error('[AI Orchestrator] Incident Error:', error);
    } finally {
      this.broadcastProcessingState(false);
    }
  }

  async handleIncidentUpdated(incidentData) {
    // If priority changed to high/critical, re-analyze
    await this.handleIncidentCreated(incidentData);
  }

  // --- Helpers ---

  broadcastProcessingState(isThinking, message = '') {
    const io = getIO();
    if (io) {
      io.emit('ai:status', { isThinking, message, timestamp: new Date() });
    }
  }

  broadcastAIResult(eventName, payload) {
    const io = getIO();
    if (io) {
      io.emit(eventName, payload);
    }
  }

  async notifyOrganizers(title, message, priority, category) {
    try {
      // Send persistent notification to Organizers
      const organizers = await User.find({ role: 'Organizer' });
      for (const org of organizers) {
        await NotificationService.sendNotification({
          recipient: org._id,
          title,
          message,
          type: priority === 'CRITICAL' || priority === 'Critical' ? 'WARNING' : 'INFO',
          category: category.toUpperCase(),
          priority: priority.toUpperCase() === 'CRITICAL' ? 'CRITICAL' : priority.toUpperCase() === 'HIGH' ? 'HIGH' : 'NORMAL',
          metadata: { priority }
        });
      }
    } catch (error) {
      console.error('[AI Orchestrator] Notification Error:', error);
    }
  }
}

export const aiOrchestrator = new AIEventOrchestrator();
