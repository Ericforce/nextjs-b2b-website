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
const singletonTypes = new Set(["siteSettings"]);

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
  document: {
    actions: (prev, context) => {
      if (context.schemaType && singletonTypes.has(context.schemaType)) {
        return prev.filter(({ action }) =>
          action &&
          !["delete", "duplicate", "unpublish", "discardChanges"].includes(
            action
          )
        );
      }

      return prev;
    },
    newDocumentOptions: (prev, context) => {
      if (context.creationContext?.type === "global") {
        return prev.filter(
          (template) => template.templateId && !singletonTypes.has(template.templateId)
        );
      }

      if (context.schemaType && singletonTypes.has(context.schemaType)) {
        return prev.filter(
          (template) => template.templateId && !singletonTypes.has(template.templateId)
        );
      }

      return prev;
    },
  },
  plugins: [deskTool(), ...(isDevelopment ? [visionTool()] : [])],
});
