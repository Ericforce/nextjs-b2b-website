# B2B Next.js Application with Sanity CMS

A modern, high-performance B2B website built with Next.js 14 and Sanity CMS. Features dynamic page building with modular sections, integrated blog, SEO optimization, and contact form functionality.

## 🚀 Features

- **Next.js 14** with App Router for modern React development
- **Sanity CMS** for flexible content management
- **Dynamic Page Builder** with reusable sections
- **Blog System** with categories and authors
- **SEO Optimized** with metadata API and Open Graph support
- **Contact Form** with spam protection and email delivery
- **TypeScript** for type safety
- **Tailwind CSS** with custom B2B design system
- **Responsive Design** optimized for all devices
- **Image Optimization** via Sanity CDN and Next.js Image
- **Preview Mode** for content editors
- **Performance Focused** with SSG and ISR

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Content Management](#content-management)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🏁 Quick Start

### Prerequisites

- **Node.js** 18.17 or later
- **npm**, yarn, pnpm, or bun
- **Sanity Account** (free at [sanity.io](https://www.sanity.io))
- **Email Service** (Resend, SendGrid, or SMTP)

### Installation

1. **Clone the repository:**

```bash
git clone <repository-url>
cd <project-directory>
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up Sanity CMS:**

```bash
# Install Sanity CLI globally
npm install -g @sanity/cli

# Login to Sanity
sanity login

# Navigate to Sanity directory (if separate) or initialize in project
# If you have a separate sanity/ directory:
cd sanity
npm install

# Create Sanity project (if not already created)
sanity init

# Note your project ID and dataset name
```

4. **Configure environment variables:**

```bash
# Copy example environment file
cp .env.example .env.local

# Edit .env.local with your actual values
# See "Environment Variables" section below for details
```

5. **Start development servers:**

```bash
# Terminal 1: Next.js application
npm run dev

# Terminal 2: Sanity Studio (if separate)
cd sanity
npm run dev
```

6. **Access the application:**

- **Website**: http://localhost:3000
- **Sanity Studio**: http://localhost:3333 (or your configured port)

## 🏗️ Architecture Overview

This application uses a modern headless CMS architecture:

```
┌─────────────────┐
│   Next.js App   │  ← Frontend (Server & Client Components)
│   (Vercel)      │  ← API Routes (contact form, etc.)
└────────┬────────┘
         │
         │ GROQ Queries
         │
┌────────▼────────┐
│   Sanity CMS    │  ← Content Storage & API
│   (Cloud)       │  ← Image CDN
└────────┬────────┘
         │
         │ Edit Content
         │
┌────────▼────────┐
│ Sanity Studio   │  ← Content Management Interface
│ (Hosted/Local)  │
└─────────────────┘
```

### Key Concepts

**Dynamic Page Rendering:**
- Pages are built from reusable section components
- Content editors compose pages by adding/ordering sections
- Section types include: Hero, Features, CTA, Testimonials, FAQ, etc.

**Section Registry:**
- Maps Sanity section types to React components
- Enables flexible page composition
- Easy to extend with new section types

**Content Fetching:**
- Server Components fetch data directly from Sanity
- GROQ queries for flexible data retrieval
- CDN caching for optimal performance

**SEO Implementation:**
- Next.js Metadata API for meta tags
- Automatic sitemap generation
- Open Graph and Twitter Card support
- Structured data ready

For detailed architecture information, see [docs/architecture.md](./docs/architecture.md).

## 📁 Project Structure

```
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Homepage
│   │   ├── [slug]/              # Dynamic pages
│   │   ├── blog/                # Blog routes
│   │   └── api/                 # API routes (contact, etc.)
│   ├── components/
│   │   ├── layout/              # Header, Footer, Navigation
│   │   ├── sections/            # Section components (Hero, Features, etc.)
│   │   ├── ui/                  # Reusable UI components
│   │   └── SectionRenderer.tsx  # Section registry
│   ├── lib/
│   │   ├── sanity/              # Sanity client & queries
│   │   ├── email/               # Email integration
│   │   ├── utils/               # Utility functions
│   │   ├── env.ts               # Environment config
│   │   └── constants.ts         # App constants
│   ├── types/                   # TypeScript types
│   └── data/                    # Static data
├── sanity/                      # Sanity Studio (if separate)
│   ├── schemas/                 # Content schemas
│   ├── sanity.config.ts         # Studio configuration
│   └── sanity.cli.ts            # CLI configuration
├── docs/                        # Documentation
├── public/                      # Static assets
└── ...config files
```

## 🔐 Environment Variables

Copy `.env.example` to `.env.local` and configure:

### Required Variables

```bash
# Application Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id    # From Sanity dashboard
NEXT_PUBLIC_SANITY_DATASET=production             # Usually 'production'
SANITY_API_TOKEN=your_api_token                   # Create in Sanity dashboard

# Resend Email Configuration (Required for contact form)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx       # Your Resend API key
RESEND_FROM_EMAIL=noreply@yourdomain.com           # Verified sender email
CONTACT_RECIPIENT_EMAIL=contact@yourdomain.com     # Where to send contact form submissions
```

### Optional Variables

```bash
# Environment
NODE_ENV=development

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Preview Mode
SANITY_PREVIEW_SECRET=your_preview_secret
```

### Getting API Keys

**Sanity:**
1. Go to [sanity.io/manage](https://www.sanity.io/manage)
2. Select your project
3. Navigate to API → Tokens
4. Create new token with "Editor" permissions

**Resend (Recommended for contact form):**
1. Sign up at [resend.com](https://resend.com)
2. Verify your domain or use the free testing domain (@onboarding.resend.dev)
3. Create an API key in the dashboard
4. Set `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `CONTACT_RECIPIENT_EMAIL` in `.env.local`

**Testing Contact Form Locally:**
- In development, you can use Resend's test domain: `onboarding@resend.dev`
- To test without sending real emails, you can temporarily disable the email send in the API route
- Check the server console for logs of contact form submissions

For detailed environment setup, see [docs/operations.md](./docs/operations.md).

## 💻 Development

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check
```

### Development Workflow

1. **Start both servers** (Next.js and Sanity Studio)
2. **Create/edit content** in Sanity Studio
3. **View changes** in Next.js app (may need refresh)
4. **Make code changes** with hot reload
5. **Test thoroughly** before committing
6. **Run linting** to check code quality
7. **Build locally** to catch build errors

### Adding New Features

**Adding a New Section Type:**

1. Create Sanity schema in `sanity/schemas/sections/`
2. Create React component in `src/components/sections/`
3. Add to section registry in `SectionRenderer.tsx`
4. Update TypeScript types
5. Test in Studio and frontend

**Adding a New Page Route:**

1. Create directory in `src/app/`
2. Add `page.tsx` file
3. Implement data fetching (if needed)
4. Add metadata for SEO
5. Update navigation if applicable

**Adding API Route:**

1. Create route handler in `src/app/api/`
2. Implement validation and error handling
3. Add rate limiting if needed
4. Test with various inputs
5. Update documentation

## 📝 Content Management

### Accessing Sanity Studio

**Local Development:**
```bash
cd sanity
npm run dev
# Access at http://localhost:3333
```

**Production Studio:**
```bash
# Deploy Studio to Sanity's hosted platform
sanity deploy

# Access at https://your-project.sanity.studio
```

### Content Types

- **Pages**: Main site pages (Home, About, etc.)
- **Blog Posts**: Articles with rich content
- **Authors**: Blog post authors
- **Categories**: Blog post organization
- **Site Settings**: Global site configuration

### Creating a New Page

1. Open Sanity Studio
2. Navigate to "Pages"
3. Click "Create" button
4. Fill in required fields:
   - Title (e.g., "About Us")
   - Slug (e.g., "about-us")
   - SEO metadata
5. Add sections to build page content
6. Click "Publish"
7. View at `yourdomain.com/about-us`

### Editing Content

1. Open Sanity Studio
2. Select content type from sidebar
3. Click on item to edit
4. Make changes
5. Click "Publish" to update live site
6. Changes appear immediately (or after cache revalidation)

For detailed editing instructions, see [docs/editing-guide.md](./docs/editing-guide.md).

## 🚢 Deployment

### Deploying to Vercel (Recommended)

1. **Push code to Git repository** (GitHub, GitLab, Bitbucket)

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Configure project

3. **Set environment variables:**
   - Add all variables from `.env.local`
   - Use Vercel dashboard: Settings → Environment Variables

4. **Deploy:**
   - Push to main branch for automatic deployment
   - Or use Vercel CLI: `vercel --prod`

5. **Configure custom domain** (optional):
   - Add domain in Vercel dashboard
   - Update DNS records at registrar
   - SSL certificate auto-issued

### Deploying Sanity Studio

```bash
cd sanity

# Build and deploy to Sanity's hosting
sanity deploy

# Choose studio hostname (e.g., your-project.sanity.studio)
```

### Deployment Checklist

Before going live:

- ✅ All environment variables configured
- ✅ Sanity Studio deployed and accessible
- ✅ Custom domain configured (if applicable)
- ✅ Email delivery tested
- ✅ Contact form working
- ✅ SEO metadata verified
- ✅ Images optimized
- ✅ Analytics configured
- ✅ Error monitoring set up
- ✅ Performance tested (Lighthouse)
- ✅ Mobile responsive checked
- ✅ Browser compatibility verified

For detailed deployment guide, see [docs/operations.md](./docs/operations.md).

## 📚 Documentation

Comprehensive guides are available in the `docs/` directory:

- **[Content Model](./docs/content-model.md)**: Complete schema reference with field descriptions
- **[Editing Guide](./docs/editing-guide.md)**: How-to guide for content editors
- **[Architecture](./docs/architecture.md)**: Technical overview and implementation details
- **[Operations](./docs/operations.md)**: Deployment, monitoring, and maintenance
- **[Contact Workflow](./docs/contact-workflow.md)**: Email flow and spam protection

## 🐛 Troubleshooting

### Common Issues

**Build Fails:**
- Check all environment variables are set
- Run `npx tsc --noEmit` to check TypeScript errors
- Verify all dependencies are installed
- Check Node.js version (18.17+)

**Content Not Showing:**
- Verify Sanity project ID and dataset
- Check content is published in Studio
- Clear Next.js cache: `rm -rf .next`
- Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)

**Emails Not Sending:**
- Verify email API key is correct
- Check email provider dashboard for errors
- Ensure domain is verified (for Resend/SendGrid)
- Test with provided test scripts

**Images Not Loading:**
- Verify Sanity project ID
- Check image references in queries
- Test image URLs directly in browser
- Ensure Sanity CDN is enabled

**Rate Limit Errors:**
- Wait a few minutes before retrying (default: 3 requests per minute per IP)
- Check rate limit configuration in `src/lib/utils/rate-limit.ts`
- Note: Rate limiting uses in-memory storage and resets on server restart
- Contact admin if persistent

**Contact Form Issues:**
- Ensure Resend environment variables are set correctly
- Verify sender email is verified in Resend dashboard
- Check server logs for detailed error messages
- Test with valid email addresses only
- Ensure honeypot field is not being filled (indicates bot)

For more solutions, see:
- [docs/operations.md#troubleshooting](./docs/operations.md#troubleshooting)
- [docs/contact-workflow.md#troubleshooting](./docs/contact-workflow.md#troubleshooting)

### Getting Help

1. Check documentation in `docs/` directory
2. Review error messages carefully
3. Search GitHub issues (if public repo)
4. Contact development team
5. Consult official documentation:
   - [Next.js Docs](https://nextjs.org/docs)
   - [Sanity Docs](https://www.sanity.io/docs)
   - [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 🎨 Design System

The application includes a comprehensive B2B-focused design system:

### Color Palette

- **Primary (Blue)**: Main actions, links, branding
- **Secondary (Slate)**: Text, UI elements
- **Accent (Amber)**: Highlights, CTAs
- **Neutral (Gray)**: Backgrounds, borders

### Typography

- **Font**: Inter (optimized for readability)
- **Sizes**: 2xs to 5xl scale
- **Line Heights**: Optimized for body text and headings

### Components

- **Buttons**: Primary, secondary, outline variants
- **Cards**: Elevation with soft shadows
- **Inputs**: Focus states and validation
- **Sections**: Reusable page building blocks

All design tokens are configured in `tailwind.config.ts`.

## 🧪 Testing

### Manual Testing

- Test all forms with valid/invalid data
- Check responsive design on multiple devices
- Verify links and navigation
- Test contact form delivery
- Check SEO metadata with inspection tools
- Validate accessibility (keyboard navigation, screen readers)

### Recommended Tools

- **Lighthouse**: Performance and SEO audits
- **WAVE**: Accessibility testing
- **Responsive Viewer**: Multi-device testing
- **Mailhog**: Local email testing

## 🔒 Security

### Best Practices

- Never commit `.env` files
- Use environment variables for secrets
- Implement rate limiting on API routes
- Validate all user input
- Keep dependencies updated
- Use HTTPS in production
- Enable CORS restrictions
- Monitor for suspicious activity

For detailed security guidelines, see [docs/operations.md#security-best-practices](./docs/operations.md#security-best-practices).

## 📈 Performance

### Optimization Features

- **Static Site Generation (SSG)**: Fast page loads
- **Incremental Static Regeneration (ISR)**: Fresh content without rebuilds
- **Image Optimization**: Automatic resizing and WebP conversion
- **Code Splitting**: Smaller bundle sizes
- **CDN Caching**: Fast global delivery
- **Server Components**: Zero client-side JavaScript where possible

### Performance Targets

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Lighthouse Score**: > 90

## 🤝 Contributing

### Development Guidelines

1. Follow existing code style and conventions
2. Use TypeScript for type safety
3. Write meaningful commit messages
4. Test changes thoroughly
5. Update documentation when needed
6. Run linting before committing

### Code Style

- Use Prettier for formatting (configured)
- Follow ESLint rules (configured)
- Use TypeScript strict mode
- Prefer functional components
- Use descriptive variable names

### Pull Request Process

1. Create feature branch from `main`
2. Make changes with clear commits
3. Run `npm run lint` and `npm run build`
4. Create pull request with description
5. Wait for review and approval
6. Merge when approved

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Resources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [React Documentation](https://react.dev)

### Learning Resources

- [Next.js Learn Course](https://nextjs.org/learn)
- [Sanity Learn](https://www.sanity.io/learn)
- [Tailwind UI Components](https://tailwindui.com)

### Community

- [Next.js Discord](https://nextjs.org/discord)
- [Sanity Community Slack](https://slack.sanity.io)

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org) - The React Framework
- [Sanity](https://www.sanity.io) - Content Platform
- [Tailwind CSS](https://tailwindcss.com) - CSS Framework
- [TypeScript](https://www.typescriptlang.org) - Type Safety
- [Vercel](https://vercel.com) - Deployment Platform

---

**Need Help?** Check the [documentation](./docs/) or reach out to the development team.

**Found a Bug?** Please report it with detailed reproduction steps.

**Want to Contribute?** We welcome contributions! See contributing guidelines above.
