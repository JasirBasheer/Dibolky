export const PORT = process.env.PORT
export const DB_URI = process.env.DB_URI as string
export const CORS_ORIGINS = process.env.CORS_ORIGINS 
// JWT 
export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string
export const JWT_RESET_PASSWORD_SECRET = process.env.JWT_RESET_PASSWORD_SECRET as string

// GRAPH API  
export const META_CLIENTID = process.env.META_CLIENTID as string
export const META_SECRETID = process.env.META_SECRETID as string
export const META_API_VERSION = process.env.META_API_VERSION as string
export const META_WEBHOOK_VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN as string


// LINKEDIN API
export const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID as string
export const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET as string
export const LINKEDIN_REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI as string


// X
export const X_CLIENT_ID = process.env.X_CLIENT_ID as string
export const X_CLIENT_SECRET = process.env.X_CLIENT_SECRET as string
export const X_REDIRECT_URI = process.env.X_REDIRECT_URI as string


// AWS S3 BUCKET
export const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME as string
export const AWS_REGION = process.env.AWS_REGION as string
export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY as string
export const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY as string


// STIRPE
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY as string