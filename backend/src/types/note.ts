import { Types, Document } from "mongoose";
import { IBucket, IFiles, IPlatforms } from "./common";

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

export interface IBucketWithReason {
  _id: any;
  user_id?: string;
  orgId: string;
  files: IFiles[];
  status: string;
  metaAccountId: string;
  platforms: IPlatforms[];
  title: string;
  contentType: string;
  caption: string;
  tags: string[];
  isPublished?: boolean;
  reason: INote | null;
  createdAt?:string;
}


