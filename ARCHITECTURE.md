# Architecture Documentation

This document provides a detailed overview of the technical architecture, design patterns, and implementation details of this Next.js + Sanity ISR project.

## 📋 Table of Contents

- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Folder Structure](#folder-structure)
- [Data Flow](#data-flow)
- [ISR Implementation](#isr-implementation)
- [Sanity Integration](#sanity-integration)
- [API Routes](#api-routes)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [Performance Optimization](#performance-optimization)
- [Security Considerations](#security-considerations)
- [Scalability](#scalability)

## 🏗 System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Browser (React/Next.js App)                  │  │
│  │  - Server-side rendered HTML                          │  │
│  │  - Client-side hydration                              │  │
│  │  - Client-side routing                                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Server Layer                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              App Router (React Server Components)     │  │
│  │  - Server-side rendering (SSR)                        │  │
│  │  - Static site generation (SSG)                       │  │
│  │  - Incremental static regeneration (ISR)             │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   API Routes                          │  │
│  │  - /api/revalidate (webhook handler)                  │  │
│  │  - /api/contact (form submission)                     │  │
│  │  - /api/preview (draft mode)                          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      External Services                       │
│  ┌────────────────────┐  ┌────────────────────────────┐    │
│  │   Sanity CMS       │  │   Email Provider           │    │
│  │  - Content storage │  │  - SendGrid/Resend         │    │
│  │  - Image CDN       │  │  - Transactional emails    │    │
│  │  - Webhook events  │  └────────────────────────────┘    │
│  └────────────────────┘                                     │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

#### Static Page Request (ISR)

1. **User visits page** → `example.com/blog/my-post`
2. **CDN/Edge** → Checks for cached version
3. **Cache Hit**:
   - Serve static HTML instantly
   - Optionally trigger background revalidation
4. **Cache Miss**:
   - Forward request to Next.js server
   - Server fetches data from Sanity
   - Generate HTML
   - Cache at edge
   - Serve to user

#### Content Update Flow

1. **Editor updates content** in Sanity Studio
2. **Sanity triggers webhook** → POST to `/api/revalidate`
3. **Webhook handler**:
   - Validates signature
   - Parses payload
   - Determines affected paths
   - Calls `revalidatePath()` for each path
4. **Next.js**:
   - Invalidates cache
   - Next request triggers regeneration

## 🛠 Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.x | React framework, routing, SSR/ISR |
| React | 18.x | UI library |
| TypeScript | 5.x | Type safety |
| Sanity | 3.x | Headless CMS |
| Tailwind CSS | 3.x | Styling framework |

### Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| Prettier | Code formatting |
| Husky | Git hooks |
| Jest | Unit testing |
| React Testing Library | Component testing |
| Playwright/Cypress | E2E testing |

### Deployment

| Service | Purpose |
|---------|---------|
| Vercel | Next.js hosting (recommended) |
| Sanity | CMS hosting and CDN |
| GitHub Actions | CI/CD pipeline |

## 📁 Folder Structure

### Detailed Structure

```
project-root/
│
├── app/                          # Next.js App Router
│   ├── (site)/                   # Route group for public site
│   │   ├── layout.tsx            # Site layout wrapper
│   │   ├── page.tsx              # Homepage
│   │   ├── about/
│   │   │   └── page.tsx          # About page
│   │   ├── blog/
│   │   │   ├── page.tsx          # Blog listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Individual blog post
│   │   └── [...slug]/            # Catch-all dynamic pages
│   │       └── page.tsx
│   │
│   ├── api/                      # API Routes
│   │   ├── revalidate/
│   │   │   └── route.ts          # ISR revalidation endpoint
│   │   ├── contact/
│   │   │   └── route.ts          # Contact form handler
│   │   └── preview/
│   │       ├── route.ts          # Enable preview mode
│   │       └── disable/
│   │           └── route.ts      # Disable preview mode
│   │
│   ├── studio/                   # Embedded Sanity Studio (optional)
│   │   └── [[...index]]/
│   │       └── page.tsx
│   │
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── not-found.tsx             # 404 page
│   └── error.tsx                 # Error boundary
│
├── components/                   # React components
│   ├── ui/                       # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   ├── blocks/                   # Content blocks from Sanity
│   │   ├── HeroBlock.tsx
│   │   ├── TextBlock.tsx
│   │   ├── ImageBlock.tsx
│   │   └── ...
│   ├── sections/                 # Page sections
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── ...
│   └── forms/                    # Form components
│       ├── ContactForm.tsx
│       └── NewsletterForm.tsx
│
├── lib/                          # Utility functions and configurations
│   ├── sanity/                   # Sanity-related code
│   │   ├── client.ts             # Sanity client configuration
│   │   ├── queries.ts            # GROQ queries
│   │   ├── image-url.ts          # Image URL builder
│   │   └── schemas/              # Generated TypeScript types
│   │       └── types.ts
│   ├── email/                    # Email functionality
│   │   ├── client.ts             # Email provider client
│   │   └── templates/            # Email templates
│   │       └── contact.ts
│   ├── utils.ts                  # General utilities
│   └── constants.ts              # App constants
│
├── sanity/                       # Sanity Studio configuration
│   ├── schemas/                  # Content type definitions
│   │   ├── documents/            # Document schemas
│   │   │   ├── page.ts
│   │   │   ├── post.ts
│   │   │   ├── author.ts
│   │   │   └── ...
│   │   ├── objects/              # Object schemas
│   │   │   ├── blockContent.ts
│   │   │   ├── seo.ts
│   │   │   └── ...
│   │   └── index.ts              # Schema registry
│   ├── lib/                      # Studio utilities
│   │   └── image.ts
│   ├── plugins/                  # Custom Studio plugins
│   ├── sanity.config.ts          # Studio configuration
│   └── sanity.cli.ts             # CLI configuration
│
├── public/                       # Static assets
│   ├── images/
│   ├── fonts/
│   └── favicon.ico
│
├── tests/                        # Test files
│   ├── unit/
│   │   ├── components/
│   │   └── lib/
│   └── e2e/
│       ├── homepage.spec.ts
│       └── blog.spec.ts
│
├── .env.local                    # Local environment variables (gitignored)
├── .env.example                  # Example environment variables
├── .eslintrc.json                # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── .gitignore                    # Git ignore rules
├── next.config.js                # Next.js configuration
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── jest.config.js                # Jest configuration
├── package.json                  # Project dependencies
├── README.md                     # Project documentation
├── CONTENT_GUIDE.md              # Content editing guide
└── ARCHITECTURE.md               # This file
```

### Key Directories Explained

#### `/app` - Next.js App Router

Uses the new App Router (Next.js 13+) with React Server Components:
- **Route groups** `(site)` for organization without affecting URLs
- **Dynamic routes** `[slug]` for parameterized pages
- **Catch-all routes** `[...slug]` for flexible routing
- **Parallel routes** for advanced layouts

#### `/components` - React Components

Organized by function:
- **ui/**: Presentational components, reusable across the app
- **blocks/**: Map to Sanity content blocks, handle rich content
- **sections/**: Larger composite components (header, footer)
- **forms/**: Form components with validation

#### `/lib` - Business Logic

Contains non-UI code:
- **sanity/**: All Sanity-related functionality
- **email/**: Email sending logic
- **utils.ts**: Helper functions (formatting, validation, etc.)

#### `/sanity` - CMS Configuration

Defines content structure:
- **schemas/documents/**: Top-level content types
- **schemas/objects/**: Reusable nested objects
- **plugins/**: Custom Studio functionality

## 🔄 Data Flow

### Server-Side Data Fetching

```typescript
// app/blog/[slug]/page.tsx
import { client } from '@/lib/sanity/client';
import { postQuery } from '@/lib/sanity/queries';

// This runs on the server
export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await client.fetch(postQuery, { slug: params.slug });
  
  return <article>{/* Render post */}</article>;
}

// Enable ISR
export const revalidate = 60; // Revalidate every 60 seconds

// Generate static paths at build time
export async function generateStaticParams() {
  const posts = await client.fetch(`*[_type == "post"]{ "slug": slug.current }`);
  return posts.map(post => ({ slug: post.slug }));
}
```

### Client-Side Data Fetching (when needed)

```typescript
'use client'; // Mark as client component

import { useEffect, useState } from 'react';
import { client } from '@/lib/sanity/client';

export default function DynamicComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    client.fetch(query).then(setData);
  }, []);

  return <div>{/* Render data */}</div>;
}
```

## 🔄 ISR Implementation

### Revalidation Strategies

#### 1. Time-Based Revalidation

Set a revalidation period for automatic background updates:

```typescript
// Revalidate every 60 seconds
export const revalidate = 60;
```

**When to use:**
- Content that changes regularly
- News sites, blogs
- Product listings

#### 2. On-Demand Revalidation

Trigger revalidation via API route:

```typescript
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  const { path, tag } = await request.json();
  
  if (path) {
    revalidatePath(path);
  }
  
  if (tag) {
    revalidateTag(tag);
  }
  
  return Response.json({ revalidated: true });
}
```

**When to use:**
- Immediate content updates
- Event-driven revalidation
- Sanity webhooks

#### 3. Tag-Based Revalidation

Group related pages for bulk revalidation:

```typescript
// Fetch with cache tags
export default async function Page() {
  const data = await fetch('...', {
    next: { tags: ['blog'] }
  });
  
  return <div>{/* Render */}</div>;
}

// Revalidate all pages with 'blog' tag
revalidateTag('blog');
```

### Webhook Handler Implementation

```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';
import { createHmac } from 'crypto';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('x-sanity-signature');
  
  // Verify webhook signature
  const expectedSignature = createHmac('sha256', process.env.SANITY_REVALIDATE_SECRET!)
    .update(body)
    .digest('hex');
  
  if (signature !== expectedSignature) {
    return new Response('Invalid signature', { status: 401 });
  }
  
  const payload = JSON.parse(body);
  
  // Determine paths to revalidate based on document type
  const pathsToRevalidate = getPathsForDocument(payload);
  
  // Revalidate each path
  for (const path of pathsToRevalidate) {
    revalidatePath(path);
  }
  
  return Response.json({ 
    revalidated: true, 
    paths: pathsToRevalidate 
  });
}

function getPathsForDocument(doc: any): string[] {
  const paths: string[] = [];
  
  switch (doc._type) {
    case 'post':
      paths.push('/blog');
      paths.push(`/blog/${doc.slug.current}`);
      break;
    case 'page':
      paths.push(`/${doc.slug.current}`);
      break;
    case 'navigation':
      paths.push('/'); // Revalidate all pages with nav
      break;
  }
  
  return paths;
}
```

## 🎨 Sanity Integration

### Client Configuration

```typescript
// lib/sanity/client.ts
import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,
});

// For server-side only (with token)
export const serverClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});
```

### GROQ Queries

```typescript
// lib/sanity/queries.ts
export const postQuery = `
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage{
      asset->{
        _id,
        url
      },
      alt
    },
    body,
    author->{
      name,
      image
    },
    categories[]->{
      title,
      slug
    }
  }
`;

export const allPostsQuery = `
  *[_type == "post"] | order(publishedAt desc){
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    author->
  }
`;
```

### Schema Example

```typescript
// sanity/schemas/documents/post.ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }]
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true
      }
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime'
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent'
    })
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage'
    },
    prepare(selection) {
      const { author } = selection;
      return {
        ...selection,
        subtitle: author && `by ${author}`
      };
    }
  }
});
```

## 🔌 API Routes

### Contact Form Handler

```typescript
// app/api/contact/route.ts
import { sendEmail } from '@/lib/email/client';

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, message } = body;
  
  // Validate input
  if (!name || !email || !message) {
    return Response.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }
  
  // Send email
  try {
    await sendEmail({
      to: process.env.EMAIL_TO_ADDRESS!,
      from: process.env.EMAIL_FROM_ADDRESS!,
      subject: `Contact form submission from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Failed to send email:', error);
    return Response.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
```

## 🎨 Component Architecture

### Component Hierarchy

```
Layout (Root)
├── Header
│   └── Navigation
│       ├── NavItem
│       └── MobileMenu
├── Page Content
│   ├── HeroSection
│   ├── ContentBlock
│   │   ├── TextBlock
│   │   ├── ImageBlock
│   │   └── CTABlock
│   └── FormSection
│       └── ContactForm
│           ├── Input
│           ├── Textarea
│           └── Button
└── Footer
    ├── FooterNav
    └── SocialLinks
```

### Design Patterns

#### Composition Pattern

Build complex UIs from simple components:

```typescript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

#### Render Props / Children as Function

```typescript
<DataFetcher query={query}>
  {(data, loading) => (
    loading ? <Spinner /> : <Content data={data} />
  )}
</DataFetcher>
```

## 🚀 Performance Optimization

### Image Optimization

```typescript
import Image from 'next/image';

<Image
  src={imageUrl}
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

### Code Splitting

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />,
  ssr: false
});
```

### Caching Strategy

- Static assets: Cache forever with versioned URLs
- API responses: Cache with appropriate TTL
- Images: Use Sanity CDN caching
- HTML pages: ISR with sensible revalidation periods

## 🔒 Security Considerations

### Environment Variables

- Never expose sensitive keys in client-side code
- Use `NEXT_PUBLIC_` prefix only for truly public values
- Rotate secrets regularly

### API Route Protection

```typescript
// Verify webhook signatures
// Rate limit requests
// Validate and sanitize inputs
// Use CORS appropriately
```

### Content Security Policy

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  }
];
```

## 📈 Scalability

### Horizontal Scaling

- Deploy to multiple edge locations (Vercel Edge Network)
- Use CDN for static assets
- Load balance API routes

### Vertical Scaling

- Optimize database queries
- Implement efficient caching
- Use pagination for large datasets

### Monitoring

- Track Core Web Vitals
- Monitor API response times
- Set up error tracking (Sentry, LogRocket)
- Implement analytics (Google Analytics, Plausible)

---

For implementation details and setup instructions, see [README.md](./README.md).
