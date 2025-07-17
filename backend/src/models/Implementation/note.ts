import mongoose from "mongoose";

export const noteSchema = new mongoose.Schema(
  {
    entityType: {
      type: String,
      enum: ["content", "project", "payment"],
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    note: {
      type: String,
      required: false,
    },
    media: [
      {
        id: {
          type: String,
        },
        contentType: {
          type: String,
          enum: ["image", "video", "file"],
        },
        key: {
          type: String,
        },
        fileName: {
          type: String,
        },
      },
    ],
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'addedByModel' 
    },
    addedByModel: {
      type: String,
      required: true,
      enum: ['Ownerdetail', 'Client'] 
    },
    parentNote: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
      default: null, 
    },
  },
  { timestamps: true }
);
