import mongoose from "mongoose";

// define the type
interface ConnectionObject {
  isConnected?: number;
}

// create connection object
const connection: ConnectionObject = {};

export async function connectDB(): Promise<void> {
  // first check if connection already available or not
  if (connection.isConnected) {
    console.log("Connection already available");
    return;
  }
  // create new connection
  try {
    const connectionInstance = await mongoose.connect(
      process.env.MONGO_URI || ""
    );

    connection.isConnected = connectionInstance.connections[0].readyState;

    console.log("DB connected successfully");
  } catch (error) {
    console.log("DB connection failed");
    process.exit(1);
  }
}
