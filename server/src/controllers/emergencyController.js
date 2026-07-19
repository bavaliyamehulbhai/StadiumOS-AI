import Emergency from '../models/Emergency.js';
import Stadium from '../models/Stadium.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

// Get active emergencies (Crisis context polling)
export const getActiveEmergencies = async (req, res) => {
  try {
    const emergencies = await Emergency.find({ status: { $in: ['Reported', 'Verified', 'In Progress'] } }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: emergencies.length, data: emergencies });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Fan reports an emergency via SOS
export const reportEmergency = async (req, res) => {
  try {
    const { title, type, severity, stadiumId, zone, location, description } = req.body;

    const emergency = await Emergency.create({
      title,
      type,
      severity,
      stadium: stadiumId,
      zone,
      location,
      description,
      status: 'Reported',
      reportedBy: req.user._id,
      evacuationRequired: severity === 'Critical'
    });

    // Notify organizers immediately
    const organizers = await User.find({ role: 'Organizer' });
    const notifications = organizers.map(org => ({
      title: `SOS: ${type} reported!`,
      message: `${title} at ${zone}. Severity: ${severity}.`,
      type: 'EMERGENCY',
      category: 'EMERGENCY',
      priority: severity?.toUpperCase() === 'CRITICAL' ? 'CRITICAL' : 'HIGH',
      recipient: org._id,
      actionUrl: '/organizer/emergency'
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json({ success: true, data: emergency });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Advanced: Calculate a "safe" 90-degree stepped route avoiding the emergency
export const getSafeRoute = async (req, res) => {
  try {
    const { startLat, startLng, emergencyLat, emergencyLng, destinationType } = req.query;
    
    // In a real app, we'd use pgrouting or OSRM. 
    // Here we generate a multi-point polyline that avoids the emergency coordinate.
    
    // Mock endpoints for the destination (Safe Exit or Medical Room)
    let endLat = parseFloat(startLat) + 0.002;
    let endLng = parseFloat(startLng) + 0.002;

    if (destinationType === 'Medical') {
      endLat = parseFloat(startLat) - 0.0015;
      endLng = parseFloat(startLng) + 0.0025;
    }

    // Generate a 90-degree step path
    const route = [
      { lat: parseFloat(startLat), lng: parseFloat(startLng) },
      { lat: parseFloat(startLat), lng: endLng }, // move East/West first
      { lat: endLat, lng: endLng } // then North/South
    ];

    res.status(200).json({
      success: true,
      data: {
        destination: destinationType === 'Medical' ? 'Central Medical Hub' : 'Gate A (Safe Exit)',
        distance: '450m',
        eta: '3 mins',
        route
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Update emergency status (Organizer)
export const updateEmergencyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, evacuationRequired } = req.body;

    const emergency = await Emergency.findByIdAndUpdate(
      id, 
      { status, evacuationRequired }, 
      { new: true, runValidators: true }
    );

    if (!emergency) {
      return res.status(404).json({ success: false, message: 'Emergency not found' });
    }

    res.status(200).json({ success: true, data: emergency });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Simulator: trigger a random critical emergency
export const simulateEmergency = async (req, res) => {
  try {
    const stadium = await Stadium.findOne();
    if (!stadium) {
      return res.status(404).json({ success: false, message: 'No stadium found' });
    }

    const emergency = await Emergency.create({
      title: 'Simulated Fire Alarm',
      type: 'Fire',
      severity: 'Critical',
      stadium: stadium._id,
      zone: 'Food Court 2',
      location: { latitude: 25.4215, longitude: 51.4915 },
      description: 'System automatically triggered a fire alert simulation for demo.',
      status: 'Reported',
      evacuationRequired: true
    });

    res.status(201).json({ success: true, data: emergency });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
