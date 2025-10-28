# Next.js + Sanity ISR Project

A modern, performant website built with Next.js and Sanity CMS, featuring Incremental Static Regeneration (ISR) for optimal performance and content freshness.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Commands](#available-commands)
- [Architecture](#architecture)
- [ISR & Sanity Webhooks](#isr--sanity-webhooks)
- [Deployment](#deployment)
- [Email Provider Setup](#email-provider-setup)
- [Testing & Linting](#testing--linting)
- [Troubleshooting](#troubleshooting)
- [Content Editing Guide](#content-editing-guide)

## 🎯 Project Overview

This project is a high-performance website that combines the power of Next.js with Sanity CMS to deliver:

- **Fast Page Loads**: Leveraging Next.js's static site generation and ISR
- **Real-time Content Updates**: Automatic page regeneration via Sanity webhooks
- **Easy Content Management**: Non-technical team members can update content via Sanity Studio
- **SEO Optimized**: Server-side rendered pages with proper meta tags
- **Type-safe**: Full TypeScript support for enhanced developer experience

## 🛠 Tech Stack

### Frontend
- **[Next.js 14+](https://nextjs.org/)** - React framework with App Router
- **[React 18+](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling

### CMS
- **[Sanity.io](https://www.sanity.io/)** - Headless CMS
- **[Sanity Studio](https://www.sanity.io/studio)** - Content editing interface
- **[@sanity/client](https://www.sanity.io/docs/js-client)** - JavaScript client for fetching content

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Jest](https://jestjs.io/)** - Unit testing
- **[React Testing Library](https://testing-library.com/react)** - Component testing

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.17.0 or higher
- **npm**: v9.0.0 or higher (or yarn/pnpm)
- **Git**: Latest version
- **Sanity CLI**: Install globally with `npm install -g @sanity/cli`

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Sanity

#### Create a Sanity Project

If you don't have a Sanity project yet:

```bash
npm create sanity@latest -- --project-name "Your Project Name" --dataset production
```

Follow the prompts to:
- Select a project template (or choose "Clean project")
- Choose authentication provider
- Select dataset name (e.g., `production`)

#### Configure Sanity Studio

Navigate to your Sanity studio directory (usually `studio/` or `sanity/`):

```bash
cd studio
npm install
```

#### Deploy Sanity Studio

```bash
npm run deploy
```

This will deploy your Sanity Studio to `<your-project>.sanity.studio`

### 4. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Fill in your environment variables (see [Environment Variables](#environment-variables) section below).

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

The Sanity Studio is typically accessible at [http://localhost:3000/studio](http://localhost:3000/studio) or via the deployed studio URL.

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Required Variables

```bash
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your_read_token_or_write_token

# Sanity Webhook Secret (for ISR revalidation)
SANITY_REVALIDATE_SECRET=your_random_secret_string

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Email Provider (e.g., SendGrid, Resend, Postmark)
EMAIL_PROVIDER_API_KEY=your_email_api_key
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
EMAIL_TO_ADDRESS=contact@yourdomain.com
```

### Optional Variables

```bash
# Analytics
NEXT_PUBLIC_GA_TRACKING_ID=your_google_analytics_id

# Preview Mode
SANITY_PREVIEW_SECRET=your_preview_secret

# Environment
NODE_ENV=development
```

### Finding Your Sanity Credentials

1. **Project ID**: Found in your Sanity project settings at [sanity.io/manage](https://sanity.io/manage)
2. **Dataset**: Usually `production` or as configured during setup
3. **API Token**: Create a token in your Sanity project settings under API → Tokens
   - For development: Read token is sufficient
   - For production: Write token needed for mutations
4. **Revalidate Secret**: Generate a random string (e.g., using `openssl rand -base64 32`)

## ⚡ Available Commands

### Development

```bash
# Start development server
npm run dev

# Start development server on a different port
npm run dev -- -p 3001

# Build for production
npm run build

# Start production server
npm run start
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Sanity

```bash
# Start Sanity Studio locally (if embedded)
npm run sanity:dev

# Deploy Sanity Studio
npm run sanity:deploy

# Export Sanity dataset
npm run sanity:export

# Import Sanity dataset
npm run sanity:import
```

## 🏗 Architecture

### Folder Structure

```
.
├── app/                      # Next.js App Router pages
│   ├── (site)/              # Public-facing site routes
│   │   ├── page.tsx         # Homepage
│   │   ├── blog/            # Blog section
│   │   │   ├── page.tsx     # Blog listing
│   │   │   └── [slug]/      # Individual blog post
│   │   └── [...slug]/       # Dynamic pages
│   ├── api/                 # API routes
│   │   ├── revalidate/      # ISR revalidation endpoint
│   │   └── contact/         # Contact form handler
│   ├── studio/              # Embedded Sanity Studio (optional)
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
│
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   ├── blocks/              # Content blocks from Sanity
│   └── sections/            # Page sections
│
├── lib/                     # Utility functions
│   ├── sanity/              # Sanity client and queries
│   │   ├── client.ts        # Sanity client configuration
│   │   ├── queries.ts       # GROQ queries
│   │   └── schemas/         # TypeScript types from schemas
│   └── utils.ts             # General utilities
│
├── sanity/                  # Sanity Studio configuration
│   ├── schemas/             # Content schemas
│   │   ├── documents/       # Document types (page, post, etc.)
│   │   ├── objects/         # Reusable object types
│   │   └── index.ts         # Schema registry
│   ├── lib/                 # Studio utilities
│   └── sanity.config.ts     # Studio configuration
│
├── public/                  # Static assets
│   ├── images/
│   └── fonts/
│
├── tests/                   # Test files
│   ├── unit/
│   └── e2e/
│
├── .env.local              # Local environment variables (gitignored)
├── .env.example            # Example environment variables
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies
```

### Data Flow

```
┌─────────────────┐
│  Sanity Studio  │ ─── Content Editor makes changes
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Sanity Dataset │ ─── Content stored in Sanity Cloud
└────────┬────────┘
         │
         ├──────────────────┐
         │                  │
         ▼                  ▼
┌─────────────────┐   ┌──────────────┐
│    Webhook      │   │  Build Time  │ ─── Initial build fetches all content
│   (triggers)    │   │    Fetch     │
└────────┬────────┘   └──────────────┘
         │                  │
         ▼                  ▼
┌─────────────────┐   ┌──────────────┐
│  Revalidation   │   │  Static HTML │ ─── Pages served as static files
│   API Route     │   │    Pages     │
└────────┬────────┘   └──────┬───────┘
         │                   │
         └───────┬───────────┘
                 ▼
         ┌──────────────┐
         │  Regenerated │ ─── ISR creates fresh page on demand
         │     Page     │
         └──────────────┘
```

## 🔄 ISR & Sanity Webhooks

### What is ISR?

Incremental Static Regeneration (ISR) allows you to:
- Update static pages after deployment without rebuilding the entire site
- Serve cached pages for fast performance
- Regenerate pages on-demand when content changes

### How It Works

1. **Initial Build**: Pages are pre-rendered at build time
2. **Serve Static**: Visitors receive cached static HTML (instant load)
3. **Background Regeneration**: After a set time or webhook trigger, Next.js regenerates the page
4. **Update Cache**: New version is cached and served to subsequent visitors

### Implementation

#### In Next.js Pages

```typescript
// app/blog/[slug]/page.tsx
export const revalidate = 60; // Revalidate every 60 seconds

export async function generateStaticParams() {
  const posts = await sanityClient.fetch(`*[_type == "post"]{ slug }`);
  return posts.map((post) => ({ slug: post.slug.current }));
}
```

#### Revalidation API Route

The project includes an API route for on-demand revalidation:

```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const body = await request.json();
  const secret = request.headers.get('x-sanity-signature');
  
  // Verify webhook secret
  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return new Response('Invalid signature', { status: 401 });
  }
  
  // Revalidate the specific path
  revalidatePath(body.path);
  
  return new Response('Revalidated', { status: 200 });
}
```

### Setting Up Sanity Webhooks

1. **Navigate to Webhooks**: Go to your Sanity project at [sanity.io/manage](https://sanity.io/manage)
2. **Create New Webhook**: Click "Add webhook"
3. **Configure**:
   - **Name**: ISR Revalidation
   - **URL**: `https://your-site.com/api/revalidate`
   - **Dataset**: `production`
   - **Trigger on**: Create, Update, Delete
   - **Filter**: (Optional) Add a GROQ filter to limit which documents trigger the webhook
   - **HTTP method**: POST
   - **Secret**: Add your `SANITY_REVALIDATE_SECRET`
   - **Headers**: Add `x-sanity-signature` with your secret

4. **Payload Example**:
```json
{
  "_type": "post",
  "slug": { "current": "my-blog-post" },
  "_id": "...",
  "path": "/blog/my-blog-post"
}
```

5. **Test**: Make a change in Sanity Studio and verify your pages update

### Webhook Payload Handling

The webhook can include information about which page to revalidate:

```typescript
// Parse webhook body and determine paths to revalidate
const pathsToRevalidate = [];

if (body._type === 'post') {
  pathsToRevalidate.push('/blog');
  pathsToRevalidate.push(`/blog/${body.slug.current}`);
} else if (body._type === 'page') {
  pathsToRevalidate.push(`/${body.slug.current}`);
}

// Revalidate all affected paths
for (const path of pathsToRevalidate) {
  revalidatePath(path);
}
```

## 🚀 Deployment

### Deploying Next.js Application

#### Vercel (Recommended)

1. **Install Vercel CLI** (optional):
```bash
npm install -g vercel
```

2. **Deploy via CLI**:
```bash
vercel
```

Or **deploy via GitHub integration**:
1. Push your code to GitHub
2. Import your repository at [vercel.com/new](https://vercel.com/new)
3. Configure environment variables in Vercel dashboard
4. Deploy

#### Other Platforms

- **Netlify**: Connect your Git repository and configure build settings
- **AWS Amplify**: Use the Amplify console to deploy
- **Self-hosted**: Build with `npm run build` and run with `npm start`

### Deploying Sanity Studio

#### Option 1: Standalone Deployment

```bash
cd sanity
npm run deploy
```

Your studio will be available at `https://your-project.sanity.studio`

#### Option 2: Embedded in Next.js

Host the studio at `/studio` route in your Next.js app:

```typescript
// app/studio/[[...index]]/page.tsx
import { Studio } from 'sanity';
import config from '@/sanity/sanity.config';

export default function StudioPage() {
  return <Studio config={config} />;
}
```

### Post-Deployment Checklist

- [ ] Verify all environment variables are set in production
- [ ] Test Sanity webhook is triggering correctly
- [ ] Check ISR is working (make a content change and verify update)
- [ ] Verify email provider is sending emails
- [ ] Test all critical user flows
- [ ] Check page load performance with Lighthouse
- [ ] Verify SEO meta tags are correct
- [ ] Set up monitoring and error tracking (e.g., Sentry)

## 📧 Email Provider Setup

This project supports multiple email providers. Choose one based on your needs:

### Option 1: Resend (Recommended)

[Resend](https://resend.com/) offers a modern API and generous free tier.

1. **Sign up** at [resend.com](https://resend.com)
2. **Get API Key** from your dashboard
3. **Add to `.env.local`**:
```bash
EMAIL_PROVIDER=resend
EMAIL_PROVIDER_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
```

4. **Verify domain** in Resend dashboard for production use

### Option 2: SendGrid

1. **Sign up** at [sendgrid.com](https://sendgrid.com)
2. **Create API Key**: Settings → API Keys
3. **Add to `.env.local`**:
```bash
EMAIL_PROVIDER=sendgrid
EMAIL_PROVIDER_API_KEY=SG.xxxxxxxxxxxxx
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
```

### Option 3: Postmark

1. **Sign up** at [postmarkapp.com](https://postmarkapp.com)
2. **Get Server API Token**
3. **Add to `.env.local`**:
```bash
EMAIL_PROVIDER=postmark
EMAIL_PROVIDER_API_KEY=xxxxxxxxxxxxx
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
```

### Testing Email Locally

For development, consider using [MailHog](https://github.com/mailhog/MailHog) or [Mailtrap](https://mailtrap.io):

```bash
EMAIL_PROVIDER=smtp
SMTP_HOST=localhost
SMTP_PORT=1025
EMAIL_FROM_ADDRESS=dev@localhost
```

### Email Templates

Email templates are typically stored in `lib/email/templates/` and can be customized for different use cases (contact form, newsletter, etc.).

## 🧪 Testing & Linting

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (useful during development)
npm run test:watch

# Run with coverage report
npm run test:coverage
```

### Test Structure

```
tests/
├── unit/
│   ├── components/        # Component tests
│   ├── lib/              # Utility function tests
│   └── api/              # API route tests
└── e2e/
    ├── homepage.spec.ts  # End-to-end tests
    └── blog.spec.ts
```

### Writing Tests

Example component test:

```typescript
import { render, screen } from '@testing-library/react';
import Button from '@/components/ui/Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### Linting

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix
```

### Code Formatting

```bash
# Format all files
npm run format

# Check if files are formatted correctly
npm run format:check
```

### Pre-commit Hooks

This project uses Husky for pre-commit hooks to ensure code quality:

- **Lint staged files**: Runs ESLint on staged files
- **Format check**: Ensures code follows Prettier rules
- **Type check**: Runs TypeScript compiler
- **Test related**: Runs tests related to changed files

## 🔧 Troubleshooting

### Common Issues

#### 1. Sanity Client Connection Errors

**Problem**: `Error: Configuration must contain projectId`

**Solution**: 
- Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` is set in `.env.local`
- Restart development server after adding environment variables

#### 2. ISR Not Working

**Problem**: Content changes in Sanity don't reflect on the site

**Solutions**:
- Check webhook is configured correctly in Sanity dashboard
- Verify `SANITY_REVALIDATE_SECRET` matches in both Sanity webhook and `.env.local`
- Check webhook logs in Sanity dashboard for errors
- Ensure your revalidation API route is accessible publicly

#### 3. Build Failures

**Problem**: `Error: Page "/blog/[slug]" is missing "generateStaticParams()"`

**Solution**:
- Ensure all dynamic routes have `generateStaticParams()` function
- Check that your Sanity queries are returning data correctly

#### 4. Slow Performance

**Problem**: Pages loading slowly

**Solutions**:
- Check if you're fetching too much data from Sanity
- Optimize images using Next.js Image component
- Implement proper caching strategies
- Review Network tab in DevTools

#### 5. Type Errors

**Problem**: TypeScript errors with Sanity data

**Solution**:
- Regenerate types from Sanity schemas: `npm run sanity:typegen`
- Ensure schema definitions are up to date

#### 6. Email Not Sending

**Problem**: Contact form submissions not sending emails

**Solutions**:
- Verify email provider API key is correct
- Check email provider dashboard for delivery logs
- Ensure `EMAIL_FROM_ADDRESS` is verified/authorized
- Check server logs for error messages

### Debug Mode

Enable debug logging:

```bash
# .env.local
DEBUG=true
NEXT_PUBLIC_DEBUG=true
```

### Getting Help

1. **Check Documentation**: Review this README and inline code comments
2. **Sanity Docs**: [sanity.io/docs](https://www.sanity.io/docs)
3. **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
4. **GitHub Issues**: Check if similar issues exist in the repository
5. **Community**: Ask in Next.js or Sanity Slack/Discord communities

### Clearing Cache

If you encounter persistent issues:

```bash
# Remove Next.js cache
rm -rf .next

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Sanity cache
rm -rf sanity/.sanity
```

## 📚 Content Editing Guide

For detailed instructions on how to add and manage content, see [CONTENT_GUIDE.md](./CONTENT_GUIDE.md).

Quick overview:
- **Add Pages**: Create new page documents in Sanity Studio
- **Add Blog Posts**: Create new post documents with title, content, and metadata
- **Update Navigation**: Edit navigation document in Sanity
- **Preview Changes**: Use preview mode to see changes before publishing

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 📝 License

[Your License Here]

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a pull request

## 👥 Team

- **Development Team**: [Your team information]
- **Content Team**: See [CONTENT_GUIDE.md](./CONTENT_GUIDE.md) for content management
