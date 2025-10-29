import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";

import { schemaTypes } from "./sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const studioTitle = process.env.NEXT_PUBLIC_SANITY_PROJECT_TITLE || "Project Studio";
const basePath = process.env.SANITY_STUDIO_BASE_PATH || "/studio";

export default defineConfig({
  name: "default",
  title: studioTitle,
  projectId,
  dataset,
  basePath,
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
