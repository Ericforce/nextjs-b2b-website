# Architecture Overview

This document provides a technical overview of the application architecture, data flow, and key implementation details for developers.

## Tech Stack

### Frontend

- **Next.js 14**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **clsx + tailwind-merge**: Dynamic class name management

### CMS

- **Sanity**: Headless CMS for content management
- **Sanity Studio**: Admin interface for content editors
- **GROQ**: Query language for fetching content

### Email

- **Resend** (or configurable): Email service provider for contact forms
- **React Email** (optional): Email template library

### Deployment

- **Vercel**: Hosting platform for Next.js (recommended)
- **Sanity Cloud**: Hosted Sanity Studio and API

### Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript Compiler**: Type checking

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
└───────────────┬─────────────────────────────────────────────┘
                │
                │ HTTP/HTTPS
                │
┌───────────────▼─────────────────────────────────────────────┐
│                      Next.js App (Vercel)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              App Router (src/app)                     │   │
│  │  • Dynamic Routes ([slug])                            │   │
│  │  • API Routes (contact form)                          │   │
│  │  • Server Components (default)                        │   │
│  │  • Client Components (interactive UI)                 │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │                                         │
│  ┌──────────────────▼───────────────────────────────────┐   │
│  │           Section Renderer                            │   │
│  │  • Maps section types to React components             │   │
│  │  • Handles dynamic page composition                   │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │                                         │
│  ┌──────────────────▼───────────────────────────────────┐   │
│  │         Component Library                             │   │
│  │  • Layout (Header, Footer)                            │   │
│  │  • Sections (Hero, Features, CTA, etc.)               │   │
│  │  • UI (Button, Card, Input)                           │   │
│  └───────────────────────────────────────────────────────┘   │
└────────┬──────────────────────────────────────┬──────────────┘
         │                                       │
         │ GROQ Queries                          │ POST /api/contact
         │                                       │
┌────────▼─────────────┐              ┌─────────▼──────────────┐
│   Sanity CMS API     │              │   Email Provider API   │
│  • Content Storage   │              │   (Resend, etc.)       │
│  • Image CDN         │              │  • Send emails         │
│  • Content API       │              │  • Rate limiting       │
└──────────┬───────────┘              └────────────────────────┘
           │
           │ Edit Content
           │
┌──────────▼───────────┐
│   Sanity Studio      │
│  • Content Editor UI │
│  • Schema Management │
│  • Preview           │
└──────────────────────┘
```

## Application Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with Header/Footer
│   ├── page.tsx                 # Homepage (dynamic)
│   ├── globals.css              # Global styles and Tailwind
│   ├── [slug]/                  # Dynamic page routes
│   │   └── page.tsx             # Renders pages by slug
│   ├── blog/                    # Blog routes
│   │   ├── page.tsx             # Blog listing
│   │   └── [slug]/              # Individual blog posts
│   │       └── page.tsx         # Blog post detail
│   └── api/                     # API routes
│       ├── contact/             # Contact form submission
│       │   └── route.ts
│       └── preview/             # Draft preview (optional)
│           └── route.ts
│
├── components/                   # React components
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── sections/                # Section components
│   │   ├── HeroSection.tsx
│   │   ├── FeatureGrid.tsx
│   │   ├── CTASection.tsx
│   │   ├── TestimonialSection.tsx
│   │   ├── RichTextSection.tsx
│   │   ├── LogoCloud.tsx
│   │   ├── FAQSection.tsx
│   │   └── StatsSection.tsx
│   ├── ui/                      # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── index.ts
│   ├── ContactForm.tsx          # Contact form component
│   └── SectionRenderer.tsx      # Maps sections to components
│
├── lib/                         # Utilities and configuration
│   ├── sanity/                  # Sanity configuration
│   │   ├── client.ts            # Sanity client setup
│   │   ├── queries.ts           # GROQ queries
│   │   └── image.ts             # Image URL builder
│   ├── email/                   # Email utilities
│   │   ├── client.ts            # Email provider setup
│   │   └── templates.ts         # Email templates
│   ├── utils/                   # General utilities
│   │   ├── cn.ts                # Class name utility
│   │   ├── format.ts            # Formatters
│   │   └── index.ts
│   ├── env.ts                   # Environment variables
│   └── constants.ts             # App constants
│
├── types/                       # TypeScript types
│   ├── index.ts                 # Type exports
│   ├── common.ts                # Common types
│   ├── sanity.ts                # Sanity schema types
│   └── api.ts                   # API request/response types
│
└── data/                        # Static data
    └── navigation.ts            # Navigation links

sanity/                          # Sanity Studio (separate)
├── schemas/                     # Content schemas
│   ├── page.ts                  # Page schema
│   ├── blogPost.ts              # Blog post schema
│   ├── author.ts                # Author schema
│   ├── category.ts              # Category schema
│   ├── siteSettings.ts          # Site settings schema
│   └── sections/                # Section schemas
│       ├── hero.ts
│       ├── featureGrid.ts
│       ├── cta.ts
│       └── ...
├── sanity.config.ts             # Studio configuration
└── sanity.cli.ts                # CLI configuration
```

## Data Flow

### Page Rendering Pipeline

```
1. User Request
   ↓
2. Next.js Route Handler
   • Matches route (e.g., /about → [slug]/page.tsx)
   ↓
3. Server Component
   • Fetches data from Sanity (getPageBySlug)
   • Runs on server (SEO-friendly)
   ↓
4. GROQ Query
   • Queries Sanity API for page content
   • Returns page data with sections array
   ↓
5. Section Renderer
   • Maps section._type to React component
   • Renders sections in order
   ↓
6. React Components
   • Hero, Features, CTA, etc.
   • Server Components by default
   • Client Components for interactivity
   ↓
7. HTML Response
   • Fully rendered HTML sent to browser
   • SEO metadata included
   • Fast first paint
```

### Contact Form Workflow

```
1. User Fills Form
   • Client Component with form state
   ↓
2. Form Submission
   • POST to /api/contact
   • Client-side validation
   ↓
3. API Route Handler
   • Server-side validation
   • Rate limiting check
   • Spam protection (honeypot, etc.)
   ↓
4. Email Service
   • Send email via Resend/SMTP
   • Template with form data
   ↓
5. Response
   • Success/error message
   • User feedback
   ↓
6. Optional: Sanity Storage
   • Store submission in CMS
   • For admin review
```

## Section Renderer

The Section Renderer is a key component that enables the modular page system.

### Implementation

```typescript
// components/SectionRenderer.tsx
import { HeroSection } from "./sections/HeroSection";
import { FeatureGrid } from "./sections/FeatureGrid";
import { CTASection } from "./sections/CTASection";
// ... other section imports

type SectionType = {
  _type: string;
  _key: string;
  [key: string]: any;
};

const sectionComponents: Record<string, React.ComponentType<any>> = {
  hero: HeroSection,
  featureGrid: FeatureGrid,
  cta: CTASection,
  testimonials: TestimonialSection,
  richText: RichTextSection,
  logoCloud: LogoCloud,
  faq: FAQSection,
  stats: StatsSection,
};

export function SectionRenderer({ sections }: { sections: SectionType[] }) {
  return (
    <>
      {sections.map((section) => {
        const Component = sectionComponents[section._type];
        
        if (!Component) {
          console.warn(`Unknown section type: ${section._type}`);
          return null;
        }
        
        return <Component key={section._key} {...section} />;
      })}
    </>
  );
}
```

### Registry Pattern

The section registry maps Sanity schema types to React components:

- **Extensible**: Easy to add new section types
- **Type-safe**: TypeScript ensures correct props
- **Maintainable**: Centralized component mapping
- **Fallback**: Gracefully handles unknown types

### Adding New Sections

1. Create Sanity schema in `sanity/schemas/sections/`
2. Create React component in `src/components/sections/`
3. Add mapping to `sectionComponents` registry
4. Add TypeScript types for section props

## Content Fetching

### GROQ Queries

Sanity uses GROQ (Graph-Relational Object Queries) for fetching data:

```typescript
// lib/sanity/queries.ts
export const pageQuery = `
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    seoTitle,
    seoDescription,
    openGraphImage,
    sections[] {
      _type,
      _key,
      ...,
      // Expand references
      "image": image.asset->url,
      // Handle nested arrays
      features[] {
        ...,
        "image": image.asset->url
      }
    }
  }
`;

export const blogPostQuery = `
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    "mainImage": mainImage.asset->url,
    "author": author->{
      name,
      "image": image.asset->url,
      bio
    },
    "categories": categories[]->{ title, slug },
    body,
    seoTitle,
    seoDescription,
    publishedAt
  }
`;
```

### Sanity Client

```typescript
// lib/sanity/client.ts
import { createClient } from "@sanity/client";
import { env } from "../env";

export const sanityClient = createClient({
  projectId: env.sanity.projectId,
  dataset: env.sanity.dataset,
  apiVersion: "2024-01-01",
  useCdn: true, // Use CDN for production
  token: env.sanity.apiToken, // For authenticated requests
});

// Fetch page by slug
export async function getPageBySlug(slug: string) {
  return sanityClient.fetch(pageQuery, { slug });
}

// Fetch all blog posts
export async function getAllBlogPosts() {
  return sanityClient.fetch(`
    *[_type == "blogPost"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      "mainImage": mainImage.asset->url,
      publishedAt
    }
  `);
}
```

### Image Optimization

Sanity provides built-in image CDN with transformation:

```typescript
// lib/sanity/image.ts
import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "./client";

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}

// Usage in components:
// <Image src={urlFor(image).width(800).height(600).url()} alt={alt} />
```

## Server vs. Client Components

### Server Components (Default)

Used for:
- Page layouts
- Data fetching
- SEO content
- Static sections

**Benefits:**
- Zero JavaScript to client
- Direct database access
- Better SEO
- Faster initial load

**Example:**
```typescript
// app/[slug]/page.tsx
import { getPageBySlug } from "@/lib/sanity/client";
import { SectionRenderer } from "@/components/SectionRenderer";

export default async function Page({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug);
  
  return (
    <main>
      <SectionRenderer sections={page.sections} />
    </main>
  );
}
```

### Client Components

Used for:
- Interactive UI (forms, modals)
- Browser APIs
- Event handlers
- State management

**Mark with:** `"use client"`

**Example:**
```typescript
// components/ContactForm.tsx
"use client";

import { useState } from "react";

export function ContactForm() {
  const [formState, setFormState] = useState({});
  // ... form logic
  
  return <form>...</form>;
}
```

## SEO Implementation

### Metadata API

Next.js 14 provides built-in metadata API:

```typescript
// app/[slug]/page.tsx
import { Metadata } from "next";

export async function generateMetadata({ params }): Promise<Metadata> {
  const page = await getPageBySlug(params.slug);
  
  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription,
    openGraph: {
      title: page.seoTitle || page.title,
      description: page.seoDescription,
      images: [page.openGraphImage?.url],
    },
    twitter: {
      card: "summary_large_image",
      title: page.seoTitle || page.title,
      description: page.seoDescription,
      images: [page.openGraphImage?.url],
    },
  };
}
```

### Sitemap & Robots

```typescript
// app/sitemap.ts
import { getAllPages } from "@/lib/sanity/client";

export default async function sitemap() {
  const pages = await getAllPages();
  
  return pages.map((page) => ({
    url: `${process.env.NEXT_PUBLIC_APP_URL}/${page.slug.current}`,
    lastModified: page._updatedAt,
    changeFrequency: "weekly",
    priority: page.slug.current === "home" ? 1 : 0.8,
  }));
}
```

## Preview Mode

Draft content preview for content editors:

```typescript
// app/api/preview/route.ts
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");
  
  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response("Invalid token", { status: 401 });
  }
  
  draftMode().enable();
  redirect(slug || "/");
}
```

## Performance Optimization

### Static Generation

Pages are statically generated at build time:

```typescript
// app/[slug]/page.tsx
export async function generateStaticParams() {
  const pages = await getAllPages();
  
  return pages.map((page) => ({
    slug: page.slug.current,
  }));
}
```

### Incremental Static Regeneration (ISR)

Revalidate pages periodically:

```typescript
export const revalidate = 3600; // Revalidate every hour
```

### Image Optimization

Next.js `<Image>` component with automatic optimization:

```typescript
import Image from "next/image";

<Image
  src={urlFor(image).url()}
  alt={alt}
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

## Environment Variables

See `.env.example` for required variables:

```bash
# Application
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=xxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=xxx
SANITY_PREVIEW_SECRET=xxx

# Email
EMAIL_FROM=noreply@yourdomain.com
EMAIL_PROVIDER_API_KEY=xxx
```

**Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

## Error Handling

### Global Error Boundary

```typescript
// app/error.tsx
"use client";

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

### Not Found

```typescript
// app/not-found.tsx
export default function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}
```

### API Error Handling

```typescript
// app/api/contact/route.ts
export async function POST(request: Request) {
  try {
    // Process request
    return Response.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return Response.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
```

## Testing Strategy

### Unit Tests

- Test utility functions
- Test TypeScript types
- Test API route handlers

### Integration Tests

- Test page rendering
- Test data fetching
- Test section renderer

### E2E Tests

- Test user flows
- Test form submissions
- Test navigation

**Recommended Tools:**
- Jest for unit tests
- React Testing Library for component tests
- Playwright or Cypress for E2E tests

## Security Considerations

### Content Security

- Validate user input in API routes
- Sanitize rich text content from CMS
- Use HTTPS only in production
- Implement rate limiting on API routes

### Environment Variables

- Never commit `.env` files
- Use Vercel secrets for sensitive data
- Rotate API keys regularly

### API Routes

- Validate request origin
- Implement CSRF protection
- Use API rate limiting
- Validate all input data

## Development Workflow

1. **Start Development Server**: `npm run dev`
2. **Start Sanity Studio**: `cd sanity && npm run dev`
3. **Make Changes**: Edit code or content
4. **Test Locally**: Verify changes at localhost
5. **Lint**: `npm run lint`
6. **Build**: `npm run build`
7. **Deploy**: Push to Git, auto-deploy via Vercel

## Further Reading

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Content Model](./content-model.md)
- [Operations Guide](./operations.md)
