import EmergencyBroadcastService from '../services/emergencyBroadcastService.js';
import EmergencyBroadcast from '../../models/EmergencyBroadcast.js';

export const getActiveBroadcasts = async (req, res) => {
  try {
    const broadcasts = await EmergencyBroadcast.find({ status: 'ACTIVE' }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: broadcasts.length, data: broadcasts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getBroadcastHistory = async (req, res) => {
  try {
    const broadcasts = await EmergencyBroadcast.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: broadcasts.length, data: broadcasts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getBroadcastById = async (req, res) => {
  try {
    const broadcast = await EmergencyBroadcast.findById(req.params.id);
    if (!broadcast) {
      return res.status(404).json({ success: false, message: 'Broadcast not found' });
    }
    res.status(200).json({ success: true, data: broadcast });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const createBroadcastDraft = async (req, res) => {
  try {
    const broadcast = await EmergencyBroadcastService.createDraft(req.body, req.user._id);
    res.status(201).json({ success: true, data: broadcast });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const activateBroadcast = async (req, res) => {
  try {
    const broadcast = await EmergencyBroadcastService.activateBroadcast(req.params.id, req.user._id);
    res.status(200).json({ success: true, data: broadcast });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resolveBroadcast = async (req, res) => {
  try {
    const broadcast = await EmergencyBroadcastService.resolveBroadcast(req.params.id, req.user._id);
    res.status(200).json({ success: true, data: broadcast });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const acknowledgeBroadcast = async (req, res) => {
  try {
    const broadcast = await EmergencyBroadcast.findById(req.params.id);
    if (!broadcast) return res.status(404).json({ success: false, message: 'Broadcast not found' });

    // Ensure not already acknowledged
    const alreadyAck = broadcast.acknowledgedBy.find(a => a.userId.toString() === req.user._id.toString());
    if (!alreadyAck) {
      broadcast.acknowledgedBy.push({ userId: req.user._id, acknowledgedAt: new Date() });
      await broadcast.save();
    }

    res.status(200).json({ success: true, message: 'Acknowledged' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
