import { env } from "@/lib/env";
import { createClient } from "next-sanity";

export const projectId = env.sanity.projectId;
export const dataset = env.sanity.dataset;
export const apiVersion = "2024-01-01";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
  token: env.sanity.apiToken || undefined,
});

export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "previewDrafts",
  token: env.sanity.apiToken || undefined,
});

export function getClient(previewMode: boolean = false) {
  return previewMode ? previewClient : sanityClient;
}
