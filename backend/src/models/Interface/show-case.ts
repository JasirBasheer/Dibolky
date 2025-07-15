import { IShowcaseMedia, ShowcaseType } from "@/types/show-case";
import { Document, Types } from "mongoose";


export interface IShowcase extends Document {
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
