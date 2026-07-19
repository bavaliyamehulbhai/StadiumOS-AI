import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  ticketNumber: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
  stadium: { type: mongoose.Schema.Types.ObjectId, ref: 'Stadium', required: true },
  seatNumber: { type: String, required: true },
  gate: { type: String, required: true },
  section: { type: String, required: true },
  row: { type: String, required: true },
  price: { type: Number, required: true },
  qrCode: { type: String }, // Base64 data URI of the generated QR code
  status: { 
    type: String, 
    enum: ['Booked', 'Confirmed', 'Checked-In', 'Used', 'Cancelled', 'Expired'],
    default: 'Confirmed'
  },
  bookedAt: { type: Date, default: Date.now },
  checkedInAt: { type: Date },
  cancelledAt: { type: Date },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Add indexes for efficient querying
ticketSchema.index({ user: 1 });
ticketSchema.index({ match: 1 });

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
