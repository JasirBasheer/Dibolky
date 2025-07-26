import { Document } from "mongoose";

export interface IPortfolio extends Document {
  title: string;
  description?: string;
  media: {
    type: "image" | "video" | "text";
    url?: string;
    key?: string;
  }[];
  tags?: string[];
  type?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPortfolioType {
  _id?:string;
  title: string;
  description?: string;
  media: {
    type: "image" | "video" | "text";
    url?: string;
    key?: string;
  }[];
  tags?: string[];
  type?: string;
  createdAt?: Date;
  updatedAt?: Date;
}