import Stadium from '../models/Stadium.js';
import POI from '../models/POI.js';

// @desc    Get all stadium coordinates for base map
// @route   GET /api/v1/maps/stadiums
// @access  Private
export const getAllStadiumMaps = async (req, res) => {
  try {
    const stadiums = await Stadium.find({ isDeleted: false })
      .select('name city latitude longitude zoom capacity status image');
    
    res.status(200).json({ success: true, data: stadiums });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get specific stadium map details
// @route   GET /api/v1/maps/stadium/:id
// @access  Private
export const getStadiumMapDetails = async (req, res) => {
  try {
    const stadium = await Stadium.findById(req.params.id)
      .select('-__v -createdAt -updatedAt');

    if (!stadium) {
      return res.status(404).json({ success: false, message: 'Stadium not found' });
    }

    res.status(200).json({ success: true, data: stadium });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get POIs for a specific stadium
// @route   GET /api/v1/maps/stadium/:id/pois
// @access  Private
export const getStadiumPOIs = async (req, res) => {
  try {
    const { type, status } = req.query;
    
    let query = { 
      stadium: req.params.id,
      isDeleted: false 
    };

    if (type) query.type = type;
    if (status) query.status = status;

    const pois = await POI.find(query).select('-createdAt -updatedAt -__v');
    
    res.status(200).json({ success: true, count: pois.length, data: pois });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Search map globally
// @route   GET /api/v1/maps/search?q=
// @access  Private
export const searchMap = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    // Search stadiums
    const stadiums = await Stadium.find({
      $text: { $search: q },
      isDeleted: false
    }).select('name latitude longitude type');

    // Search POIs
    const pois = await POI.find({
      $text: { $search: q },
      isDeleted: false
    }).populate('stadium', 'name latitude longitude');

    res.status(200).json({ 
      success: true, 
      data: {
        stadiums,
        pois
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
