export const validateMatch = (req, res, next) => {
  const { teamA, teamB, stadium, matchDate, kickoffTime, stage, ticketPrice, totalSeats } = req.body;
  const errors = [];

  // Teams validation
  if (!teamA || teamA.trim().length < 2) {
    errors.push('Team A name must be at least 2 characters long.');
  }
  if (!teamB || teamB.trim().length < 2) {
    errors.push('Team B name must be at least 2 characters long.');
  }
  if (teamA && teamB && teamA.trim().toLowerCase() === teamB.trim().toLowerCase()) {
    errors.push('Team A and Team B cannot be the same.');
  }

  // Stadium
  if (!stadium) {
    errors.push('Stadium is required.');
  }

  // Date and Time
  if (!matchDate) {
    errors.push('Match date is required.');
  } else if (req.method === 'POST') {
    const date = new Date(matchDate);
    date.setHours(0, 0, 0, 0); // Normalize to start of day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) {
      errors.push('Match date cannot be in the past.');
    }
  }

  if (!kickoffTime) {
    errors.push('Kickoff time is required.');
  }

  // Stage
  const validStages = ['Group Stage', 'Round of 16', 'Quarter Final', 'Semi Final', 'Third Place', 'Final'];
  if (!stage || !validStages.includes(stage)) {
    errors.push(`Stage must be one of: ${validStages.join(', ')}.`);
  }

  // Ticket Price
  if (ticketPrice === undefined || isNaN(ticketPrice) || Number(ticketPrice) <= 0) {
    errors.push('Ticket price must be greater than 0.');
  }

  // Total Seats
  if (totalSeats === undefined || isNaN(totalSeats) || Number(totalSeats) <= 0) {
    errors.push('Total seats must be greater than 0.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation Failed',
      errors
    });
  }

  next();
};
