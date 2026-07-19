import { Parking } from '../models/Parking.js';

export const seedParking = async (stadiums) => {
  try {
    const parkingData = [];

    for (const stadium of stadiums) {
      // General Parking
      parkingData.push({
        stadium: stadium._id,
        zone: 'P1',
        type: 'General',
        capacity: 5000,
        occupied: Math.floor(Math.random() * 4000) + 1000, // Random 1k-5k
        walkingDistance: 5,
        price: 20
      });
      parkingData.push({
        stadium: stadium._id,
        zone: 'P2',
        type: 'General',
        capacity: 3000,
        occupied: Math.floor(Math.random() * 2000) + 1000,
        walkingDistance: 8,
        price: 15
      });

      // VIP Parking
      parkingData.push({
        stadium: stadium._id,
        zone: 'VIP',
        type: 'VIP',
        capacity: 500,
        occupied: Math.floor(Math.random() * 400) + 100,
        walkingDistance: 2,
        price: 100
      });

      // Accessible Parking
      parkingData.push({
        stadium: stadium._id,
        zone: 'Accessible-A',
        type: 'Accessible',
        capacity: 200,
        occupied: Math.floor(Math.random() * 150) + 20,
        walkingDistance: 1,
        price: 10
      });
    }

    // Set statuses based on occupancy
    for (let p of parkingData) {
      if (p.occupied >= p.capacity) {
        p.status = 'Full';
        p.occupied = p.capacity;
      } else if (p.occupied >= p.capacity * 0.9) {
        p.status = 'Almost Full';
      } else {
        p.status = 'Open';
      }
    }

    await Parking.insertMany(parkingData);
    console.log(`✅ Seeded ${parkingData.length} Parking Zones across ${stadiums.length} stadiums.`);
  } catch (error) {
    console.error('❌ Error seeding parking:', error);
  }
};
