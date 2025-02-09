import dotenv from 'dotenv'
dotenv.config()

export const PORT = process.env.PORT
export const DB_URI = process.env.DB_URI as string

// JWT 
export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string
export const JWT_RESET_PASSWORD_SECRET = process.env.JWT_RESET_PASSWORD_SECRET as string

// GRAPH API  
export const META_CLIENTID = process.env.META_CLIENTID as string
export const META_SECRETID = process.env.META_SECRETID as string
export const META_API_VERSION = process.env.META_API_VERSION as string


// AWS S3 BUCKET
export const AWS_S3_BUCKET_NAME = process.env.BUCKET_NAME as string
export const AWS_S3_BUCKET_REGION = process.env.REGION as string
export const AWS_S3_BUCKET_ACCESS_KEY = process.env.ACCESS_KEY as string
export const AWS_S3_BUCKET_SECRET_KEY = process.env.SECRET_KEY as string


// STIRPE
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string