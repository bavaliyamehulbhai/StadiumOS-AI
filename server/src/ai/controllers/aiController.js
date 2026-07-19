import { generateAIResponse } from '../services/groqService.js';
import { getSystemPrompt, buildUserPrompt } from '../services/promptService.js';
import { buildContext } from '../services/contextService.js';
import { getConversationHistory, saveConversation } from '../services/memoryService.js';
import { formatResponse } from '../services/responseService.js';
import { AI_ROLES } from '../utils/constants.js';

const handleAIRequest = async (req, res, roleId, type, getCustomContext = () => ({})) => {
  try {
    const customContext = getCustomContext(req);
    const context = buildContext(req, customContext);
    const systemPrompt = getSystemPrompt(roleId);
    
    // Depending on type, the prompt might just use req.body or specific fields
    const userPrompt = buildUserPrompt(type, context, req.body);
    
    // Only fetch history for chat and navigation
    const useHistory = ['chat', 'navigation'].includes(type);
    const history = useHistory ? await getConversationHistory(context.userId) : [];

    const rawResponse = await generateAIResponse(systemPrompt, userPrompt, history);
    const formattedResponse = formatResponse(rawResponse);

    if (useHistory && context.userId) {
      // Store original query if it was chat/nav
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
