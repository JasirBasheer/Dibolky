import { Document } from "mongoose";

export interface ITestimonial extends Document {
  clientName: string
  companyLogo?: string
  testimonialText: string
  rating: number
  createdAt?: Date
  updatedAt?: Date
}

export interface ITestimonialType {
  _id?:string;
  clientName: string
  companyLogo?: string
  testimonialText: string
  rating: number
  createdAt?: Date
  updatedAt?: Date
}