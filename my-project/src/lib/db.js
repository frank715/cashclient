import mongoose from "mongoose";
import dotenv from 'dotenv';


dotenv.config();

export async function Connect() {
  try {

    console.log(process.env.MONGO_URL)
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true
    });

    const connection = await mongoose.connection;
    connection.on("connected", () => {
      console.log("MongoDB connected");
    });

    connection.on("error", (err) => {
      console.log("MongoDB connection error" + err);
      process.exit(1);
    });
  } catch (error) {
    console.log("something goes wrong!");
    console.log(error);
  }
}