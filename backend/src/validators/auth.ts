import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["admin", "agency", "client"]), 
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
  role: z.enum(["admin", "agency", "client"]), 
});

export const resetPasswordSchema = z.object({
  params: z.object({
    token: z.string().min(1, "Token is required"),
  }),
  body: z.object({
    newPassword: z.string().min(6, "Password must be at least 6 characters long"),
  }),
});



export type LoginDto = z.infer<typeof loginSchema>;
