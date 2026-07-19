import { generateExecutiveReport } from '../services/analyticsAIService.js';

// POST /api/v1/ai/analytics/generate
export const generateAnalytics = async (req, res) => {
  try {
    const { force = false } = req.body;
    const report = await generateExecutiveReport(force);
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error('generateAnalytics error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate AI analytics.', error: error.message });
  }
};

// GET /api/v1/ai/analytics/dashboard
export const getDashboardSummary = async (req, res) => {
  try {
    // Return from cache if possible, otherwise generate
    const report = await generateExecutiveReport(false);
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error('getDashboardSummary error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve analytics dashboard summary.' });
  }
};
