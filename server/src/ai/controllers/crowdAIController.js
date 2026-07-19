import { generateCrowdInsights } from '../services/crowdAIService.js';

export const getInsights = async (req, res) => {
  try {
    const { stadiumId } = req.body || req.query;
    const insights = await generateCrowdInsights(stadiumId);
    res.status(200).json({ success: true, data: insights });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate AI Crowd Insights', error: error.message });
  }
};

export const getPredictions = async (req, res) => {
  try {
    const { stadiumId } = req.body || req.query;
    const insights = await generateCrowdInsights(stadiumId);
    res.status(200).json({ success: true, data: insights.predictions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate AI Predictions' });
  }
};

export const recommendGate = async (req, res) => {
  try {
    // A quick hack: return the recommendations specifically targeting 'Gate'
    const { stadiumId } = req.query;
    const insights = await generateCrowdInsights(stadiumId);
    
    // Filter recommendations or pick the best gate based on predictions
    const gateRecs = insights.recommendations.filter(r => r.actionType === 'Redirect Crowd' || r.actionType === 'Open Gate');
    
    res.status(200).json({ success: true, data: gateRecs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to recommend gate' });
  }
};

export const recommendVolunteers = async (req, res) => {
  try {
    const { stadiumId } = req.query;
    const insights = await generateCrowdInsights(stadiumId);
    
    const volRecs = insights.recommendations.filter(r => r.actionType === 'Deploy Volunteers' || r.actionType === 'Medical Dispatch');
    
    res.status(200).json({ success: true, data: volRecs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to recommend volunteers' });
  }
};

export const queueAnalysis = async (req, res) => {
  try {
    const { stadiumId } = req.body || req.query;
    const insights = await generateCrowdInsights(stadiumId);
    
    // For queue analysis, we look for predictions where risk is related to queues
    const queueRisks = insights.predictions.filter(p => p.reasoning.toLowerCase().includes('queue'));
    
    res.status(200).json({ success: true, data: queueRisks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to analyze queues' });
  }
};
