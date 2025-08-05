import mongoose from "mongoose";
import logger from "../logger";
import { env } from "@/config";

export async function connectDB(): Promise<void> {
    try {
        await mongoose.connect(env.CONFIG.DB_URI);
        logger.info("Connected to MongoDB successfully")
    } catch (error: any) {
        throw error; 
    }
}
