import 'server-only';

import {
  type ClientConfig,
  type QueryParams,
  type SanityClient,
  createClient,
} from '@sanity/client';

import {apiVersion, dataset, projectId, readToken, useCdn, writeToken} from '#sanity/env';

const baseConfig: ClientConfig = {
  apiVersion,
  dataset,
  projectId,
  useCdn,
  perspective: 'published',
  stega: {
    enabled: process.env.NODE_ENV !== 'production',
  },
};

const createTokenClient = (token: string, overrides: Partial<ClientConfig> = {}): SanityClient =>
  createClient({
    ...baseConfig,
    ...overrides,
    token,
    useCdn: false,
  });

export const sanityReadClient = createClient(baseConfig);

export const getSanityPreviewClient = (token = readToken ?? writeToken) => {
  if (!token) {
    throw new Error(
      'A Sanity preview token is required. Provide SANITY_READ_TOKEN or SANITY_WRITE_TOKEN in your environment.'
    );
  }

  return createTokenClient(token, {
    perspective: 'previewDrafts',
    stega: {
      enabled: true,
    },
  });
};

export const getSanityWriteClient = (token = writeToken) => {
  if (!token) {
    throw new Error('SANITY_WRITE_TOKEN is required to create a write-enabled client.');
  }

  return createTokenClient(token);
};

type FetchOptions = {
  client?: SanityClient;
  token?: string;
  perspective?: ClientConfig['perspective'];
  stega?: ClientConfig['stega'];
  tag?: ClientConfig['tag'];
};

export async function sanityFetch<QueryResponse>(
  query: string,
  params: QueryParams = {},
  options: FetchOptions = {}
): Promise<QueryResponse> {
  const {client, token, perspective, stega, tag} = options;

  const resolvedClient = client
    ? client
    : token
      ? createTokenClient(token, {perspective, stega, tag})
      : sanityReadClient;

  return resolvedClient.fetch<QueryResponse>(query, params, {
    perspective,
    stega,
    tag,
  });
}

export type {QueryParams, SanityClient};
