import mongoose from "mongoose";

//const { MONGODB_URI } = process.env;

// if (!MONGODB_URI) {
//   throw new Error("MONGODB_URI must be defined");
// }

export const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGODB_URI);
    if (connection.readyState === 1) {
      console.log(`MongoDB Connected...${process.env.MONGODB_URI}`);
      return Promise.resolve(true);

    }
  } catch (error) {
    console.log("mongoDB Error: " + error);
    
    console.error(error);
    return Promise.reject(error);
  }
};