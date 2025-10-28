import { createClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

export const isSanityConfigured = Boolean(projectId && dataset && projectId !== 'your-project-id');

export const client = isSanityConfigured
  ? createClient({
      projectId: projectId!,
      dataset: dataset!,
      apiVersion,
      useCdn: process.env.NODE_ENV === 'production',
      perspective: 'published',
    })
  : null;

export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
}: {
  query: string;
  params?: Record<string, unknown>;
  revalidate?: number | false;
  tags?: string[];
}): Promise<T> {
  if (!client) {
    throw new Error('Sanity client is not configured.');
  }

  return client.fetch<T>(query, params, {
    next: {
      revalidate,
      tags,
    },
  });
}
