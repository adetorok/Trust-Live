import mongoose from 'mongoose';

export async function connectDB(uri) {
  mongoose.set('strictQuery', true);
  const connectOptions = {
    autoIndex: true,
    serverSelectionTimeoutMS: 10000, // 10s server selection timeout
    socketTimeoutMS: 20000 // 20s socket timeout
  };
  try {
    await mongoose.connect(uri, connectOptions);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err?.message || err);
    throw err;
  }
}


