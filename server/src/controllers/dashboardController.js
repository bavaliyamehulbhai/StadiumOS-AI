import DashboardService from '../services/dashboardService.js';

// @desc    Get Admin Dashboard Data
// @route   GET /api/v1/dashboard/admin
// @access  Private/Admin
export const getAdminDashboard = async (req, res) => {
  try {
    const data = await DashboardService.getAdminDashboard();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Organizer Dashboard Data
// @route   GET /api/v1/dashboard/organizer
// @access  Private/Organizer
export const getOrganizerDashboard = async (req, res) => {
  try {
    const data = await DashboardService.getOrganizerDashboard();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Volunteer Dashboard Data
// @route   GET /api/v1/dashboard/volunteer
// @access  Private/Volunteer
export const getVolunteerDashboard = async (req, res) => {
  try {
    const data = await DashboardService.getVolunteerDashboard(req.user._id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Fan Dashboard Data
// @route   GET /api/v1/dashboard/fan
// @access  Private/Fan
export const getFanDashboard = async (req, res) => {
  try {
    const data = await DashboardService.getFanDashboard(req.user._id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Global Activities Timeline
// @route   GET /api/v1/dashboard/activities
// @access  Private
export const getActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const data = await DashboardService.getRecentActivities(limit);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Charts Data
// @route   GET /api/v1/dashboard/charts
// @access  Private/(Admin|Organizer)
export const getCharts = async (req, res) => {
  try {
    const data = await DashboardService.getChartsData();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Global Live Status Strip Data
// @route   GET /api/v1/dashboard/live-status
// @access  Private
export const getLiveStatus = async (req, res) => {
  try {
    const data = await DashboardService.getLiveStatus();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
