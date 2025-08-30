import { HydratedDocument, model, Schema } from "mongoose";
import { IMenu, Item } from "@/types";
import { Plan } from "../Interface";

const subItemSchema = new Schema<Item>(
  {
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const menuItemSchema = new Schema<IMenu>(
  {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    items: {
      type: [subItemSchema],
      required: true,
    },
  },
  { _id: false }
);

export type PlanDoc = HydratedDocument<Plan>;

const planSchema: Schema<PlanDoc> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    features: {
      type: [String],
      required: true,
    },
    billingCycle: {
      type: String,
      required: true,
      enum: ["monthly", "yearly"],
    },
    maxProjects: {
      type: Number,
    },
    maxClients: {
      type: Number,
    },
    menu: {
      type: [menuItemSchema],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["trial", "paid"],
    },
  },
  { timestamps: true }
);

export const PlanModel = model<PlanDoc>("Plan", planSchema);
