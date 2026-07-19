import qrcode from 'qrcode';
import Ticket from '../models/Ticket.js';

/**
 * Generate a Base64 QR Code string from a payload
 */
export const generateQRCode = async (payload) => {
  try {
    const qrString = await qrcode.toDataURL(JSON.stringify(payload), {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
    });
    return qrString;
  } catch (error) {
    console.error('QR Generation Failed:', error);
    throw new Error('Could not generate QR code');
  }
};

/**
 * Verify if a ticket is valid for entry
 */
export const validateTicketEntry = async (ticketId, matchId) => {
  const ticket = await Ticket.findById(ticketId).populate('match');
  
  if (!ticket) {
    return { valid: false, message: 'Ticket not found.' };
  }

  if (ticket.match._id.toString() !== matchId) {
    return { valid: false, message: 'Ticket is for a different match.' };
  }

  if (ticket.status === 'Cancelled') {
    return { valid: false, message: 'Ticket has been cancelled.' };
  }

  if (ticket.status === 'Checked-In' || ticket.status === 'Used') {
    return { valid: false, message: 'Ticket has already been used (Duplicate scan).' };
  }

  if (ticket.status === 'Expired') {
    return { valid: false, message: 'Ticket has expired.' };
  }

  // If valid, return the ticket so controller can update status
  return { valid: true, ticket };
};
