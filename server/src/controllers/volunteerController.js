import User from '../models/User.js';
import VolunteerTask from '../models/VolunteerTask.js';
import { VolunteerSocketService } from '../services/volunteerSocketService.js';

// @desc    Update volunteer availability status
// @route   PATCH /api/v1/volunteers/status
// @access  Private (Volunteer)
export const updateVolunteerStatus = async (req, res) => {
  try {
    const { availability } = req.body;
    
    if (!['Available', 'Busy', 'Offline', 'Emergency'].includes(availability)) {
      return res.status(400).json({ success: false, message: 'Invalid availability status' });
    }

    const user = await User.findById(req.user._id);
    if (!user || user.role !== 'Volunteer') {
      return res.status(403).json({ success: false, message: 'Only volunteers can update this status' });
    }

    user.availability = availability;
    await user.save();

    VolunteerSocketService.emitVolunteerStatusUpdated(user._id, availability);

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get volunteer performance stats
// @route   GET /api/v1/volunteers/performance
// @access  Private
export const getVolunteerPerformance = async (req, res) => {
  try {
    const volunteerId = req.user.role === 'Volunteer' ? req.user._id : req.query.volunteerId;
    if (!volunteerId) return res.status(400).json({ success: false, message: 'Volunteer ID required' });

    const user = await User.findById(volunteerId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const tasks = await VolunteerTask.find({ assignedVolunteer: volunteerId });
    
    const completed = tasks.filter(t => t.status === 'Completed' || t.status === 'Verified');
    const assignedCount = tasks.length;
    const completionRate = assignedCount ? Math.round((completed.length / assignedCount) * 100) : 0;

    // Optional: Calculate average response time based on timeline logic if available
    
    res.status(200).json({ 
      success: true, 
      data: {
        performanceScore: user.performanceScore,
        completedTasks: user.completedTasks,
        totalAssigned: assignedCount,
        completionRate,
        availability: user.availability
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
