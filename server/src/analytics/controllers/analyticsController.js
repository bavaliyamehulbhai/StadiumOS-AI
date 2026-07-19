import AnalyticsService from '../services/analyticsService.js';

// @desc    Get Analytics Overview Data
// @route   GET /api/v1/analytics/overview
// @access  Private/(Admin|Organizer)
export const getOverview = async (req, res) => {
  try {
    const { stadiumId, matchId, startDate, endDate } = req.query;
    const data = await AnalyticsService.getOverviewAnalytics({ stadiumId, matchId, startDate, endDate });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Analytics Trends
// @route   GET /api/v1/analytics/trends
// @access  Private/(Admin|Organizer)
export const getTrends = async (req, res) => {
  try {
    const { stadiumId } = req.query;
    const data = await AnalyticsService.getTrends({ stadiumId });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate AI Executive Summary
// @route   POST /api/v1/analytics/executive-summary
// @access  Private/(Admin|Organizer)
export const getExecutiveSummary = async (req, res) => {
  try {
    const { analyticsData } = req.body;
    if (!analyticsData) {
      return res.status(400).json({ success: false, message: 'Analytics data is required for AI summary' });
    }
    
    const summary = await AnalyticsService.generateExecutiveSummary(analyticsData);
    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
