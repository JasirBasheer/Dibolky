import { Schema, model, Types } from "mongoose";
import { IShowcase } from "../Interface/show-case";

const ShowcaseSchema : Schema<IShowcase>= new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["case_study", "portfolio", "testimonial", "before_after", "other"],
      required: true,
    },
    description: {
      type: String,
    },
    media: [
      {
        url: String,
        type: {
          type: String,
          enum: ["image", "video"],
        },
      },
    ],
    clientName: String, 
    result: String,  
    beforeImage: String,  
    afterImage: String, 
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default  model<IShowcase>("Showcase", ShowcaseSchema);
