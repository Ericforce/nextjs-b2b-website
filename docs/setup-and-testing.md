# Local Setup and Testing Guide

## Overview

This guide helps new teammates configure the Next.js + Sanity project locally, connect the required third-party services, and run through the core frontend and backend flows. Follow it end-to-end to reach a working environment before diving deeper into feature work.

## Tech Stack & Project Layout

### Stack Highlights

- Next.js 14 App Router with React 18 server and client components.
- TypeScript across the application for static typing.
- Tailwind CSS with utility helpers (`clsx`, `tailwind-merge`) for styling.
- Sanity CMS for structured content, with Sanity Studio embedded at `/studio`.
- Resend for transactional email delivery (contact form).
- Optional Google Analytics 4 measurement via `NEXT_PUBLIC_GA_MEASUREMENT_ID`.

### Key Directories

| Path | Purpose | Notable files |
| --- | --- | --- |
| `src/app/(marketing)/[[...slug]]` | Renders marketing pages for any published Sanity slug, handles ISR and SEO metadata. | `page.tsx` |
| `src/app/(marketing)/blog` | Blog listing, filters, taxonomy, and article detail routes sourced from Sanity. | `page.tsx`, `[slug]/page.tsx`, `category/[slug]/page.tsx` |
| `src/app/(studio)/studio/[[...index]]` | Hosts Sanity Studio inside Next.js; returns 404 in production to keep Studio private. | `page.tsx` |
| `src/app/api` | API routes for backend functionality. | `contact/route.ts`, `preview/route.ts`, `preview/exit/route.ts`, `health/route.ts` |
| `src/components/sections` | Page section components rendered by the marketing routes. | `index.ts`, individual section files |
| `src/components/ui` | Reusable UI elements (buttons, cards, inputs). | `Button.tsx`, etc. |
| `src/components/forms` | Client-side form builders, including the marketing contact form. | `ContactForm.tsx` |
| `src/lib/sanity` | Sanity clients, config, GROQ queries, and helper utilities. | `config.ts`, `client.ts`, `queries.ts`, `constants.ts` |
| `src/lib/email` | Email provider integrations and helpers. | `resend.ts` |
| `src/lib/env.ts` | Centralized environment variable parsing and defaults. | `env.ts` |
| `src/lib/utils` | Shared utilities (rate limiting, formatting, etc.). | `rate-limit.ts`, `format.ts` |
| `src/lib/seo` | SEO metadata helpers used by App Router routes. | `index.ts`, `metadata.ts` |
| `src/emails` | React Email templates for transactional email bodies. | `contact-request.tsx` |
| `src/types` | TypeScript type definitions shared across the project. | `sanity.ts`, `api.ts` |

The project does not rely on a traditional database—Sanity hosts all structured content and media, and the contact form relays messages directly through Resend.

## Prerequisites

- **Node.js 18.17+** (the app targets Node 18 LTS). Use `nvm` or your preferred manager.
- **npm 9+** (bundled with Node 18).
- **Sanity CLI** for managing content schema and datasets: `npm install -g @sanity/cli`.
- Access to the **Sanity project** used by the team (or permission to create one).
- A **Resend** account with a verified sending domain (or credentials to an existing account).
- Optional: GA4 property if you plan to enable Google Analytics locally.

## Environment Variables

### Create `.env.local`

1. Duplicate the sample file:  
   ```bash
   cp .env.example .env.local
   ```
2. Update `.env.local` with values specific to your environment. The file is ignored by git and takes precedence over `.env.example`.
3. Restart the dev servers after editing environment values.

### Template

```bash
# Required — update each of these
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_token
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
CONTACT_RECIPIENT_EMAIL=contact@yourdomain.com

# Optional — set when you need the related feature
NODE_ENV=development
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_PREVIEW_SECRET=your_preview_secret
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Variable Reference

#### Required variables

| Variable | What it controls | Where to obtain it | Default / Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Base URL used for metadata, canonical links, and request URLs. | Use `http://localhost:3000` locally; set to the deployed domain in production. | Defaults to `http://localhost:3000` in `src/lib/env.ts`, but keep it accurate for SEO and email links. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Identifies the Sanity project used for all content queries. | Sanity Manage → Project → “API” tab, or `sanity debug --secrets`. | No fallback—if missing, `src/lib/sanity/config.ts` cannot initialize clients and builds fail. |
| `NEXT_PUBLIC_SANITY_DATASET` | Points queries at the correct dataset (e.g. `production`, `staging`). | Sanity Manage → Datasets, or via `sanity dataset list`. | Defaults to `production` if omitted, but must match the dataset holding your content. |
| `SANITY_API_TOKEN` | Authenticates server-side queries and draft/preview access. | Create a token with **Read** permissions in Sanity Manage → API → Tokens. | Required for preview mode and Studio content checks; keep it secret. |
| `RESEND_API_KEY` | Authenticates calls to Resend when sending contact emails. | Resend Dashboard → API Keys. | `src/lib/email/resend.ts` throws if this is unset when email is attempted. |
| `RESEND_FROM_EMAIL` | The verified sender address used in outgoing contact emails. | Must match a domain verified inside Resend. | Ensure the domain is verified; otherwise Resend rejects sends. |
| `CONTACT_RECIPIENT_EMAIL` | Inbox that receives contact form submissions. | Use an internal distribution or individual address. | Used by `src/app/api/contact/route.ts` as the `to` target. |

#### Optional variables

| Variable | What it controls | Where to obtain it | Default / Notes |
| --- | --- | --- | --- |
| `NODE_ENV` | Overrides runtime environment mode. | Usually set automatically by Next.js; rarely needs manual change. | Defaults to `development` locally; production builds set it to `production`. |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Locks Sanity queries to a specific API date. | Use the API version your schema targets (see Sanity changelog). | Defaults to `2024-01-01` via `src/lib/env.ts`. Update when adopting new Sanity features. |
| `SANITY_PREVIEW_SECRET` | Shared secret protecting the `/api/preview` endpoint. | Generate any strong string and share it with trusted editors. | If missing or mismatched, preview requests return `401` (`src/app/api/preview/route.ts`). |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Enables GA4 tracking for the marketing site. | GA4 property → Admin → Data Streams. | Leave unset to disable Google Analytics locally. |

## Install and Run Locally

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   - Copy `.env.example` to `.env.local`.
   - Fill in the required variables described above.

3. **Start the Next.js application**

   ```bash
   npm run dev
   ```

   The site is available at [http://localhost:3000](http://localhost:3000).

4. **Start Sanity Studio**

   In a separate terminal, run:

   ```bash
   npm run sanity
   ```

   By default this launches Sanity Studio on [http://localhost:3333](http://localhost:3333). The embedded Studio route is also available at [http://localhost:3000/studio](http://localhost:3000/studio) while `npm run dev` is running. The file `src/app/(studio)/studio/[[...index]]/page.tsx` guards this route with `notFound()` whenever `NODE_ENV === "production"` to keep Studio inaccessible on public deployments.

If both servers are running you can iterate on Sanity content and immediately see updates in the Next.js app.

## External Services

### Sanity CMS

1. **Create or reuse a project**

   ```bash
   npm install -g @sanity/cli
   sanity login
   sanity init  # or sanity project create
   ```

2. **Datasets**

   - Keep a `production` dataset for live content.
   - Optional: create a `staging` dataset for testing (`sanity dataset create staging`).

3. **API Token**

   - Go to Sanity Manage → API → Tokens → “Add API token”.
   - Grant **Editor** or **Read** permissions depending on your needs.
   - Store the token in `SANITY_API_TOKEN`.

4. **Connect Next.js**

   - Update `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`.
   - Optional: set a `SANITY_PREVIEW_SECRET` to enable preview mode.
   - The Sanity configuration consumed by Next lives in `src/lib/sanity/config.ts`, and the CLI mirrors the same values in `sanity.cli.ts`.

### Resend Email

1. Sign in to [Resend](https://resend.com/) and verify your sending domain.
2. Create a production API key and store it in `RESEND_API_KEY`.
3. Add a sender address under the verified domain and place it in `RESEND_FROM_EMAIL`.
4. Choose the inbox that should receive contact requests and set `CONTACT_RECIPIENT_EMAIL`.
5. The contact API (`src/app/api/contact/route.ts`) calls `getResendClient()` from `src/lib/email/resend.ts` to send messages; if Resend is not configured the route returns a 503.

There is no separate database to provision—the application reads published and draft content directly from Sanity and sends form submissions via email.

## Testing the Application

### Frontend smoke tests

1. Visit [http://localhost:3000](http://localhost:3000) to load the marketing homepage rendered by `src/app/(marketing)/[[...slug]]/page.tsx`.
2. Use the navigation to open additional marketing pages (e.g. `/about`, `/pricing`). These slugs are resolved via Sanity’s Page documents.
3. Browse the blog index at [http://localhost:3000/blog](http://localhost:3000/blog). Filters, pagination, and RSS metadata are powered by `src/app/(marketing)/blog/page.tsx`.
4. Open a blog detail page such as `/blog/my-first-post`, rendered by `src/app/(marketing)/blog/[slug]/page.tsx`. Confirm hero images, author badges, and portable text rendering.
5. Inspect incremental static regeneration (ISR): publish a change in Sanity, wait for the default 60 second revalidate window defined by `DEFAULT_SANITY_REVALIDATE` in `src/lib/sanity.ts`, then refresh the relevant page to see updates.

### Preview and draft mode

1. Ensure `SANITY_PREVIEW_SECRET` is set.
2. Trigger preview mode with a URL such as:  
   `http://localhost:3000/api/preview?secret=<SANITY_PREVIEW_SECRET>&slug=/blog`.  
   Valid requests call `draftMode().enable()` in `src/app/api/preview/route.ts`, redirect you to the target slug, and display the `PreviewBanner` component with a “Preview mode is enabled” message.
3. While preview mode is active the Next.js app reads drafts via `previewClient` in `src/lib/sanity.ts`.
4. Exit preview by following the “Exit preview” link or visiting `http://localhost:3000/api/preview/exit?redirect=/`, which disables draft mode via `src/app/api/preview/exit/route.ts`.

### Backend checks

1. **Health check**

   ```bash
   curl http://localhost:3000/api/health
   ```

   Expected response (from `src/app/api/health/route.ts`):

   ```json
   {
     "success": true,
     "message": "API is healthy",
     "timestamp": "2024-01-01T12:00:00.000Z"
   }
   ```

2. **Contact API**

   Send a sample payload (update the email fields before testing):

   ```bash
   curl -X POST http://localhost:3000/api/contact \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Ada Lovelace",
       "email": "ada@example.com",
       "company": "Analytical Engines",
       "phone": "+1-555-555-0100",
       "message": "Just verifying that the contact workflow works end-to-end.",
       "consent": true
     }'
   ```

   - The handler performs schema validation, renders an email template from `src/emails/contact-request.tsx`, and sends via Resend.
   - Requests are rate limited to **3 per minute per IP** by `src/lib/utils/rate-limit.ts`. Exceeding the limit returns HTTP 429 with a retry hint.
   - Missing or invalid Resend credentials cause a 503 response even before validation (`isResendConfigured()` in `src/lib/email/resend.ts`).

3. **Thunder Client / Postman**

   If you prefer a GUI client, replicate the request above and inspect the status codes and error messages.

### Sanity Studio

- Open [http://localhost:3000/studio](http://localhost:3000/studio) while the dev server is running to access Studio inside Next.js.
- When running `npm run sanity`, the standalone Studio is served on [http://localhost:3333](http://localhost:3333); both instances read from the same dataset.
- Remember that the embedded Studio is automatically disabled in production builds via `notFound()`.

## Troubleshooting

- **Contact API returns 503** – Check `RESEND_API_KEY` and `RESEND_FROM_EMAIL`. The guard in `src/app/api/contact/route.ts` relies on `isResendConfigured()` from `src/lib/email/resend.ts`.
- **Contact API returns 401/400** – Ensure you pass all required fields (`name`, `email`, `message`, `consent`). The schema is enforced with Zod inside the same route file.
- **HTTP 429 from /api/contact** – You hit the per-IP rate limit defined in `src/lib/utils/rate-limit.ts`. Wait for the window to reset before retrying.
- **Preview endpoint returns 401** – Either `SANITY_PREVIEW_SECRET` is unset or the query parameter does not match the configured secret (`src/app/api/preview/route.ts`).
- **Sanity queries fail or build errors mention missing project ID/dataset** – Confirm that `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are present in `.env.local`. These values are consumed by `src/lib/sanity/config.ts` and `sanity.cli.ts`.
- **Emails fail to send** – Verify that your Resend sender domain is fully verified and that the recipient address is correct. Inspect server logs for `Failed to send email` messages thrown in `src/app/api/contact/route.ts`.

For deeper architectural details, see [docs/architecture.md](./architecture.md). Deployment, environment promotion, and operational runbooks live in [docs/operations.md](./operations.md). The contact workflow is documented in [docs/contact-workflow.md](./contact-workflow.md).

---

Following the steps above should give you a ready-to-develop environment and confidence that both the frontend marketing site and backend APIs are functioning correctly.
