import { z } from "zod";

export const ItemSchema = z.object({
  title: z.string().min(1, { message: "Item title cannot be empty" }),
  url: z.string().url({ message: "Invalid URL format" }),
});

export const IMenuSchema = z.object({
  title: z.string().min(1, { message: "Menu title cannot be empty" }),
  icon: z.string().min(1, { message: "Icon cannot be empty" }),
  items: z
    .array(ItemSchema)
    .min(1, { message: "At least one item is required" }),
});

export const PlanSchema = z
  .object({
    _id: z.string().optional(),
    name: z.string().min(1, { message: "Plan name is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    price: z
      .number()
      .nonnegative({ message: "Price must be a positive number" }),
    billingCycle: z.string().min(1, { message: "Billing cycle is required" }),
    maxProjects: z
      .number()
      .int({ message: "Maximum projects must be an integer" })
      .nonnegative({ message: "Maximum projects cannot be negative" }),
    maxClients: z
      .number()
      .int({ message: "Maximum clients must be an integer" })
      .nonnegative({ message: "Maximum clients cannot be negative" }),
    features: z
      .array(z.string().min(1, { message: "Feature cannot be empty" }))
      .min(1, { message: "At least one feature is required" }),
    permissions: z
      .array(z.string().min(1, { message: "Permission cannot be empty" })).optional(),
    menu: z.union([
      z.array(z.string().min(1, { message: "Menu item cannot be empty" })),
      IMenuSchema,
    ]),
    type: z.string().min(1, { message: "Type is required" }),
  })
  .strict();

