import Ticket from '../models/Ticket.js';
import { generateQRCode } from '../services/ticketService.js';
import { v4 as uuidv4 } from 'uuid';

export const seedTickets = async (users, matches) => {
  try {
    const fans = users.filter(u => u.role === 'Fan');
    if (fans.length === 0 || matches.length === 0) return [];

    const ticketsData = [];
    const gates = ['Gate A', 'Gate B', 'Gate C', 'Gate D'];
    const sections = ['101', '102', '103', '201', 'VIP', '204'];

    console.log('🎫 Generating Mock Tickets (This might take a second to generate QRs)...');

    for (let i = 0; i < fans.length; i++) {
      const fan = fans[i];
      
      // Give each fan 2-4 random tickets
      const numTickets = Math.floor(Math.random() * 3) + 2;
      
      for (let j = 0; j < numTickets; j++) {
        const match = matches[Math.floor(Math.random() * matches.length)];
        const ticketNumber = `TKT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        
        // Status logic to show history in UI
        const isPastMatch = new Date(match.matchDate) < new Date();
        let status = isPastMatch ? 'Used' : 'Confirmed';
        
        // Randomly have some upcoming matches be checked-in already
        if (status === 'Confirmed' && Math.random() > 0.8) {
          status = 'Checked-In';
        }

        const payload = {
          ticketId: `mock_${uuidv4()}`, // In real app, this should be ticket._id, but we need to generate QR before save, or update after save. We'll use ticketNumber.
          matchId: match._id.toString(),
          userId: fan._id.toString(),
          ticketNumber
        };

        const qrCode = await generateQRCode(payload);

        ticketsData.push({
          ticketNumber,
          user: fan._id,
          match: match._id,
          stadium: match.stadium, // Note: match.stadium is an ObjectId because matches seeded it
          seatNumber: `Seat ${Math.floor(Math.random() * 150) + 1}`,
          gate: gates[Math.floor(Math.random() * gates.length)],
          section: sections[Math.floor(Math.random() * sections.length)],
          row: `Row ${Math.floor(Math.random() * 20) + 1}`,
          price: match.ticketPrice || 150,
          qrCode,
          status,
          bookedAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
          checkedInAt: status === 'Checked-In' || status === 'Used' ? new Date() : null
        });
      }
    }

    const createdTickets = await Ticket.insertMany(ticketsData);
    
    // Quick update of actual ticketIds into the QR payloads
    // Since we used ticketNumber in the QR payload initially, for full accuracy we could regenerate, 
    // but the scanner logic we wrote validates `ticketId`. Let's update `generateQRCode` to use the actual Ticket ID.
    for (const t of createdTickets) {
      const payload = {
        ticketId: t._id.toString(),
        matchId: t.match.toString(),
        userId: t.user.toString()
      };
      t.qrCode = await generateQRCode(payload);
      await t.save();
    }

    console.log(`✅ Seeded ${createdTickets.length} Tickets.`);
    return createdTickets;
  } catch (error) {
    console.error('❌ Error seeding tickets:', error);
    return [];
  }
};
