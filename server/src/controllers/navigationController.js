import { generateRoute, findNearby } from '../services/navigationService.js';
import POI from '../models/POI.js';
import Stadium from '../models/Stadium.js';

// @desc    Calculate route between two coordinates
// @route   GET /api/v1/navigation/route
// @access  Private
export const getRoute = async (req, res) => {
  try {
    const { startLat, startLng, endLat, endLng, routeType = 'Fastest' } = req.query;

    if (!startLat || !startLng || !endLat || !endLng) {
      return res.status(400).json({ success: false, message: 'Start and End coordinates are required' });
    }

    const route = await generateRoute(
      parseFloat(startLat), 
      parseFloat(startLng), 
      parseFloat(endLat), 
      parseFloat(endLng), 
      routeType
    );
    
    res.status(200).json({ success: true, data: route });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Find nearest facilities
// @route   GET /api/v1/navigation/nearby
// @access  Private
export const getNearbyFacilities = async (req, res) => {
  try {
    const { lat, lng, type, radius } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'Latitude and Longitude are required' });
    }

    const nearby = await findNearby(parseFloat(lat), parseFloat(lng), type, parseInt(radius) || 500);
    
    res.status(200).json({ success: true, count: nearby.length, data: nearby });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get routing options for a specific POI (Generates Fastest, Accessible, Emergency)
// @route   GET /api/v1/navigation/options
// @access  Private
export const getRouteOptions = async (req, res) => {
  try {
    const { startLat, startLng, poiId } = req.query;

    let dest = await POI.findById(poiId);
    
    // If not a POI, it might be a Stadium marker from the general map view
    if (!dest) {
      dest = await Stadium.findById(poiId);
      if (dest) {
        // Mock a POI object for the frontend based on the stadium
        dest = {
          _id: dest._id,
          name: dest.name,
          latitude: dest.latitude,
          longitude: dest.longitude,
          icon: '🏟',
          type: 'Stadium'
        };
      }
    }

    if (!dest) return res.status(404).json({ success: false, message: 'Destination not found' });

    // Generate 3 different route types simultaneously
    const [fastest, accessible, emergency] = await Promise.all([
      generateRoute(parseFloat(startLat), parseFloat(startLng), dest.latitude, dest.longitude, 'Fastest'),
      generateRoute(parseFloat(startLat), parseFloat(startLng), dest.latitude, dest.longitude, 'Accessible'),
      generateRoute(parseFloat(startLat), parseFloat(startLng), dest.latitude, dest.longitude, 'Emergency')
    ]);

    res.status(200).json({ 
      success: true, 
      data: {
        destination: dest,
        routes: {
          Fastest: fastest,
          Accessible: accessible,
          Emergency: emergency
        }
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
