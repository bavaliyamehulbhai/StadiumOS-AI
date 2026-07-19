import { generateAIResponse } from './groqService.js';
import { buildNavigationContext } from './navigationContextService.js';
import { getNavigationSystemPrompt, buildNavigationUserPrompt } from './navigationPromptService.js';
import { processAIRecommendation } from './routeRecommendationService.js';
import NavigationHistory from '../../models/NavigationHistory.js';

export const getSmartNavigation = async (user, destination, options = {}) => {
  // 1. Build Context
  const context = await buildNavigationContext(user, destination, options);

  // 2. Build Prompts
  const systemPrompt = getNavigationSystemPrompt();
  const userPrompt = buildNavigationUserPrompt(context);

  // 3. Call AI via Groq
  const aiResponse = await generateAIResponse(systemPrompt, userPrompt);

  // 4. Process and structure AI Response
  const structuredResponse = processAIRecommendation(aiResponse);

  // 5. Save to NavigationHistory
  const navHistory = new NavigationHistory({
    user: user._id,
    destination: structuredResponse.destination || destination || 'Unknown',
    context: {
      role: context.role,
      ticketInfo: context.ticket ? {
        gate: context.ticket.gate,
        seat: context.ticket.seat,
        section: context.ticket.section
      } : undefined,
      crowdLevel: context.crowd?.length > 0 ? 'High' : 'Low',
      parking: context.parking ? `${context.parking.lot} - ${context.parking.spot}` : undefined,
      incidents: context.incidents?.map(i => i.type) || [],
      accessibilityMode: context.accessibilityMode
    },
    aiRecommendations: structuredResponse.recommendations
  });

  await navHistory.save();

  return {
    ...structuredResponse,
    historyId: navHistory._id
  };
};
