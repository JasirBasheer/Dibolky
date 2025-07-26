import mongoose, { Schema } from "mongoose";
import { ITestimonial } from "../Interface/testimonial";

export const testimonialSchema: Schema<ITestimonial> = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
    },
    companyLogo: {
      type: String,
    },
    testimonialText: {
      type: String,
    },
    rating: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITestimonial>("testimonial", testimonialSchema);
