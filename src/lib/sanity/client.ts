import { createClient } from "@sanity/client";
import { setServerClient } from "@sanity/react-loader";

import { apiVersion, dataset, projectId, apiToken, useCdn } from "./config";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  token: apiToken,
  perspective: "published",
});

setServerClient(client);
