import { generateAIResponse } from '../services/groqService.js';
import { getSystemPrompt, buildUserPrompt } from '../services/promptService.js';
import { buildContext } from '../services/contextService.js';
import { getConversationHistory, saveConversation } from '../services/memoryService.js';
import { formatResponse } from '../services/responseService.js';
import { getPreferences } from '../services/languageService.js';
import { getLanguageDetails } from '../services/localizationService.js';
import { AI_ROLES } from '../utils/constants.js';
import AIConversation from '../../models/AIConversation.js';

const handleAIRequest = async (req, res, roleId, type, getCustomContext = () => ({})) => {
  try {
    const customContext = getCustomContext(req);
    // buildContext now returns a promise because it queries the DB
    const context = await buildContext(req, customContext);
    let systemPrompt = getSystemPrompt(roleId);
    
    // Phase 8: Inject User Language Preference
    if (req.user && req.user._id) {
      const prefs = await getPreferences(req.user._id);
      if (prefs && prefs.preferredLanguage && prefs.preferredLanguage !== 'en') {
        const langDetails = getLanguageDetails(prefs.preferredLanguage);
        systemPrompt += `\n\nCRITICAL MULTILINGUAL INSTRUCTION: You MUST reply entirely in ${langDetails.name} (${langDetails.nativeName}). DO NOT translate stadium identifiers like Gate A, P2, Exit D, Seat A12, Ticket ID, Match ID, or SOS. Also DO NOT translate any UI Action Buttons enclosed in brackets. Keep them exactly as: [Open Map], [Navigate], [View Ticket], [View Tasks].`;
      }
    }
    
    const userPrompt = buildUserPrompt(type, context, req.body);
    
    const useHistory = ['chat', 'navigation'].includes(type);
    const history = useHistory ? await getConversationHistory(context.userId) : [];

    const rawResponse = await generateAIResponse(systemPrompt, userPrompt, history);
    const formattedResponse = formatResponse(rawResponse);

    if (useHistory && context.userId) {
      await saveConversation(context.userId, context.role, req.body.query, formattedResponse, context);
    }

    res.json({ success: true, reply: formattedResponse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const handleChat = (req, res) => {
  handleAIRequest(req, res, AI_ROLES.STADIUM_ASSISTANT, 'chat', (req) => req.body.customContext || {});
};

export const handleNavigation = (req, res) => {
  handleAIRequest(req, res, AI_ROLES.STADIUM_ASSISTANT, 'navigation', (req) => ({
    location: req.body.currentLocation,
    destination: req.body.destination,
    accessibility: req.body.accessibilityNeeded ? 'Yes' : 'No'
  }));
};

export const handleIncidentSummary = (req, res) => {
  handleAIRequest(req, res, AI_ROLES.INCIDENT_MANAGER, 'incident');
};

export const handleCrowdAnalysis = (req, res) => {
  handleAIRequest(req, res, AI_ROLES.CROWD_ANALYST, 'crowd');
};

export const handleEmergency = (req, res) => {
  handleAIRequest(req, res, AI_ROLES.EMERGENCY_EXPERT, 'emergency');
};

// New endpoints for Phase 2
export const getHistory = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    const history = await AIConversation.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);
      
    res.json({ success: true, history: history.reverse() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const clearHistory = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    await AIConversation.deleteMany({ user: req.user._id });
    res.json({ success: true, message: 'History cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPrompts = (req, res) => {
  const role = req.user?.role || 'Fan';
  let prompts = [];
  
  if (role === 'Fan') {
    prompts = [
      "Where is my gate?",
      "Find nearest washroom",
      "Where can I park?",
      "Find food court",
      "Emergency Help",
      "Find my seat"
    ];
  } else if (role === 'Volunteer') {
    prompts = [
      "Show my tasks",
      "Navigate to incident",
      "Report emergency",
      "Nearest medical room"
    ];
  } else if (role === 'Organizer') {
    prompts = [
      "Summarize incidents",
      "Crowd overview",
      "Highest risk area",
      "Volunteer status"
    ];
  } else if (role === 'Admin') {
    prompts = [
      "Attendance summary",
      "Today's analytics",
      "Peak crowd",
      "System health"
    ];
  }
  
  res.json({ success: true, prompts });
};
