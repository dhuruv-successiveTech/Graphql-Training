import mongoose from "mongoose";

export const dbConnect = async () => {
  const mongoURI = "mongodb://localhost:27017/successivedb";
  try {
    await mongoose.connect(mongoURI);

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
