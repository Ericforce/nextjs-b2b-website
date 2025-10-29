import { defineCliConfig } from "sanity/cli";
import { env } from "@/lib/env";

export default defineCliConfig({
  api: {
    projectId: env.sanity.projectId,
    dataset: env.sanity.dataset,
  },
});
