import Match from '../models/Match.js';
import Stadium from '../models/Stadium.js';

// @desc    Create a new match
// @route   POST /api/v1/matches
// @access  Private/Admin
export const createMatch = async (req, res) => {
  try {
    const { teamA, teamB, stadium: stadiumId, matchDate, totalSeats, bookedSeats = 0 } = req.body;

    // 1. Check if Stadium exists and validate capacity
    const stadium = await Stadium.findById(stadiumId);
    if (!stadium || stadium.isDeleted) {
      return res.status(404).json({ success: false, message: 'Stadium not found or inactive.' });
    }
    if (totalSeats > stadium.capacity) {
      return res.status(400).json({ 
        success: false, 
        message: `Total seats (${totalSeats}) cannot exceed stadium capacity (${stadium.capacity}).` 
      });
    }

    // 2. Prevent Duplicate Matches (same teams, same date)
    const normalizedDate = new Date(matchDate);
    normalizedDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(normalizedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const duplicateMatch = await Match.findOne({
      teamA,
      teamB,
      isDeleted: false,
      matchDate: {
        $gte: normalizedDate,
        $lt: nextDay
      }
    });

    if (duplicateMatch) {
      return res.status(400).json({ success: false, message: 'Match already exists between these teams on this date.' });
    }

    // 3. Prevent Stadium Conflict (One match per stadium per day)
    const stadiumConflict = await Match.findOne({
      stadium: stadiumId,
      isDeleted: false,
      matchDate: {
        $gte: normalizedDate,
        $lt: nextDay
      }
    });

    if (stadiumConflict) {
      return res.status(400).json({ 
        success: false, 
        message: 'Stadium is already booked for another match on this date.' 
      });
    }

    // 4. Calculate available seats
    const availableSeats = totalSeats - bookedSeats;

    const match = await Match.create({
      ...req.body,
      createdBy: req.user._id,
      availableSeats
    });

    res.status(201).json({ success: true, data: match });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all matches
// @route   GET /api/v1/matches
// @access  Private
export const getMatches = async (req, res) => {
  try {
    const { search, status, stage, stadium, sort, page = 1, limit = 10 } = req.query;

    const query = { isDeleted: false };

    // Search by title or teams
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { teamA: { $regex: search, $options: 'i' } },
        { teamB: { $regex: search, $options: 'i' } }
      ];
    }

    // Filters
    if (status) query.status = status;
    if (stage) query.stage = stage;
    if (stadium) query.stadium = stadium;

    // Sorting
    let sortQuery = { matchDate: 1 }; // closest default
    if (sort === 'newest') sortQuery = { createdAt: -1 };
    if (sort === 'oldest') sortQuery = { createdAt: 1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const matches = await Match.find(query)
      .populate('stadium', 'name city capacity image')
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Match.countDocuments(query);

    res.status(200).json({
      success: true,
      count: matches.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: matches
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single match
// @route   GET /api/v1/matches/:id
// @access  Private
export const getMatchById = async (req, res) => {
  try {
    const match = await Match.findOne({ _id: req.params.id, isDeleted: false })
      .populate('stadium', 'name city capacity parkingCapacity gates address image')
      .populate('createdBy', 'name email');
      
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }
    res.status(200).json({ success: true, data: match });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update match
// @route   PUT /api/v1/matches/:id
// @access  Private/Admin
export const updateMatch = async (req, res) => {
  try {
    let match = await Match.findOne({ _id: req.params.id, isDeleted: false });
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    // Prevent Editing Live Match Core Fields
    if (match.status === 'Live') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot edit core details of a Live match. Only status can be changed.' 
      });
    }

    // If total or booked seats are updated, recalculate available
    const totalSeats = req.body.totalSeats !== undefined ? req.body.totalSeats : match.totalSeats;
    const bookedSeats = req.body.bookedSeats !== undefined ? req.body.bookedSeats : match.bookedSeats;
    
    // Check stadium capacity if stadium or totalSeats changes
    const stadiumId = req.body.stadium || match.stadium;
    const stadium = await Stadium.findById(stadiumId);
    if (totalSeats > stadium.capacity) {
      return res.status(400).json({ 
        success: false, 
        message: `Total seats (${totalSeats}) cannot exceed stadium capacity (${stadium.capacity}).` 
      });
    }

    const availableSeats = totalSeats - bookedSeats;

    match = await Match.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, availableSeats },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: match });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change match status only
// @route   PATCH /api/v1/matches/:id/status
// @access  Private/Admin
export const changeMatchStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Upcoming', 'Live', 'Completed', 'Cancelled', 'Postponed'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    let match = await Match.findOne({ _id: req.params.id, isDeleted: false });
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    match.status = status;
    await match.save();

    // TODO: Socket.io broadcast match:status:update here for real-time dashboards

    res.status(200).json({ success: true, data: match });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete match (Soft Delete)
// @route   DELETE /api/v1/matches/:id
// @access  Private/Admin
export const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findOne({ _id: req.params.id, isDeleted: false });
    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    if (match.status === 'Live') {
      return res.status(400).json({ success: false, message: 'Cannot delete a Live match.' });
    }

    match.isDeleted = true;
    await match.save();

    res.status(200).json({ success: true, message: 'Match deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
