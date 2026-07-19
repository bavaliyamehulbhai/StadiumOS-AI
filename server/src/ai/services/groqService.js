import Groq from 'groq-sdk';
import { aiConfig } from '../config/aiConfig.js';
import { AI_ERRORS } from '../utils/constants.js';
import aiHealthService from '../../monitoring/services/aiHealthService.js';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateAIResponse = async (systemMessage, userMessage, history = [], feature = 'General') => {
  const start = process.hrtime();
  try {
    // Format messages for Groq
    const messages = [
      { role: 'system', content: systemMessage },
      ...history,
      { role: 'user', content: userMessage }
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: aiConfig.model,
      temperature: aiConfig.temperature,
      max_tokens: aiConfig.maxTokens,
      top_p: aiConfig.topP,
    });

    const diff = process.hrtime(start);
    const duration = (diff[0] * 1e3) + (diff[1] * 1e-6);
    aiHealthService.recordCall(feature, duration, true, null);

    return chatCompletion.choices[0]?.message?.content || 'No response generated.';
  } catch (error) {
    console.error('Groq API Error:', error);
    
    const diff = process.hrtime(start);
    const duration = (diff[0] * 1e3) + (diff[1] * 1e-6);
    aiHealthService.recordCall(feature, duration, false, error);
    
    // Handle specific Groq errors here if necessary
    if (error.status === 429) {
      throw new Error(AI_ERRORS.RATE_LIMIT_EXCEEDED);
    }
    
    throw new Error(AI_ERRORS.SERVICE_UNAVAILABLE);
  }
};

// Placeholder for streaming support in MVP
export const generateAIResponseStream = async (systemMessage, userMessage, history = []) => {
  // Can be implemented using groq.chat.completions.create with stream: true
  throw new Error('Streaming not fully implemented in MVP yet.');
};
