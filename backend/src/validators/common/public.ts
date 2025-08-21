import { z } from "zod";

export const agencyZodSchema = z.object({
  details: z.object({
    organizationName: z.string().min(2, "Organization name is too short"),
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("Invalid email address"),
    address: z.object({
      city: z.string().min(2, "City name is too short"),
      country: z.string().min(2, "Country name is too short"),
    }),
    contactNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    website: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    industry: z.string(),
    logo: z.string().optional(),
    planId: z.string().min(1, "Plan ID is required"),
    validity: z.coerce.number().min(1, "Validity must be at least 1 month"),
    planPurchasedRate: z.coerce.number().min(1, "Invalid purchase rate"),
    paymentGateway: z.string().min(1, "Payment gateway is required"),
    description: z.string().min(1, "Description is required"),
    currency: z.string().length(3, "Currency must be a 3-letter code"),
  }),
  transaction_id: z.string(),
});



export const agencyTrialZodSchema = z.object({
  details: z.object({
    organizationName: z.string().min(2, "Organization name is too short"),
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("Invalid email address"),
    address: z.object({
      city: z.string().min(2, "City name is too short"),
      country: z.string().min(2, "Country name is too short"),
    }),
    contactNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    website: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    industry: z.string(),
    logo: z.string().optional(),
    planId: z.string().min(1, "Plan ID is required"),
    validity: z.coerce.number().min(1, "Validity must be at least 1 month"),
    description: z.string().min(1, "Description is required"),
  }),
  transaction_id: z.string().optional(),
});

const PlatformSchema = z.object({
  name: z.string().min(1, "Platform name is required"),
});

const FileSchema = z.object({
  filename: z.string().min(1, "Filename cannot be empty"),
  url: z.string().min(1, "url cannot be empty"),
  size: z.number().positive("File size must be greater than 0"),
});

const MetadataSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  createdAt: z.date().optional(),
});

export const SaveContentZodSchema = z.object({
  orgId: z.string().min(1, "Organization ID is required"),
  platform: z.string().min(1, "Platform is required"),
  platforms: z.array(PlatformSchema).nonempty("At least one platform required"),
  user_id: z.string().min(1, "User ID is required"),
  files: z.array(FileSchema).nonempty("At least one file required"),
  metadata: MetadataSchema,
  contentType: z.string().min(1, "Content type is required"),
});

