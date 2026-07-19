import mongoose from 'mongoose';
import Incident from '../models/Incident.js';
import VolunteerTask from '../models/VolunteerTask.js';
import Match from '../models/Match.js';
import Notification from '../models/Notification.js';
import AuditLog from '../models/AuditLog.js';
import { aiEventBus, AI_EVENTS } from '../ai/events/aiEvents.js';

let intervalId;

export const startSimulation = () => {
  if (intervalId) return;

  console.log('🌟 Simulation Mode Activated. Generating live updates every 3 minutes...');
  
  // Phase 9: Seed Audit Logs if empty
  (async () => {
    try {
      const auditCount = await AuditLog.countDocuments();
      if (auditCount === 0) {
        console.log('Seeding initial Audit Logs for demo...');
        await AuditLog.insertMany([
          { action: 'System Initialization Complete', module: 'Admin', severity: 'SUCCESS', metadata: { status: 'Online' }, createdAt: new Date(Date.now() - 3600000) },
          { action: 'Admin logged into Command Center', module: 'Authentication', severity: 'INFO', metadata: { ip: '192.168.1.1' }, createdAt: new Date(Date.now() - 3500000) },
          { action: 'Gate A Opened', module: 'Map', severity: 'INFO', createdAt: new Date(Date.now() - 3400000) },
          { action: 'Volunteer (Jane Doe) Checked In', module: 'Volunteer', severity: 'SUCCESS', createdAt: new Date(Date.now() - 3300000) },
          { action: 'AI Incident Summary: High', module: 'Incident', severity: 'WARNING', aiGenerated: true, metadata: { recommendedActions: ['Deploy Security', 'Monitor Crowd'] }, createdAt: new Date(Date.now() - 3200000) },
        ]);
        console.log('✅ Audit Logs Seeded!');
      }
    } catch (e) {
      console.error('Failed to seed audit logs:', e);
    }
  })();

  // Force an immediate critical incident for the AI Command Center demo
  setTimeout(async () => {
    try {
      const reportedIncident = await Incident.findOne({ status: 'Reported' });
      if (reportedIncident) {
        reportedIncident.priority = 'Critical';
        reportedIncident.title = 'Massive Crowd Surge at North Gate';
        reportedIncident.status = 'Assigned';
        await reportedIncident.save();
        
        aiEventBus.emit(AI_EVENTS.INCIDENT_UPDATED, {
          incidentId: reportedIncident._id,
          priority: 'Critical',
          status: 'Assigned'
        });
        console.log('🔥 [Demo] Forced a Critical Incident to trigger AI Orchestrator!');
      }
    } catch (e) {
      console.error(e);
    }
  }, 5000);
  
  intervalId = setInterval(async () => {
    try {
      // 1. Randomly update ticket sales for Upcoming matches
      const upcomingMatch = await Match.findOne({ status: 'Upcoming' });
      if (upcomingMatch && upcomingMatch.availableSeats > 0) {
        const sold = Math.floor(Math.random() * 5) + 1;
        upcomingMatch.bookedSeats += sold;
        upcomingMatch.availableSeats -= sold;
        if (upcomingMatch.availableSeats < 0) upcomingMatch.availableSeats = 0;
        await upcomingMatch.save();
      }

      // 2. Randomly change an incident's status
      if (Math.random() > 0.5) {
        const reportedIncident = await Incident.findOne({ status: 'Reported' });
        if (reportedIncident) {
          reportedIncident.status = 'Assigned';
          await reportedIncident.save();
          // Spawn notification
          await Notification.create({
            recipient: reportedIncident.reportedBy,
            title: 'Incident Update',
            message: `Your incident "${reportedIncident.title}" has been assigned to a volunteer.`,
            type: 'INFO',
            category: 'INCIDENT',
            priority: 'NORMAL'
          });
          
          // Phase 8: Emit event to AI Orchestrator
          aiEventBus.emit(AI_EVENTS.INCIDENT_UPDATED, {
            incidentId: reportedIncident._id,
            priority: reportedIncident.priority,
            status: reportedIncident.status
          });
        }
      }

      // 3. Randomly complete a task
      if (Math.random() > 0.7) {
        const activeTask = await VolunteerTask.findOne({ status: 'In Progress' });
        if (activeTask) {
          activeTask.status = 'Completed';
          activeTask.completedAt = new Date();
          await activeTask.save();
          // Spawn notification for the organizer
          await Notification.create({
            recipient: activeTask.assignedBy,
            title: 'Task Completed',
            message: `Task "${activeTask.title}" has been completed.`,
            type: 'SUCCESS',
            category: 'VOLUNTEER',
            priority: 'NORMAL'
          });
        }
      }

      console.log('🔄 Simulation Update Tick Processed.');

    } catch (error) {
      console.error('Simulation error:', error);
    }
  }, 180000); // Changed to 3 minutes to avoid Groq API rate limits
};

export const stopSimulation = () => {
  if (intervalId) {
    clearInterval(intervalId);
    console.log('🛑 Simulation Mode Deactivated.');
  }
};
