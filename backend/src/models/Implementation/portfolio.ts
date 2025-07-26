import mongoose, { Schema } from "mongoose";
import { IPortfolio } from "../Interface";

export const portfolioSchema: Schema<IPortfolio> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,  
    },
    media: [
      {
        type: {
          type: String,
          required: true,
        },
        url: {
          type: String,
        },
        key: {
          type: String,
        }
    },
    ],
    tags: [String], 
    type: String
  },
  { timestamps: true }
);

export default mongoose.model<IPortfolio>("Portfolio", portfolioSchema);
