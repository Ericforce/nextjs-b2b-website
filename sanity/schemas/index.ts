import type { SchemaTypeDefinition } from "sanity";

import { documentSchemas } from "./documents";
import { objectSchemas } from "./objects";
import { sectionSchemas } from "./sections";

export const schemaTypes = [
  ...documentSchemas,
  ...objectSchemas,
  ...sectionSchemas,
] satisfies SchemaTypeDefinition[];
