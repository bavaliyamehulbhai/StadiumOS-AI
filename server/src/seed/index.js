import 'dotenv/config';
import mongoose from 'mongoose';
import { clearDB } from './clear.js';
import { seedUsers } from './users.seed.js';
import { seedStadiums } from './stadiums.seed.js';
import { seedMatches } from './matches.seed.js';
import { seedIncidents } from './incidents.seed.js';
import { seedTasks } from './tasks.seed.js';
import { seedNotifications } from './notifications.seed.js';
import { seedPOIs } from './poi.seed.js';
import { seedTickets } from './ticket.seed.js';
import { seedParking } from './parking.seed.js';
import { seedTransport } from './transport.seed.js';
import { seedFacilities } from './facility.seed.js';
import { seedCrowd } from './crowd.seed.js';
import { seedEmergencies } from './emergency.seed.js';

const runSeeder = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stadiumos-ai');
    console.log(`🔌 Connected to MongoDB for seeding.`);

    // 1. Wipe existing data
    await clearDB();

    // 2. Run seeders sequentially due to relational dependencies
    console.log('🌱 Starting Database Seeding...');

    const users = await seedUsers();
    const stadiums = await seedStadiums();
    
    // Admin needed for Match creation
    const adminUser = users.find(u => u.role === 'Admin');
    const matches = await seedMatches(stadiums, adminUser._id);
    
    const incidents = await seedIncidents(stadiums, matches, users);
    const tasks = await seedTasks(stadiums, matches, incidents, users);
    await seedNotifications(users, matches, incidents, tasks);
    await seedPOIs(stadiums);
    await seedParking(stadiums);
    await seedTransport(stadiums);
    await seedTickets(users, matches);
    await seedFacilities();
    await seedCrowd();
    await seedEmergencies();

    console.log('\n✨ All data seeded successfully! ✨');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

// Check if this script was executed directly
if (process.argv[1].endsWith('index.js')) {
  import('readline').then(readline => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('⚠️  WARNING: This will clear the database and reseed all data. Are you sure? (yes/no): ', async (answer) => {
      if (answer.toLowerCase() === 'yes' || process.env.NODE_ENV === 'development') {
        await runSeeder();
      } else {
        console.log('Aborted.');
        process.exit(0);
      }
      rl.close();
    });
  });
}
