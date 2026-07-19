import mongoose from 'mongoose';
import Stadium from '../models/Stadium.js';
import Emergency from '../models/Emergency.js';

export const seedEmergencies = async () => {
  try {
    const stadiums = await Stadium.find();
    if (stadiums.length === 0) {
      console.log('No stadiums found to associate emergencies.');
      return;
    }

    const lusailStadium = stadiums[0]; 

    // We will start with a clear state, so no active emergencies on boot.
    await Emergency.deleteMany();
    
    // Optionally insert a 'Resolved' historical emergency for analytics
    await Emergency.create({
      title: 'Minor Medical Incident',
      type: 'Medical',
      severity: 'Low',
      stadium: lusailStadium._id,
      zone: 'Food Court 1',
      location: { latitude: 25.4210, longitude: 51.4910 },
      description: 'Fan felt dizzy due to heat.',
      status: 'Closed',
      evacuationRequired: false
    });

    console.log(`✅ Cleared and prepared Emergency DB for ${lusailStadium.name}.`);
  } catch (error) {
    console.error('Error seeding emergencies:', error);
  }
};
