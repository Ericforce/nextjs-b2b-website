import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";

import { env } from "../env";
import { schemaTypes } from "../../sanity/schema";

export const projectId = env.sanity.projectId || "";
export const dataset = env.sanity.dataset || "production";
export const apiVersion = env.sanity.apiVersion || "2024-01-01";
export const apiToken = env.sanity.apiToken || undefined;
export const basePath = "/studio";

const isDevelopment = env.app.env === "development";

export const useCdn = env.app.env === "production" && !apiToken;

export const sanityConfig = defineConfig({
  basePath,
  name: "default",
  title: "Project Studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
  },
  plugins: [deskTool(), ...(isDevelopment ? [visionTool()] : [])],
});
