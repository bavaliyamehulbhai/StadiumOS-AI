import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

export const seedUsers = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = [];

    // Explicit Demo Accounts for Login UI
    users.push(
      { name: 'Demo Fan', email: 'fan@demo.com', password: hashedPassword, role: 'Fan', isVerified: true },
      { name: 'Demo Volunteer', email: 'volunteer@demo.com', password: hashedPassword, role: 'Volunteer', isVerified: true },
      { name: 'Demo Organizer', email: 'organizer@demo.com', password: hashedPassword, role: 'Organizer', isVerified: true },
      { name: 'Demo Admin', email: 'admin@demo.com', password: hashedPassword, role: 'Admin', isVerified: true }
    );

    // Core Admin
    users.push({
      name: 'Admin User',
      email: 'admin@stadiumos.ai',
      password: hashedPassword,
      role: 'Admin',
      phone: '+1234567890',
      isVerified: true
    });

    // 2 Organizers
    for (let i = 1; i <= 2; i++) {
      users.push({
        name: `Organizer ${i}`,
        email: `organizer${i}@stadiumos.ai`,
        password: hashedPassword,
        role: 'Organizer',
        phone: faker.phone.number(),
        isVerified: true
      });
    }

    // 20 Volunteers
    for (let i = 1; i <= 20; i++) {
      users.push({
        name: faker.person.fullName(),
        email: `volunteer${i.toString().padStart(2, '0')}@stadiumos.ai`,
        password: hashedPassword,
        role: 'Volunteer',
        avatar: faker.image.avatar(),
        phone: faker.phone.number(),
        isVerified: true
      });
    }

    // 200 Fans
    for (let i = 1; i <= 200; i++) {
      users.push({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        password: hashedPassword,
        role: 'Fan',
        avatar: faker.image.avatar(),
        isVerified: true
      });
    }

    // Bulk insert bypassed pre-save hook to avoid double-hashing
    await User.insertMany(users);
    console.log(`✅ Seeded ${users.length} Users.`);
    
    return await User.find();
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
};
