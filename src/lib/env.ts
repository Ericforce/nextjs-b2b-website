export const env = {
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    env: process.env.NODE_ENV || "development",
  },
  sanity: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
    apiToken: process.env.SANITY_API_TOKEN || "",
  },
  email: {
    from: process.env.EMAIL_FROM || "",
    apiKey: process.env.EMAIL_PROVIDER_API_KEY || "",
  },
  smtp: {
    host: process.env.SMTP_HOST || "",
    port: parseInt(process.env.SMTP_PORT || "587"),
    user: process.env.SMTP_USER || "",
    password: process.env.SMTP_PASSWORD || "",
  },
  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
  },
} as const;
