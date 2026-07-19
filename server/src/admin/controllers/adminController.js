import User from '../../models/User.js';
import Stadium from '../../models/Stadium.js';
import Incident from '../../models/Incident.js';
import Match from '../../models/Match.js';
import SystemConfig from '../../models/SystemConfig.js';
import AuditLog from '../../models/AuditLog.js';
import EmergencyRule from '../../models/EmergencyRule.js';

// --- OVERVIEW ---
export const getOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeStadiums = await Stadium.countDocuments({ status: 'Active' });
    const activeMatches = await Match.countDocuments({ status: { $in: ['Live', 'Upcoming'] } });
    const activeIncidents = await Incident.countDocuments({ status: { $ne: 'Resolved' } });
    const onlineVolunteers = await User.countDocuments({ role: 'Volunteer', status: 'Active' }); // Mocked online status

    res.json({
      success: true,
      data: {
        totalUsers,
        activeStadiums,
        activeMatches,
        activeIncidents,
        onlineVolunteers,
        criticalAlerts: await Incident.countDocuments({ priority: 'Critical', status: { $ne: 'Resolved' } })
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- USERS ---
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (id === req.user._id.toString() && status === 'Inactive') {
      return res.status(400).json({ success: false, message: 'You cannot deactivate your own admin account.' });
    }

    const user = await User.findByIdAndUpdate(id, { status }, { new: true }).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (id === req.user._id.toString() && role !== 'Admin') {
      return res.status(400).json({ success: false, message: 'You cannot remove your own admin privileges.' });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own admin account.' });
    }

    await User.findByIdAndDelete(id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- CONFIGURATION ---
export const getConfig = async (req, res) => {
  try {
    let config = await SystemConfig.findOne();
    if (!config) config = await SystemConfig.create({});
    res.json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateConfig = async (req, res) => {
  try {
    const updates = req.body;
    updates.updatedBy = req.user._id;

    let config = await SystemConfig.findOne();
    if (!config) {
      config = await SystemConfig.create(updates);
    } else {
      config = await SystemConfig.findOneAndUpdate({}, updates, { new: true, upsert: true });
    }

    res.json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- EMERGENCY RULES ---
export const getEmergencyRules = async (req, res) => {
  try {
    const rules = await EmergencyRule.find();
    if (rules.length === 0) {
      // Seed defaults
      const defaults = [
        { type: 'Medical', severity: 'Critical' },
        { type: 'Security', severity: 'High' },
        { type: 'Fire', severity: 'Critical' }
      ];
      await EmergencyRule.insertMany(defaults);
      const newRules = await EmergencyRule.find();
      return res.json({ success: true, data: newRules });
    }
    res.json({ success: true, data: rules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEmergencyRule = async (req, res) => {
  try {
    const { id } = req.params;
    const rule = await EmergencyRule.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ success: true, data: rule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getSecurityOverview = async (req, res) => {
  try {
    const activeIncidents = await Incident.countDocuments({ incidentType: 'Security', status: { $nin: ['Resolved', 'Closed'] } });
    const lockedAccounts = await User.countDocuments({ status: 'Inactive' });
    const failedLogins = await AuditLog.countDocuments({ action: 'Login Failed' });
    
    // Fetch recent security incidents and failed logins
    const recentThreats = await AuditLog.find({ action: { $in: ['Login Failed', 'Security Alert'] } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');

    res.json({
      success: true,
      data: {
        activeIncidents,
        lockedAccounts,
        failedLogins,
        recentThreats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
