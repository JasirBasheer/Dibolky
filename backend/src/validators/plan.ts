import { z } from "zod";

export const ItemSchema = z.object({
  title: z.string().min(1),
  url: z.string(),
});

export const IMenuSchema = z.object({
  title: z.string().min(1),
  icon: z.string().min(1),
  items: z.array(ItemSchema),
});

export const PlanSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().nonnegative(),
  billingCycle: z.string(), 
  maxProjects: z.number().int().nonnegative(),
  maxClients: z.number().int().nonnegative(),
  features: z.array(z.string().min(1)),
  permissions: z.array(z.string().min(1)),
  menu: z.union([z.array(z.string().min(1)), IMenuSchema]),
  type: z.string().min(1)
}).strict();

export type PlanType = z.infer<typeof PlanSchema>;
