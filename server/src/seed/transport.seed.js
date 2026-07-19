import { Transport } from '../models/Transport.js';

export const seedTransport = async (stadiums) => {
  try {
    const transportData = [];

    for (const stadium of stadiums) {
      // Metro
      transportData.push({
        stadium: stadium._id,
        type: 'Metro',
        routeName: 'Red Line Express',
        source: 'City Center Station',
        destination: `${stadium.name} Metro Station`,
        estimatedTime: 15,
        fare: 5,
        status: 'On Time',
        frequency: 'Every 3 mins'
      });
      
      // Bus
      transportData.push({
        stadium: stadium._id,
        type: 'Bus',
        routeName: 'Stadium Shuttle T1',
        source: 'Downtown Hub',
        destination: `${stadium.name} Bus Terminal`,
        estimatedTime: 25,
        fare: 2,
        status: 'Delayed',
        frequency: 'Every 10 mins'
      });

      // Taxi
      transportData.push({
        stadium: stadium._id,
        type: 'Taxi',
        routeName: 'Uber / Karwa',
        source: 'Your Location',
        destination: `${stadium.name} Drop-off Zone A`,
        estimatedTime: 12,
        fare: 25,
        status: 'On Time',
        frequency: 'On Demand'
      });

      // Walking
      transportData.push({
        stadium: stadium._id,
        type: 'Walking',
        routeName: 'Fan Walkway',
        source: 'Nearest Fan Zone',
        destination: `${stadium.name} Gate 1`,
        estimatedTime: 20,
        fare: 0,
        status: 'Normal',
        frequency: 'Continuous'
      });
    }

    await Transport.insertMany(transportData);
    console.log(`✅ Seeded ${transportData.length} Transport Routes across ${stadiums.length} stadiums.`);
  } catch (error) {
    console.error('❌ Error seeding transport:', error);
  }
};
