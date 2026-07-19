import mongoose from 'mongoose';
import User from '../models/User.js';
import Stadium from '../models/Stadium.js';
import Match from '../models/Match.js';
import Incident from '../models/Incident.js';
import VolunteerTask from '../models/VolunteerTask.js';
import Notification from '../models/Notification.js';
import bcrypt from 'bcryptjs';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stadiumos-ai');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};
