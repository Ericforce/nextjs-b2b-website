// Sanity Studio configuration
// Note: This file references the Sanity APIs. It is provided for completeness,
// but the repository does not ship dependencies. Use with a Sanity Studio setup.
import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { schemaTypes } from './schemas';
import structure from './studio/structure';

export default defineConfig({
  name: 'default',
  title: 'Content Studio',
  projectId: 'YOUR_PROJECT_ID',
  dataset: 'production',
  plugins: [deskTool({ structure })],
  schema: { types: schemaTypes },
});
