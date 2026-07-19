import Match from '../models/Match.js';
import { faker } from '@faker-js/faker';
import { getRandomItem, generateDateBetween, getRandomInt } from './utils/seedHelper.js';

export const seedMatches = async (stadiums, adminId) => {
  try {
    const teams = [
      'Argentina', 'Brazil', 'Spain', 'France', 'Germany', 'Portugal',
      'England', 'Netherlands', 'Japan', 'Korea', 'India', 'Australia',
      'Mexico', 'USA', 'Uruguay', 'Croatia'
    ];
    
    const stages = ['Group Stage', 'Round of 16', 'Quarter Final', 'Semi Final', 'Final'];
    const referees = ['Pierluigi Collina', 'Howard Webb', 'Björn Kuipers', 'Cüneyt Çakır', 'Alireza Faghani'];
    const weathers = ['Clear, 24°C', 'Slight Rain', 'Cloudy', 'Sunny', 'Hot, 32°C'];
    
    const matches = [];

    for (let i = 0; i < 12; i++) {
      const stadium = getRandomItem(stadiums);
      
      let teamA = getRandomItem(teams);
      let teamB = getRandomItem(teams);
      while (teamA === teamB) {
        teamB = getRandomItem(teams);
      }
      
      const now = new Date();
      // Mix of Upcoming, Live, Completed
      let status = 'Upcoming';
      let matchDate;
      
      if (i < 3) {
        status = 'Completed';
        matchDate = generateDateBetween(new Date(now.getTime() - 86400000 * 5), new Date(now.getTime() - 86400000));
      } else if (i === 3) {
        status = 'Live';
        matchDate = new Date();
      } else {
        status = 'Upcoming';
        matchDate = generateDateBetween(new Date(now.getTime() + 86400000), new Date(now.getTime() + 86400000 * 10));
      }

      const bookedSeats = getRandomInt(Math.floor(stadium.capacity * 0.5), stadium.capacity);
      
      matches.push({
        title: `${teamA} vs ${teamB}`,
        teamA,
        teamB,
        stadium: stadium._id,
        matchDate,
        kickoffTime: `${getRandomInt(14, 21)}:00`,
        endTime: `${getRandomInt(16, 23)}:00`,
        stage: getRandomItem(stages),
        status,
        ticketPrice: getRandomInt(80, 300),
        totalSeats: stadium.capacity,
        bookedSeats,
        availableSeats: stadium.capacity - bookedSeats,
        referee: getRandomItem(referees),
        weather: getRandomItem(weathers),
        createdBy: adminId
      });
    }

    await Match.insertMany(matches);
    console.log(`✅ Seeded ${matches.length} Matches.`);
    
    return await Match.find();
  } catch (error) {
    console.error('❌ Error seeding matches:', error);
    throw error;
  }
};
