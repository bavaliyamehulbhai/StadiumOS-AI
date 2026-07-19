import { Parking, ParkingReservation } from '../models/Parking.js';

// @desc    Get all parking zones for a stadium
// @route   GET /api/v1/parking/:stadiumId
// @access  Private
export const getParkingByStadium = async (req, res) => {
  try {
    const parkingZones = await Parking.find({ stadium: req.params.stadiumId });
    res.status(200).json({ success: true, data: parkingZones });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Reserve a parking spot
// @route   POST /api/v1/parking/reserve
// @access  Private
export const reserveParking = async (req, res) => {
  try {
    const { parkingZoneId, vehicleNumber } = req.body;

    const zone = await Parking.findById(parkingZoneId);
    if (!zone) {
      return res.status(404).json({ success: false, message: 'Parking zone not found' });
    }

    if (zone.occupied >= zone.capacity) {
      return res.status(400).json({ success: false, message: 'Parking zone is full' });
    }

    // Check if user already has a reservation for this zone
    const existing = await ParkingReservation.findOne({ 
      user: req.user._id, 
      parkingZone: parkingZoneId,
      status: 'Reserved'
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'You already have an active reservation here' });
    }

    // Mock payment/reservation logic
    const reservation = await ParkingReservation.create({
      user: req.user._id,
      parkingZone: parkingZoneId,
      vehicleNumber
    });

    // Update occupied count
    zone.occupied += 1;
    
    // Auto-update status if full
    if (zone.occupied >= zone.capacity) {
      zone.status = 'Full';
    } else if (zone.occupied >= zone.capacity * 0.9) {
      zone.status = 'Almost Full';
    }
    await zone.save();

    // Populate zone info before sending back
    await reservation.populate('parkingZone');

    res.status(201).json({ success: true, data: reservation, message: 'Parking reserved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get user's parking reservations
// @route   GET /api/v1/parking/my-reservations
// @access  Private
export const getMyReservations = async (req, res) => {
  try {
    const reservations = await ParkingReservation.find({ user: req.user._id })
      .populate('parkingZone')
      .sort('-createdAt');
    res.status(200).json({ success: true, data: reservations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
