import { getSmartNavigation } from '../services/navigationAIService.js';

export const getSmartRoute = async (req, res) => {
  try {
    const { destination, accessibilityMode } = req.body;
    
    // We expect req.user to be set by auth middleware
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const navigationResult = await getSmartNavigation(req.user, destination, {
      accessibilityMode
    });

    res.status(200).json({
      success: true,
      data: navigationResult
    });
  } catch (error) {
    console.error('AI Navigation Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI navigation route',
      error: error.message
    });
  }
};
