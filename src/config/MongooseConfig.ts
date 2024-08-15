import mongoose from 'mongoose';

export const connectToMongoDB = async (uri: string) => {
  await mongoose.connect(uri);
};
