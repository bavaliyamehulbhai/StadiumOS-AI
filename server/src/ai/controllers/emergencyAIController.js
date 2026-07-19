import { generateEmergencyAnalysis } from '../services/emergencyAIService.js';
import { buildEmergencyContext } from '../services/emergencyContextService.js';
import { rankSafeExits } from '../services/evacuationService.js';
import { getResourcePlan } from '../services/resourcePlanningService.js';
import EmergencyAIAnalysis from '../../models/EmergencyAIAnalysis.js';

// POST /api/v1/ai/emergency/analyze
// Full AI Command Brief — the main endpoint
export const analyzeEmergency = async (req, res) => {
  try {
    const { emergencyId, force = false } = req.body;
    if (!emergencyId) {
      return res.status(400).json({ success: false, message: 'emergencyId is required.' });
    }

    const analysis = await generateEmergencyAnalysis(emergencyId, force);
    res.status(200).json({ success: true, data: analysis });
  } catch (error) {
    console.error('analyzeEmergency error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate AI Emergency Analysis.', error: error.message });
  }
};

// POST /api/v1/ai/emergency/route
// Just the safe exits — lightweight call for fan navigation
export const getSafeRoute = async (req, res) => {
  try {
    const { emergencyId } = req.body;
    if (!emergencyId) {
      return res.status(400).json({ success: false, message: 'emergencyId is required.' });
    }

    // Check if full analysis exists and return its exits
    const existing = await EmergencyAIAnalysis.findOne({ emergency: emergencyId }).select('safeExits affectedZone');
    if (existing) {
      return res.status(200).json({ success: true, data: existing.safeExits });
    }

    // Otherwise compute deterministically
    const context = await buildEmergencyContext(emergencyId);
    const safeExits = rankSafeExits([], context.zone);
    res.status(200).json({ success: true, data: safeExits });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get safe route.' });
  }
};

// POST /api/v1/ai/emergency/evacuation
export const getEvacuationPlan = async (req, res) => {
  try {
    const { emergencyId } = req.body;
    if (!emergencyId) return res.status(400).json({ success: false, message: 'emergencyId is required.' });

    const existing = await EmergencyAIAnalysis.findOne({ emergency: emergencyId })
      .select('evacuationSteps estimatedResolutionMinutes safeExits');
    if (existing) return res.status(200).json({ success: true, data: existing });

    // Trigger full analysis to generate evacuation steps
    const analysis = await generateEmergencyAnalysis(emergencyId);
    res.status(200).json({ success: true, data: {
      evacuationSteps: analysis.evacuationSteps,
      estimatedResolutionMinutes: analysis.estimatedResolutionMinutes,
      safeExits: analysis.safeExits
    }});
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get evacuation plan.' });
  }
};

// POST /api/v1/ai/emergency/medical
export const getMedicalGuidance = async (req, res) => {
  try {
    const { emergencyId } = req.body;
    if (!emergencyId) return res.status(400).json({ success: false, message: 'emergencyId is required.' });

    const existing = await EmergencyAIAnalysis.findOne({ emergency: emergencyId })
      .select('medicalGuidance safeExits affectedZone');
    if (existing) return res.status(200).json({ success: true, data: existing });

    const analysis = await generateEmergencyAnalysis(emergencyId);
    res.status(200).json({ success: true, data: {
      medicalGuidance: analysis.medicalGuidance,
      safeExits: analysis.safeExits,
      affectedZone: analysis.affectedZone
    }});
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get medical guidance.' });
  }
};

// POST /api/v1/ai/emergency/resources
export const getResourcePlanRoute = async (req, res) => {
  try {
    const { emergencyId, emergencyType } = req.body;

    if (emergencyType && !emergencyId) {
      // Quick plan without an emergency in DB
      const plan = getResourcePlan(emergencyType);
      return res.status(200).json({ success: true, data: plan });
    }

    if (!emergencyId) return res.status(400).json({ success: false, message: 'emergencyId or emergencyType is required.' });

    const existing = await EmergencyAIAnalysis.findOne({ emergency: emergencyId }).select('resources');
    if (existing) return res.status(200).json({ success: true, data: existing.resources });

    const analysis = await generateEmergencyAnalysis(emergencyId);
    res.status(200).json({ success: true, data: analysis.resources });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get resource plan.' });
  }
};

// GET /api/v1/ai/emergency/:id
export const getAnalysis = async (req, res) => {
  try {
    const analysis = await EmergencyAIAnalysis.findOne({ emergency: req.params.id })
      .populate('emergency', 'type title zone severity status');

    if (!analysis) {
      return res.status(404).json({ success: false, message: 'No AI analysis found for this emergency. Trigger /analyze first.' });
    }
    res.status(200).json({ success: true, data: analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve analysis.' });
  }
};
