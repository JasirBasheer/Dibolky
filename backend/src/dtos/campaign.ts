import { z } from "zod";

export const CreateCampaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  objective: z.enum([
    "OUTCOME_LEADS",
    "OUTCOME_SALES",
    "OUTCOME_ENGAGEMENT",
    "OUTCOME_AWARENESS",
    "OUTCOME_TRAFFIC",
    "OUTCOME_APP_PROMOTION"
  ]),
  status: z.enum(["ACTIVE", "PAUSED"]).default("PAUSED"),
  special_ad_categories: z.array(z.string()).optional(),
  daily_budget: z.number().optional(),
  lifetime_budget: z.number().optional(),
  start_time: z.string().optional(),
  stop_time: z.string().optional(),
  adAccountId: z.string().min(1, "Ad account ID is required"),
  platform: z.enum(["meta_ads"]).default("meta_ads")
});

export type CreateCampaignDto = z.infer<typeof CreateCampaignSchema>;
