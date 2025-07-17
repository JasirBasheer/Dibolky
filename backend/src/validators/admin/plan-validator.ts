import { z } from "zod";

export const planValidator = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.string().regex(/^\d+$/, "Must be a number").optional(),
  maxClient: z.string().regex(/^\d+$/, "Must be a number").optional(),
  maxProject: z.string().regex(/^\d+(\.\d+)?$/, "Must be a number").optional(),
});

export type FilterDoctorQuery = z.infer<typeof planValidator>;
