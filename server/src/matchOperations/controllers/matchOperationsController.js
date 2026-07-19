import matchOperationsService from '../services/matchOperationsService.js';

export const getOperationsState = async (req, res) => {
  try {
    const state = await matchOperationsService.getOperationsState(req.params.matchId);
    res.json({ success: true, data: state });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const startOperations = async (req, res) => {
  try {
    const match = await matchOperationsService.startOperations(req.params.matchId, req.user._id, req.user.role);
    res.json({ success: true, data: match });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const endOperations = async (req, res) => {
  try {
    const match = await matchOperationsService.endOperations(req.params.matchId, req.user._id, req.user.role);
    res.json({ success: true, data: match });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const triggerEmergency = async (req, res) => {
  try {
    const match = await matchOperationsService.triggerEmergency(req.params.matchId, req.user._id, req.user.role);
    res.json({ success: true, data: match });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resolveEmergency = async (req, res) => {
  try {
    const match = await matchOperationsService.resolveEmergency(req.params.matchId, req.user._id, req.user.role);
    res.json({ success: true, data: match });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
