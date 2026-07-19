import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const drop = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stadiumos-ai');
    await mongoose.connection.collection('stadiums').drop();
    console.log('Stadiums dropped');
    process.exit(0);
  } catch (err) {
    console.log('Error dropping (maybe it doesnt exist):', err.message);
    process.exit(0);
  }
};
drop();
