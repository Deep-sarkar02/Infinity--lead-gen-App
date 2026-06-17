import dns from "dns";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectDb(): Promise<void> {
  if (mongoose.connection.readyState === 1) return;

  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Add your MongoDB Atlas connection string to .env",
    );
  }

  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 15000,
  });

  console.log(`MongoDB connected: ${mongoose.connection.db?.databaseName}`);
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
}
