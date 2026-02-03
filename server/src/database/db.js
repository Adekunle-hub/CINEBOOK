import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectToDb = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not defined");
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDb connected successfully");
  } catch (error) {
    console.error(error, "Failed to connect to MongoDb Database");
  }
};

export default connectToDb;
