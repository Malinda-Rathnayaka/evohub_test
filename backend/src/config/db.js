import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/evo-art-designer-hub';
  try {
    const conn = await mongoose.connect(uri);
    console.log(`[MongoDB] Connected to database: ${conn.connection.name} at ${conn.connection.host}`);
  } catch (error) {
    console.error('[MongoDB] Connection error:', error.message || error);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};
