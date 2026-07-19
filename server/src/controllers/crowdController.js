import Crowd from '../models/Crowd.js';
import Stadium from '../models/Stadium.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

// Get all crowd data
export const getAllCrowdData = async (req, res) => {
  try {
    const crowdData = await Crowd.find().populate('stadium', 'name');
    res.status(200).json({ success: true, count: crowdData.length, data: crowdData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get crowd data for a specific category (e.g. 'Gate')
export const getCrowdByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const crowdData = await Crowd.find({ category }).populate('stadium', 'name');
    res.status(200).json({ success: true, count: crowdData.length, data: crowdData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get crowd analytics (Organizer Dashboard)
export const getCrowdAnalytics = async (req, res) => {
  try {
    const crowdData = await Crowd.find();
    
    const totalVisitors = crowdData.reduce((acc, curr) => acc + curr.currentPeople, 0);
    const totalCapacity = crowdData.reduce((acc, curr) => acc + curr.maxCapacity, 0);
    const overallDensity = totalCapacity > 0 ? Math.round((totalVisitors / totalCapacity) * 100) : 0;
    
    const criticalZones = crowdData.filter(c => c.riskLevel === 'Critical');
    const highZones = crowdData.filter(c => c.riskLevel === 'High');
    
    // Find longest queue at a gate
    const gates = crowdData.filter(c => c.category === 'Gate');
    const longestQueue = gates.length > 0 
      ? gates.reduce((prev, current) => (prev.averageWaitTime > current.averageWaitTime) ? prev : current)
      : null;

    res.status(200).json({
      success: true,
      data: {
        totalVisitors,
        overallDensity,
        criticalZonesCount: criticalZones.length,
        highZonesCount: highZones.length,
        criticalZones,
        longestQueue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get heatmap specialized data
export const getHeatmapData = async (req, res) => {
  try {
    const crowdData = await Crowd.find({ 'location.latitude': { $exists: true } });
    
    const heatmapPoints = crowdData.map(zone => ({
      lat: zone.location.latitude,
      lng: zone.location.longitude,
      density: zone.densityPercentage,
      intensity: (zone.densityPercentage / 100).toFixed(2), // 0.0 to 1.0 for leaflet.heat
      zoneName: zone.zone,
      riskLevel: zone.riskLevel
    }));

    res.status(200).json({ success: true, data: heatmapPoints });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// SIMULATOR: Randomly alter crowd levels to simulate live data
export const simulateCrowdMovement = async (req, res) => {
  try {
    const crowdZones = await Crowd.find();
    
    for (const zone of crowdZones) {
      // Randomly change by -5% to +10% of capacity
      const changePercent = (Math.random() * 15) - 5; // -5 to +10
      const changeAmount = Math.round(zone.maxCapacity * (changePercent / 100));
      
      let newCount = zone.currentPeople + changeAmount;
      if (newCount < 0) newCount = 0;
      if (newCount > zone.maxCapacity) newCount = zone.maxCapacity;
      
      zone.currentPeople = newCount;
      // .save() will trigger the pre-save hook to recalculate density and wait times
      await zone.save();

      // If zone hits Critical, generate a notification for Organizers (only if we haven't recently)
      if (zone.riskLevel === 'Critical') {
        const organizers = await User.find({ role: 'Organizer' });
        for (const org of organizers) {
          // Avoid spamming by checking if a recent notification exists
          const recentNotif = await Notification.findOne({
            recipient: org._id,
            category: 'CROWD',
            title: `Crowd Alert: ${zone.zone}`
          }).sort({ createdAt: -1 });

          const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
          
          if (!recentNotif || recentNotif.createdAt < fiveMinsAgo) {
            await Notification.create({
              title: `Crowd Alert: ${zone.zone}`,
              message: `${zone.zone} is heavily crowded (${zone.densityPercentage}% capacity). Please review and potentially redirect traffic.`,
              type: 'EMERGENCY',
              category: 'CROWD',
              priority: 'HIGH',
              recipient: org._id,
              actionUrl: '/organizer/crowd'
            });
          }
        }
      }
    }
    
    res.status(200).json({ success: true, message: 'Simulated a tick of crowd movement.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
