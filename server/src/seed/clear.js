import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Stadium from '../models/Stadium.js';
import Match from '../models/Match.js';
import Incident from '../models/Incident.js';
import VolunteerTask from '../models/VolunteerTask.js';
import Notification from '../models/Notification.js';
import POI from '../models/POI.js';
import Ticket from '../models/Ticket.js';

export const clearDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stadiumos-ai');
    console.log('Clearing database...');
    
    await Promise.all([
      User.deleteMany({}),
      Stadium.deleteMany({}),
      Match.deleteMany({}),
      Incident.deleteMany({}),
      VolunteerTask.deleteMany({}),
      Notification.deleteMany({}),
      POI.deleteMany({}),
      Ticket.deleteMany({})
    ]);

    console.log('✅ Database completely cleared.');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  }
};

if (process.argv[1].endsWith('clear.js')) {
  import('readline').then(readline => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('⚠️  WARNING: This will DESTROY all data. Are you sure? (yes/no): ', async (answer) => {
      if (answer.toLowerCase() === 'yes') {
        await clearDB();
      } else {
        console.log('Aborted.');
      }
      rl.close();
      process.exit(0);
    });
  });
}
