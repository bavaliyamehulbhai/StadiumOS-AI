import Stadium from '../models/Stadium.js';
import Match from '../models/Match.js';

// @desc    Create a new stadium
// @route   POST /api/v1/stadiums
// @access  Private/Admin
export const createStadium = async (req, res) => {
  try {
    const { name, city } = req.body;

    // Check duplicate
    const existingStadium = await Stadium.findOne({ name, city, isDeleted: false });
    if (existingStadium) {
      return res.status(400).json({ success: false, message: 'Stadium already exists in this city.' });
    }

    const stadium = await Stadium.create(req.body);
    res.status(201).json({ success: true, data: stadium });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all stadiums (with search, filter, sort, pagination)
// @route   GET /api/v1/stadiums
// @access  Private
export const getAllStadiums = async (req, res) => {
  try {
    const { search, status, country, sort, page = 1, limit = 10 } = req.query;

    const query = { isDeleted: false };

    // Search by name or city
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    // Filters
    if (status) query.status = status;
    if (country) query.country = country;

    // Sorting
    let sortQuery = { createdAt: -1 }; // newest default
    if (sort === 'capacity') sortQuery = { capacity: -1 };
    if (sort === 'name') sortQuery = { name: 1 };

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const stadiums = await Stadium.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Stadium.countDocuments(query);

    res.status(200).json({
      success: true,
      count: stadiums.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: stadiums
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single stadium by ID
// @route   GET /api/v1/stadiums/:id
// @access  Private
export const getStadiumById = async (req, res) => {
  try {
    const stadium = await Stadium.findOne({ _id: req.params.id, isDeleted: false });
    if (!stadium) {
      return res.status(404).json({ success: false, message: 'Stadium not found' });
    }
    res.status(200).json({ success: true, data: stadium });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update stadium
// @route   PUT /api/v1/stadiums/:id
// @access  Private/Admin
export const updateStadium = async (req, res) => {
  try {
    let stadium = await Stadium.findOne({ _id: req.params.id, isDeleted: false });
    if (!stadium) {
      return res.status(404).json({ success: false, message: 'Stadium not found' });
    }

    stadium = await Stadium.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: stadium });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete stadium (Soft Delete)
// @route   DELETE /api/v1/stadiums/:id
// @access  Private/Admin
export const deleteStadium = async (req, res) => {
  try {
    const stadium = await Stadium.findOne({ _id: req.params.id, isDeleted: false });
    if (!stadium) {
      return res.status(404).json({ success: false, message: 'Stadium not found' });
    }

    // Check for active matches
    const upcomingMatches = await Match.findOne({
      stadium: req.params.id,
      status: 'Scheduled'
    });

    if (upcomingMatches) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete stadium with scheduled matches.' 
      });
    }

    // Soft delete
    stadium.isDeleted = true;
    await stadium.save();

    res.status(200).json({ success: true, message: 'Stadium deleted successfully (soft delete)' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
