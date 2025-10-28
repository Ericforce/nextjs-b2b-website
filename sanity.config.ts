import {defineConfig} from 'sanity';
import {deskTool} from 'sanity/desk';
import {visionTool} from '@sanity/vision';
import sanityPlugin from 'sanity-plugin';

import {deskStructure, singletonActions} from './sanity/deskStructure';
import {schemaTypes} from './sanity/schemaTypes';
import {
  apiVersion,
  dataset,
  projectId,
  studioBasePath,
  studioTitle,
} from './sanity/env';

export default defineConfig({
  name: 'default',
  title: studioTitle,
  basePath: studioBasePath,
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter((template) => template.schemaType !== 'siteSettings'),
  },
  plugins: [
    sanityPlugin(),
    deskTool({
      structure: deskStructure,
    }),
    visionTool({
      defaultApiVersion: apiVersion,
    }),
  ],
  document: {
    actions: (previous, context) => singletonActions(previous, context),
    newDocumentOptions: (previous, {creationContext}) =>
      creationContext.type === 'global'
        ? previous.filter((templateItem) => templateItem.templateId !== 'siteSettings')
        : previous,
    productionUrl: async (previous) => previous,
  },
});
