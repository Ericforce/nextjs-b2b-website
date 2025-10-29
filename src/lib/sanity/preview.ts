import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId, apiToken } from "./config";

export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: apiToken,
  perspective: "previewDrafts",
});
