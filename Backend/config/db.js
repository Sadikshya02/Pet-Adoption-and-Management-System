import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI)
      throw new Error("MONGODB_URI not found in environment variables!");
    await mongoose.connect(process.env.MONGODB_URI, { dbName: "PetAdoption" });
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;