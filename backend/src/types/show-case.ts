import { Types } from "mongoose";

export type ShowcaseType =
  | "case_study"
  | "portfolio"
  | "testimonial"
  | "before_after"
  | "other";

export interface IShowcaseMedia {
  url: string;
  type: "image" | "video";
}

export interface IShowcaseType {
  _id?: string;
  agency: Types.ObjectId;
  title: string;
  type: ShowcaseType;
  description?: string;
  media?: IShowcaseMedia[];
  clientName?: string;
  result?: string;
  beforeImage?: string;
  afterImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
