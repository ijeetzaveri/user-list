import mongoose from "mongoose";
import envConfig from "./env.config";

const connectDB = async () => {
  try {
    if (!envConfig?.db?.DB_URL) throw "Invalid DB_URL";

    await mongoose.connect(envConfig.db.DB_URL).then(() => {
      console.log("MongoDB Connection Established...");
    });
  } catch (error) {
    console.log("Error while connection MongoDB ::::::: \n", error);
    process.exit(1);
  }
};

export default connectDB;
