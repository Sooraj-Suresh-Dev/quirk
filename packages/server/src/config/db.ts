import mongoose from 'mongoose';
import { config } from './env.js';

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.warn('MongoDB unavailable — running without database. Start MongoDB and restart server.');
  }
}

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB error:', error);
});
