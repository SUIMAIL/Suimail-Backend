import mongoose from "mongoose"
import { MONGO_URI } from "./envs"
import logger from "./logger"

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI!).then(() => {
      console.log("Database connected successfully 🚀")
    })
  } catch (error) {
    logger.error("Database connection error:", error)
    process.exit(1)
  }
}

export default connectDB
