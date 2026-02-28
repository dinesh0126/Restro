import mongoose from "mongoose";

let isConnected = false;

const connectDb = async () => {
  try {
    if (isConnected || mongoose.connection.readyState === 1) {
      return;
    }

    await mongoose.connect(process.env.MONGO_URL);
    isConnected = true;

    console.log("MongoDB connected successfully");
    
  
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

  } catch (error) {
    console.error("Error in MongoDB connection:", error.message);
    throw error;
  }
};

export default connectDb;
