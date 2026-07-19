import Stadium from '../models/Stadium.js';

export const seedStadiums = async () => {
  try {
    const demoStadiums = [
      {
        name: 'Lusail Stadium', city: 'Lusail', country: 'Qatar', address: 'Lusail City, Qatar',
        capacity: 88966, status: 'Active', parkingCapacity: 15000, gates: 12, foodCourts: 24,
        medicalRooms: 6, emergencyExits: 40, wheelchairAccess: true,
        latitude: 25.4208, longitude: 51.4903, zoom: 16,
        image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&q=80',
        description: 'The centerpiece of the tournament, featuring a sleek, futuristic design inspired by light and shadow.'
      },
      {
        name: 'Al Bayt Stadium', city: 'Al Khor', country: 'Qatar', address: 'Al Khor City, Qatar',
        capacity: 68895, status: 'Active', parkingCapacity: 12000, gates: 10, foodCourts: 18,
        medicalRooms: 5, emergencyExits: 30, wheelchairAccess: true,
        latitude: 25.6522, longitude: 51.4878, zoom: 16,
        image: 'https://images.unsplash.com/photo-1587329310686-91414b8e3cb7?auto=format&fit=crop&q=80',
        description: 'Designed to resemble a traditional Bedouin tent, offering a unique cultural experience.'
      },
      {
        name: 'Stadium 974', city: 'Doha', country: 'Qatar', address: 'Ras Abu Aboud, Doha',
        capacity: 44089, status: 'Maintenance', parkingCapacity: 5000, gates: 8, foodCourts: 12,
        medicalRooms: 3, emergencyExits: 20, wheelchairAccess: true,
        latitude: 25.2890, longitude: 51.5660, zoom: 16,
        image: 'https://images.unsplash.com/photo-1627999814407-7f999554041d?auto=format&fit=crop&q=80',
        description: 'A fully demountable stadium constructed from 974 shipping containers.'
      },
      {
        name: 'Education City Stadium', city: 'Al Rayyan', country: 'Qatar', address: 'Education City, Al Rayyan',
        capacity: 44667, status: 'Active', parkingCapacity: 8000, gates: 8, foodCourts: 14,
        medicalRooms: 4, emergencyExits: 24, wheelchairAccess: true,
        latitude: 25.3119, longitude: 51.4244, zoom: 16,
        image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80',
        description: 'Known as the "Diamond in the Desert", featuring a jagged, diamond-like facade.'
      },
      {
        name: 'Al Janoub Stadium', city: 'Al Wakrah', country: 'Qatar', address: 'Al Wakrah, Qatar',
        capacity: 44325, status: 'Active', parkingCapacity: 7500, gates: 8, foodCourts: 12,
        medicalRooms: 4, emergencyExits: 22, wheelchairAccess: true,
        latitude: 25.1597, longitude: 51.5744, zoom: 16,
        image: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&q=80',
        description: 'Features a sweeping, aerodynamic roof inspired by traditional dhow boats.'
      }
    ];

    await Stadium.insertMany(demoStadiums);
    console.log(`✅ Seeded ${demoStadiums.length} Stadiums.`);
    
    return await Stadium.find();
  } catch (error) {
    console.error('❌ Error seeding stadiums:', error);
    throw error;
  }
};
