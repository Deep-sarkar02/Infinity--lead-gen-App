import mongoose from "mongoose";

let connectPromise: Promise<void> | null = null;

export async function ensureDbConnected(): Promise<void> {
  if (mongoose.connection.readyState === 1) return;

  if (!connectPromise) {
    connectPromise = connectOnce().catch((err) => {
      connectPromise = null;
      throw err;
    });
  }

  await connectPromise;
}

async function connectOnce(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set on the Lambda function");
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 5,
  });

  console.log(`MongoDB connected: ${mongoose.connection.db?.databaseName}`);
}
