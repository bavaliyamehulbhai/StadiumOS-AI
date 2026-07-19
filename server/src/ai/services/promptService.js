import { SYSTEM_PROMPTS } from '../utils/systemPrompts.js';
import { 
  getChatTemplate, 
  getNavigationTemplate, 
  getIncidentTemplate, 
  getCrowdTemplate, 
  getEmergencyTemplate 
} from '../utils/promptTemplates.js';

export const getSystemPrompt = (roleId) => {
  return SYSTEM_PROMPTS[roleId] || SYSTEM_PROMPTS.stadium_assistant;
};

export const buildUserPrompt = (type, context, data) => {
  switch (type) {
    case 'chat':
      return getChatTemplate(context, data.query);
    case 'navigation':
      return getNavigationTemplate(context, data.query);
    case 'incident':
      return getIncidentTemplate(data.reports);
    case 'crowd':
      return getCrowdTemplate(data.metrics);
    case 'emergency':
      return getEmergencyTemplate(context, data.emergencyDetails);
    default:
      return data.query || JSON.stringify(data);
  }
};
