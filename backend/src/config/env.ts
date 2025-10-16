export const env = {
  CONFIG: {
    PORT: process.env.PORT,
    DB_URI: process.env.DB_URI as string,
    CORS_ORIGINS: process.env.CORS_ORIGINS,
    TOKEN_SECRET: process.env.TOKEN_SECRET,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
  },

  BASE_URLS: {
    FRONTEND: process.env.FRONTEND_BASE_URL,
    FACEBOOK: process.env.FRONTEND_BASE_URL,
    INSTAGRAM: process.env.FRONTEND_BASE_URL,
    LINKEDIN: process.env.FRONTEND_BASE_URL,
    X: process.env.FRONTEND_BASE_URL,
  },

  AGORA: {
    APP_ID: process.env.AGORA_APP_ID,
    APP_CERTIFICATE: process.env.AGORA_APP_CERTIFICATE,
  },

  AWS: {
    S3: {
      BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME as string,
      REGION: process.env.AWS_REGION as string,
      ACCESS_KEY: process.env.AWS_ACCESS_KEY as string,
      SECRET_KEY: process.env.AWS_SECRET_KEY as string,
      AWS_FOLDER_URI: process.env.AWS_FOLDER_URI as string,
    },
  },

  GOOGLE: {
    MAIL: {
      CLIENT_ID: process.env.GOOGLE_MAIL_CLIENT_ID,
      CLIENT_SECRET: process.env.GOOGLE_MAIL_CLIENT_SECRET,
      REDIRECT_URI: process.env.GOOGLE_MAIL_REDIRECT_URI,
    },
    ADS: {},
  },

  X: {
    CLIENT_ID: process.env.X_CLIENT_ID as string,
    CLIENT_SECRET: process.env.X_CLIENT_SECRET as string,
    REDIRECT_URI: process.env.X_REDIRECT_URI as string,
  },

  LINKEDIN: {
    CLIENT_ID: process.env.LINKEDIN_CLIENT_ID as string,
    CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET as string,
    REDIRECT_URI: process.env.LINKEDIN_REDIRECT_URI as string,
  },

  META: {
    CLIENT_ID: process.env.META_CLIENTID as string,
    SECRET_ID: process.env.META_SECRETID as string,
    API_VERSION: process.env.META_API_VERSION as string,
    WEBHOOK_VERIFY_TOKEN: process.env.META_WEBHOOK_VERIFY_TOKEN as string,
  },

  JWT: {
    ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    RESET_PASSWORD_SECRET: process.env.JWT_RESET_PASSWORD_SECRET as string,
  },

  STRIPE: {
    WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET as string,
    SECRET_KEY: process.env.STRIPE_SECRET_KEY as string,
  },
  RAZORPAY: {
    SECRET_ID: process.env.RAZORPAY_SECRET_ID as string,
    SECRET_KEY: process.env.RAZORPAY_SECRET_KEY as string,
  },

  NODE_MAILER:{
    MAIL: process.env.NODE_MAILER_MAIL,
    PASSWORD: process.env.NODE_MAILER_PASS
  }
};
