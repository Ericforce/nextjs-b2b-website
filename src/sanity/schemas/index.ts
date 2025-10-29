import type { SchemaTypeDefinition } from "sanity";

import { documentSchemas } from "./documents";
import { objectSchemas } from "./objects";

export const schemas: SchemaTypeDefinition[] = [
  ...documentSchemas,
  ...objectSchemas,
];
