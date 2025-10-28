# Next.js + Sanity Starter

This repository boots a Next.js App Router application with an embedded [Sanity Studio](https://www.sanity.io/studio) exposed at `/studio`. It provides shared Sanity client helpers for querying, mutating, and previewing content inside the app.

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file and define the required variables (see the table below).
3. Start the Next.js development server:

   ```bash
   npm run dev
   ```

   - Application UI: [http://localhost:3000](http://localhost:3000)
   - Sanity Studio: [http://localhost:3000/studio](http://localhost:3000/studio)

## Environment variables

Copy `.env.example` to `.env.local` (or create it manually) in the project root and populate at least the required values:

| Variable | Required | Description |
| --- | :---: | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ✅ | Sanity project ID. Can be obtained from the Sanity manage dashboard or via `sanity init`. |
| `NEXT_PUBLIC_SANITY_DATASET` | ✅ | Dataset name to use (e.g. `production`). |
| `NEXT_PUBLIC_SANITY_API_VERSION` | ✅ | Sanity API version (format `YYYY-MM-DD`). |
| `NEXT_PUBLIC_SANITY_USE_CDN` | optional | Override whether the read client uses the CDN (`true`/`false`). Defaults to CDN in production. |
| `SANITY_READ_TOKEN` | optional | Token for authenticated read access (required for previews). |
| `SANITY_WRITE_TOKEN` | optional | Token with write permissions for mutations from the app. |
| `SANITY_PREVIEW_SECRET_ID` | optional | Identifier used when wiring up preview/Presentation features. Defaults to `preview.secret`. |
| `SANITY_STUDIO_TITLE` | optional | Custom title for the Studio UI. |
| `SANITY_STUDIO_BASE_PATH` | optional | Override the Studio route. Defaults to `/studio`. |

> **Tip:** Run `npm run sanity -- init` first if you still need to create a project/dataset. Once the CLI finishes, copy the generated project ID and dataset name into `.env.local`.

## Sanity dataset provisioning

Use the bundled Sanity CLI (exposed via `npm run sanity`) to authenticate and provision your dataset:

```bash
# Authenticate with Sanity (opens a browser window)
npm run sanity -- login

# Link this project to an existing Sanity project or create a new one.
# Follow the interactive prompts and copy the project ID/dataset into .env.local
npm run sanity -- init --dataset production

# Create the dataset (if it does not exist yet)
npm run sanity -- dataset create production

# Deploy the latest schema definitions
npm run sanity -- deploy
```

Adjust `production` above to match the dataset name configured in `.env.local`.

## Project structure

```
.
├── sanity.config.ts          # Sanity Studio configuration (plugins, schema, desk structure)
├── sanity/                   # Shared Sanity tooling
│   ├── env.ts                # Centralized environment variable access
│   ├── deskStructure.ts      # Desk tool structure helpers
│   └── schemaTypes/          # Schema definitions (extend as needed)
├── packages/
│   └── sanity-plugin/        # Local base plugin registered inside the studio
├── src/
│   ├── app/
│   │   └── (studio)/studio/[[...index]]/page.tsx  # Embedded Studio route
│   └── lib/sanity.client.ts  # Read/write/preview clients and fetch helper
├── .env.example              # Template for required environment variables
└── README.md
```

## Available scripts

- `npm run dev` – Start Next.js locally (Studio served under `/studio`).
- `npm run build` – Build the production bundle.
- `npm run start` – Serve the production build.
- `npm run lint` – Run ESLint against the project.
- `npm run sanity` – Access the Sanity CLI (e.g. `npm run sanity -- dataset list`).

## Next steps

- Extend `sanity/schemaTypes` with the document types your project requires.
- Connect `sanityFetch` and the preview client from `src/lib/sanity.client.ts` inside your routes to read and preview content.
- Configure routes for live preview/Presentation if your project needs inline content editing.
