import POI from '../models/POI.js';
import { getRandomItem } from './utils/seedHelper.js';

export const seedPOIs = async (stadiums) => {
  try {
    const poiTypes = [
      { type: 'Gate', count: 8, icon: '🚪' },
      { type: 'Parking', count: 4, icon: '🅿' },
      { type: 'FoodCourt', count: 6, icon: '🍔' },
      { type: 'Medical', count: 3, icon: '🏥' },
      { type: 'Washroom', count: 10, icon: '🚻' },
      { type: 'EmergencyExit', count: 12, icon: '🚨' },
      { type: 'Security', count: 4, icon: '👮' },
      { type: 'Wheelchair', count: 4, icon: '♿' },
      { type: 'TicketCounter', count: 2, icon: '🎟' }
    ];

    const allPOIs = [];

    for (const stadium of stadiums) {
      if (!stadium.latitude || !stadium.longitude) continue;

      poiTypes.forEach((config) => {
        for (let i = 1; i <= config.count; i++) {
          // Generate a slight random offset for coordinates around the stadium (+/- ~400 meters)
          const latOffset = (Math.random() - 0.5) * 0.007;
          const lngOffset = (Math.random() - 0.5) * 0.007;

          allPOIs.push({
            stadium: stadium._id,
            name: `${stadium.name} ${config.type} ${i}`,
            type: config.type,
            latitude: stadium.latitude + latOffset,
            longitude: stadium.longitude + lngOffset,
            description: `Standard ${config.type} facility located at ${stadium.name}.`,
            icon: config.icon,
            status: getRandomItem(['Open', 'Open', 'Open', 'Closed', 'Maintenance']),
            isAccessible: getRandomItem([true, true, false]), // 66% chance accessible
            floor: getRandomItem(['Ground', 'Ground', 'Level 1', 'Level 2']),
            openingHours: config.type === 'EmergencyExit' ? '24/7' : '08:00 - 23:00'
          });
        }
      });
    }

    await POI.insertMany(allPOIs);
    console.log(`✅ Seeded ${allPOIs.length} POIs across ${stadiums.length} stadiums.`);

  } catch (error) {
    console.error('❌ Error seeding POIs:', error);
    throw error;
  }
};
