import mongoose from 'mongoose';
import Stadium from '../models/Stadium.js';
import Crowd from '../models/Crowd.js';

const crowdZones = [
  // Gates
  { zone: 'Gate A (North)', category: 'Gate', currentPeople: 450, maxCapacity: 1000, location: { latitude: 25.4220, longitude: 51.4904 } },
  { zone: 'Gate B (East)', category: 'Gate', currentPeople: 850, maxCapacity: 1000, location: { latitude: 25.4206, longitude: 51.4920 } },
  { zone: 'Gate C (South)', category: 'Gate', currentPeople: 120, maxCapacity: 1000, location: { latitude: 25.4190, longitude: 51.4904 } },
  { zone: 'Gate D (West)', category: 'Gate', currentPeople: 0, maxCapacity: 1000, location: { latitude: 25.4206, longitude: 51.4888 } },
  { zone: 'VIP Entry', category: 'VIP', currentPeople: 30, maxCapacity: 150, location: { latitude: 25.4215, longitude: 51.4895 } },
  // Food Courts
  { zone: 'Food Court 1', category: 'Food', currentPeople: 280, maxCapacity: 300, location: { latitude: 25.4210, longitude: 51.4910 } },
  { zone: 'Food Court 2', category: 'Food', currentPeople: 45, maxCapacity: 200, location: { latitude: 25.4195, longitude: 51.4910 } },
  { zone: 'Food Court 3', category: 'Food', currentPeople: 150, maxCapacity: 250, location: { latitude: 25.4200, longitude: 51.4890 } },
  // Parking
  { zone: 'Parking P1', category: 'Parking', currentPeople: 950, maxCapacity: 1000, location: { latitude: 25.4230, longitude: 51.4910 } },
  { zone: 'Parking P2', category: 'Parking', currentPeople: 400, maxCapacity: 1000, location: { latitude: 25.4180, longitude: 51.4910 } },
  { zone: 'Wheelchair Parking P5', category: 'Parking', currentPeople: 15, maxCapacity: 50, location: { latitude: 25.4226, longitude: 51.4924 } },
  // Medical
  { zone: 'Main Medical Center', category: 'Medical', currentPeople: 5, maxCapacity: 50, location: { latitude: 25.4206, longitude: 51.4930 } },
  // Washrooms
  { zone: 'North Washrooms', category: 'Washroom', currentPeople: 40, maxCapacity: 60, location: { latitude: 25.4225, longitude: 51.4900 } },
  { zone: 'South Washrooms', category: 'Washroom', currentPeople: 15, maxCapacity: 60, location: { latitude: 25.4185, longitude: 51.4900 } },
  // Transport
  { zone: 'Metro Station Entrance', category: 'Transport', currentPeople: 1200, maxCapacity: 2000, location: { latitude: 25.4250, longitude: 51.4950 } }
];

export const seedCrowd = async () => {
  try {
    const stadiums = await Stadium.find();
    if (stadiums.length === 0) {
      console.log('No stadiums found to associate crowd zones.');
      return;
    }

    // Assign to the main stadium (Lusail)
    const lusailStadium = stadiums[0]; 

    const crowdData = crowdZones.map(zone => ({
      ...zone,
      stadium: lusailStadium._id
    }));

    await Crowd.deleteMany();
    
    // We create them one by one to trigger the 'pre-save' hook for calculating density and risk
    for (const data of crowdData) {
      await Crowd.create(data);
    }

    console.log(`✅ Seeded ${crowdData.length} Crowd Zones for ${lusailStadium.name}.`);
  } catch (error) {
    console.error('Error seeding crowd zones:', error);
  }
};
