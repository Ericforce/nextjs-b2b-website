import type { ClientConfig } from "@sanity/client";
import { env } from "@/lib/env";

export const SANITY_API_VERSION = env.sanity.apiVersion;

export function isSanityConfigured(): boolean {
  return Boolean(env.sanity.projectId && env.sanity.dataset);
}

export function getSanityClientConfig(preview: boolean = false): ClientConfig {
  return {
    projectId: env.sanity.projectId,
    dataset: env.sanity.dataset,
    apiVersion: SANITY_API_VERSION,
    useCdn: preview ? false : env.app.env === "production",
    token: preview ? env.sanity.apiToken : undefined,
  } satisfies ClientConfig;
}
