import { Resend } from "resend";
import { env } from "@/lib/env";

let resendClient: Resend | null = null;

export function getResendClient(): Resend {
  if (!env.resend.apiKey) {
    throw new Error(
      "RESEND_API_KEY is not configured. Please set it in your environment variables."
    );
  }

  if (!resendClient) {
    resendClient = new Resend(env.resend.apiKey);
  }

  return resendClient;
}

export function isResendConfigured(): boolean {
  return Boolean(env.resend.apiKey && env.resend.fromEmail);
}
