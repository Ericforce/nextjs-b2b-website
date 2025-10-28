const requiredEnvVar = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const projectId = requiredEnvVar('NEXT_PUBLIC_SANITY_PROJECT_ID');
export const dataset = requiredEnvVar('NEXT_PUBLIC_SANITY_DATASET');
export const apiVersion = requiredEnvVar('NEXT_PUBLIC_SANITY_API_VERSION');

const useCdnEnv = process.env.NEXT_PUBLIC_SANITY_USE_CDN;
export const useCdn = useCdnEnv
  ? useCdnEnv.toLowerCase() === 'true'
  : process.env.NODE_ENV === 'production';

export const readToken = process.env.SANITY_READ_TOKEN;
export const writeToken = process.env.SANITY_WRITE_TOKEN;
export const previewSecretId = process.env.SANITY_PREVIEW_SECRET_ID ?? 'preview.secret';
export const studioTitle = process.env.SANITY_STUDIO_TITLE ?? 'Sanity Studio';
export const studioBasePath = process.env.SANITY_STUDIO_BASE_PATH ?? '/studio';
