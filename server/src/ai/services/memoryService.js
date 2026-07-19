import AIConversation from '../../models/AIConversation.js';

export const getConversationHistory = async (userId, limit = 10) => {
  if (!userId) return [];
  
  try {
    const history = await AIConversation.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit);

    // Format for Groq: older messages first
    return history.reverse().flatMap(conv => [
      { role: 'user', content: conv.message },
      { role: 'assistant', content: conv.response }
    ]);
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    return [];
  }
};

export const saveConversation = async (userId, role, message, response, context) => {
  if (!userId) return;

  try {
    await AIConversation.create({
      user: userId,
      role: role,
      message,
      response,
      context
    });
  } catch (error) {
    console.error('Error saving conversation:', error);
  }
};
