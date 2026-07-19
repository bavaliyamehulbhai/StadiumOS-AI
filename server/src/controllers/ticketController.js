import Ticket from '../models/Ticket.js';
import Match from '../models/Match.js';
import { generateQRCode, validateTicketEntry } from '../services/ticketService.js';

// @desc    Get user's tickets
// @route   GET /api/v1/tickets/my
// @access  Private
export const getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id })
      .populate('match')
      .populate('stadium', 'name city')
      .sort({ bookedAt: -1 });
    
    res.status(200).json({ success: true, count: tickets.length, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single ticket details
// @route   GET /api/v1/tickets/:id
// @access  Private
export const getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('match')
      .populate('stadium', 'name city latitude longitude');

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Ensure the user owns the ticket (unless admin/organizer)
    if (ticket.user.toString() !== req.user._id.toString() && req.user.role === 'Fan') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this ticket' });
    }

    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel a ticket
// @route   PATCH /api/v1/tickets/:id/cancel
// @access  Private
export const cancelTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Ensure ownership
    if (ticket.user.toString() !== req.user._id.toString() && req.user.role === 'Fan') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (ticket.status !== 'Booked' && ticket.status !== 'Confirmed') {
      return res.status(400).json({ success: false, message: `Cannot cancel ticket with status: ${ticket.status}` });
    }

    ticket.status = 'Cancelled';
    ticket.cancelledAt = Date.now();
    await ticket.save();

    // Free up a seat in the match
    await Match.findByIdAndUpdate(ticket.match, {
      $inc: { bookedSeats: -1, availableSeats: 1 }
    });

    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Validate/Scan QR Code
// @route   POST /api/v1/tickets/scan
// @access  Private/Organizer
export const scanTicket = async (req, res) => {
  try {
    const { payload } = req.body;
    
    // Attempt to parse QR payload
    let qrData;
    try {
      qrData = JSON.parse(payload);
    } catch (e) {
      return res.status(400).json({ success: false, message: 'Invalid QR Format' });
    }

    const { ticketId, matchId } = qrData;
    
    if (!ticketId || !matchId) {
      return res.status(400).json({ success: false, message: 'Missing required ticket data in QR' });
    }

    const validation = await validateTicketEntry(ticketId, matchId);
    
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    const { ticket } = validation;

    // Check-in the user
    ticket.status = 'Checked-In';
    ticket.checkedInAt = Date.now();
    ticket.verifiedBy = req.user._id;
    await ticket.save();

    res.status(200).json({ 
      success: true, 
      message: 'Ticket successfully verified. Entry approved.',
      data: ticket 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
