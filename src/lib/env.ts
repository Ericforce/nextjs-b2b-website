function requireEnv(key: string, value: string | undefined): string {
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || "";
}

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
    previewSecret: process.env.SANITY_PREVIEW_SECRET || "",
  },
  resend: {
    apiKey: requireEnv("RESEND_API_KEY", process.env.RESEND_API_KEY),
    fromEmail: requireEnv("RESEND_FROM_EMAIL", process.env.RESEND_FROM_EMAIL),
  },
  contact: {
    recipientEmail: requireEnv(
      "CONTACT_RECIPIENT_EMAIL",
      process.env.CONTACT_RECIPIENT_EMAIL
    ),
  },
  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
  },
} as const;
