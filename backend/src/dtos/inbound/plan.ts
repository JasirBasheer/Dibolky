import { PlanSchema } from "@/validators";
import z from "zod";

export type CreatePlanDto = z.infer<typeof PlanSchema>;
export type EditPlanDto = z.infer<typeof PlanSchema>;
