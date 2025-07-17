import { Types, Document } from "mongoose";

export interface Media {
  type: "image" | "video" | "file";
  url: string;
  fileName?: string;
}

export interface INote extends Document {
  entityType: "content" | "project" | "payment";
  entityId: Types.ObjectId;
  note?: string;
  media?: Media[];
  addedBy: Types.ObjectId | { name?: string, email?: string, profile?: string };
  addedByModel: string;
  parentNote?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

