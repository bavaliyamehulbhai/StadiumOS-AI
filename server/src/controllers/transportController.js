import { Transport } from '../models/Transport.js';

// @desc    Get all transport options for a stadium
// @route   GET /api/v1/transport/:stadiumId
// @access  Private
export const getTransportByStadium = async (req, res) => {
  try {
    const transport = await Transport.find({ stadium: req.params.stadiumId }).sort('estimatedTime');
    res.status(200).json({ success: true, data: transport });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get recommended transport options (Simulation)
// @route   GET /api/v1/transport/recommendations/:stadiumId
// @access  Private
export const getRecommendations = async (req, res) => {
  try {
    // In a real app, this would use the user's location, traffic data, and ML
    // For this hackathon, we fetch the transport options and tag the best ones based on rules
    
    const transport = await Transport.find({ stadium: req.params.stadiumId });
    
    let recommendations = transport.map(t => {
      let doc = t.toJSON();
      if (doc.type === 'Metro') {
        doc.recommendationTag = 'Best Value';
      } else if (doc.type === 'Taxi' || doc.type === 'Ride Share') {
        doc.recommendationTag = 'Fastest';
      } else if (doc.type === 'Walking') {
        doc.recommendationTag = 'Healthy';
      } else if (doc.type === 'Bus') {
        doc.recommendationTag = 'Budget';
      }
      return doc;
    });

    // Sort by ETA
    recommendations.sort((a, b) => a.estimatedTime - b.estimatedTime);

    res.status(200).json({ success: true, data: recommendations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
