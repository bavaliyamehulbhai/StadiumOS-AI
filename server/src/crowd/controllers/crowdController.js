import { CrowdService } from '../services/crowdService.js';

export const getLiveCrowd = async (req, res) => {
  try {
    const crowd = await CrowdService.getLiveCrowd(req.query.stadium);
    res.status(200).json({ success: true, data: crowd });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getGates = async (req, res) => {
  try {
    const gates = await CrowdService.getGates(req.query.stadium);
    res.status(200).json({ success: true, data: gates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getParking = async (req, res) => {
  try {
    const parking = await CrowdService.getParking(req.query.stadium);
    res.status(200).json({ success: true, data: parking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
