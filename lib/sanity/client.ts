import type { ClientConfig } from "next-sanity";
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";
const useCdn = process.env.NEXT_PUBLIC_SANITY_USE_CDN !== "false" && process.env.NODE_ENV === "production";

export const isSanityConfigured = Boolean(projectId && dataset);

const config: ClientConfig | null = isSanityConfigured
  ? {
      projectId: projectId!,
      dataset: dataset!,
      apiVersion,
      useCdn,
      perspective: "published"
    }
  : null;

export const sanityClient = config ? createClient(config) : null;

export interface SanityFetchOptions<TParams extends Record<string, unknown> = Record<string, unknown>> {
  query: string;
  params?: TParams;
  revalidate?: number | false;
  tags?: string[];
}

export async function sanityFetch<TResult>(options: SanityFetchOptions): Promise<TResult> {
  const { query, params = {}, revalidate = 60, tags = [] } = options;

  if (!sanityClient) {
    throw new Error("Sanity client is not configured. Please provide project ID and dataset environment variables.");
  }

  return sanityClient.fetch<TResult>(query, params, {
    next: {
      revalidate,
      tags
    }
  });
}
