import performanceService from '../services/volunteerPerformanceService.js';
import recommendationService from '../services/volunteerRecommendationService.js';

export const getOverview = async (req, res) => {
  try {
    const overview = await performanceService.getWorkforceOverview(req.query);
    res.json(overview);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workforce overview', error: error.message });
  }
};

export const getVolunteers = async (req, res) => {
  try {
    const volunteers = await performanceService.getVolunteerDirectory(req.query);
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching volunteer directory', error: error.message });
  }
};

export const getVolunteerProfile = async (req, res) => {
  try {
    const profile = await performanceService.getVolunteerProfile(req.params.id);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching volunteer profile', error: error.message });
  }
};

export const getWorkload = async (req, res) => {
  try {
    const analysis = await performanceService.getWorkloadAnalysis(req.query.stadiumId);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workload analysis', error: error.message });
  }
};

export const getRecommendations = async (req, res) => {
  try {
    const recommendations = await recommendationService.recommendVolunteers(req.body);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Error generating recommendations', error: error.message });
  }
};
