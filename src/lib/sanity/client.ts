import type { SanityClient } from "@sanity/client";
import { createClient } from "@sanity/client";
import { getSanityClientConfig, isSanityConfigured } from "./config";

type Perspective = "published" | "previewDrafts";

let cachedClient: SanityClient | null = null;
let cachedPreviewClient: SanityClient | null = null;

export function getSanityClient(preview: boolean = false): SanityClient {
  if (!isSanityConfigured()) {
    throw new Error("Sanity client is not configured");
  }

  if (preview) {
    if (!cachedPreviewClient) {
      cachedPreviewClient = createClient(getSanityClientConfig(true));
    }
    return cachedPreviewClient;
  }

  if (!cachedClient) {
    cachedClient = createClient(getSanityClientConfig(false));
  }

  return cachedClient;
}

interface SanityFetchOptions {
  preview?: boolean;
  perspective?: Perspective;
  tag?: string;
}

export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  options: SanityFetchOptions = {}
): Promise<T> {
  const { preview = false, perspective, tag } = options;

  const client = getSanityClient(preview);
  const fetchPerspective: Perspective =
    perspective ?? (preview ? "previewDrafts" : "published");

  return client.fetch<T>(query, params, {
    perspective: fetchPerspective,
    tag,
  });
}

export function resetSanityClients(): void {
  cachedClient = null;
  cachedPreviewClient = null;
}
