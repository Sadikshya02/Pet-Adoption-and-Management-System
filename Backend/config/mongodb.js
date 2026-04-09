import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Mongo URI:", process.env.MONGODB_URI);

    if (!process.env.MONGODB_URI) {
      throw new Error("MongoDB URI not found in environment variables!");
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "PetAdoption", // optional
    });

    console.log("Database connected successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // stop server if DB fails
  }
};

export default connectDB;
