import { z } from "zod";

export const fileSchema = z.object({
  fileName: z.string().min(3, "file name is required"),
  fileType: z.string().min(3, "file type is reequired")
});
export const fileKeySchema = z.object({
  key: z.string().min(3, "file key is required")
});