import { analyzeIncident } from '../services/incidentAIService.js';
import IncidentAIAnalysis from '../../models/IncidentAIAnalysis.js';
import Incident from '../../models/Incident.js';

export const getAIAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    const analysis = await IncidentAIAnalysis.findOne({ incident: id });
    
    if (!analysis) {
      return res.status(404).json({ success: false, message: 'AI Analysis not found' });
    }

    res.status(200).json({ success: true, data: analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateAIAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if incident exists
    const incident = await Incident.findById(id);
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    // Force regenerate if requested, else it will use existing or create new
    const forceRegenerate = req.query.regenerate === 'true';
    
    const analysis = await analyzeIncident(id, forceRegenerate);
    
    res.status(200).json({ success: true, data: analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
