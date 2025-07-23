import mongoose from "mongoose";
import logger from "../logger";
import { DB_URI } from "@/config/env";

export async function connectDB(): Promise<void> {
    try {
        await mongoose.connect(DB_URI);
        logger.info("Connected to MongoDB successfully")
    } catch (error: any) {
        throw error; 
    }
}
