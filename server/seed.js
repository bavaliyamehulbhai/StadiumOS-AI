import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const seedDemoUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stadiumos');
    console.log('Connected to MongoDB for seeding...');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = [
      {
        name: 'Demo Fan',
        email: 'fan@demo.com',
        password: hashedPassword,
        role: 'Fan'
      },
      {
        name: 'Demo Organizer',
        email: 'organizer@demo.com',
        password: hashedPassword,
        role: 'Organizer'
      }
    ];

    for (const user of users) {
      const exists = await User.findOne({ email: user.email });
      if (!exists) {
        await User.create(user);
        console.log(`Created ${user.role} account: ${user.email}`);
      } else {
        console.log(`${user.role} account already exists: ${user.email}`);
      }
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDemoUsers();
