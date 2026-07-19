export const aiConfig = {
  model: process.env.AI_MODEL || 'llama-3.3-70b-versatile',
  temperature: parseFloat(process.env.AI_TEMPERATURE || '0.3'),
  maxTokens: parseInt(process.env.AI_MAX_TOKENS || '1500', 10),
  timeoutMs: parseInt(process.env.AI_TIMEOUT || '30000', 10),
  maxRetries: 2,
  topP: 0.9,
};
