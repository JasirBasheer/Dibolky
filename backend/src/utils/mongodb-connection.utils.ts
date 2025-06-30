import mongoose from "mongoose";
import logger from "../logger";

/**
 * Connect to MongoDB.
 * @param {string} url - The MongoDB connection string.
 * @returns {Promise<void>} - Resolves when the connection is successful or throws an error if it fails.
 */

export async function connectToMongoDB(url: string): Promise<void> {
    try {
        await mongoose.connect(url);
        logger.info("Connected to MongoDB successfully")
    } catch (error: any) {
        throw error; 
    }
}
