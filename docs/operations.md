# Operations Guide

This guide covers deployment, environment configuration, monitoring, backups, and operational best practices.

## Deployment

### Initial Setup

#### 1. Sanity Project Setup

**Create Sanity Project:**

```bash
# Install Sanity CLI globally
npm install -g @sanity/cli

# Login to Sanity
sanity login

# Create new project (if not already created)
sanity init

# Follow prompts:
# - Create new project or use existing
# - Choose project name
# - Use default dataset configuration
# - Choose schema template (or start clean)
```

**Deploy Sanity Studio:**

```bash
cd sanity

# Build studio
npm run build

# Deploy to Sanity's hosted platform
sanity deploy

# Choose studio hostname (e.g., your-project.sanity.studio)
```

**Get Project Credentials:**

```bash
# Get project ID
sanity debug --secrets

# Create API token with Editor permissions
# Go to: https://www.sanity.io/manage
# Select your project → API → Tokens → Add New Token
```

#### 2. Vercel Deployment

**Connect Repository:**

1. Push code to GitHub/GitLab/Bitbucket
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Configure project settings

**Environment Variables:**

Add the following in Vercel dashboard (Settings → Environment Variables):

```bash
# Application
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token
SANITY_PREVIEW_SECRET=random_secret_string

# Email Provider (Resend example)
EMAIL_FROM=noreply@yourdomain.com
EMAIL_PROVIDER_API_KEY=re_xxxxxxxxxxxxx

# Optional: SMTP (if using custom email)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key

# Optional: Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Deploy:**

```bash
# Manual deployment
vercel

# Production deployment
vercel --prod

# Or push to main branch for auto-deployment
git push origin main
```

### Deployment Checklist

Before deploying to production:

- ✅ All environment variables configured in Vercel
- ✅ Sanity Studio deployed and accessible
- ✅ API tokens have correct permissions
- ✅ Domain configured (if using custom domain)
- ✅ SSL certificate active (automatic with Vercel)
- ✅ Build succeeds locally (`npm run build`)
- ✅ No TypeScript errors (`npx tsc --noEmit`)
- ✅ Linting passes (`npm run lint`)
- ✅ `.env.example` updated with all required variables
- ✅ README updated with current setup instructions
- ✅ Test contact form in production
- ✅ Verify SEO meta tags with inspection tools
- ✅ Test on mobile devices
- ✅ Check page load performance
- ✅ Configure monitoring and error tracking

## Environment Configuration

### Development Environment

**`.env.local`** (local development only):

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_api_token
EMAIL_FROM=test@localhost.com
EMAIL_PROVIDER_API_KEY=test_key
```

**Running Locally:**

```bash
# Terminal 1: Next.js app
npm run dev

# Terminal 2: Sanity Studio
cd sanity
npm run dev
```

**Access:**
- Next.js App: http://localhost:3000
- Sanity Studio: http://localhost:3333

### Staging Environment

Use a separate Sanity dataset for staging:

```bash
# Create staging dataset
cd sanity
sanity dataset create staging

# Deploy with staging configuration
NEXT_PUBLIC_SANITY_DATASET=staging vercel
```

### Production Environment

**Best Practices:**

1. **Use Production Dataset**: `NEXT_PUBLIC_SANITY_DATASET=production`
2. **Secure API Tokens**: Use read-only tokens when possible
3. **Enable CDN**: Set `useCdn: true` in Sanity client
4. **Rate Limiting**: Implement on API routes
5. **Error Tracking**: Set up Sentry or similar
6. **Monitoring**: Configure uptime monitoring

## DNS & Domain Configuration

### Custom Domain Setup (Vercel)

1. Go to Vercel project settings
2. Navigate to **Domains**
3. Add your custom domain
4. Add DNS records at your registrar:

**For apex domain (example.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

5. Wait for DNS propagation (up to 48 hours)
6. SSL certificate auto-issued by Vercel

### Email Domain Setup (Resend)

For sending emails from your domain:

1. Go to Resend dashboard → Domains
2. Add your domain
3. Add DNS records at your registrar:

```
Type: TXT
Name: @
Value: resend_verify_...

Type: MX
Name: @
Priority: 10
Value: feedback-smtp.resend.com

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none;
```

4. Verify domain in Resend dashboard
5. Update `EMAIL_FROM` environment variable

## Sanity Configuration

### API Token Permissions

Create different tokens for different purposes:

**Editor Token** (for CMS writes):
- Permission: Editor
- Use: Server-side API routes that create/update content
- Environment: `SANITY_API_TOKEN`

**Viewer Token** (for reads):
- Permission: Viewer
- Use: Frontend content fetching in production
- Recommended for security

### Dataset Management

**Creating Datasets:**

```bash
# Create new dataset
sanity dataset create <dataset-name>

# List datasets
sanity dataset list

# Copy production to staging
sanity dataset copy production staging
```

**When to Use Multiple Datasets:**

- **production**: Live site content
- **staging**: Testing changes before production
- **development**: Local development (optional)

### Content Migration

**Export Content:**

```bash
# Export entire dataset
sanity dataset export production export.tar.gz

# Export specific document types
sanity dataset export production export.tar.gz \
  --types page,blogPost,author
```

**Import Content:**

```bash
# Import dataset
sanity dataset import export.tar.gz staging

# Import with missing IDs (create new documents)
sanity dataset import export.tar.gz staging --missing
```

### Studio Customization

**Custom Logo:**

Edit `sanity/sanity.config.ts`:

```typescript
export default defineConfig({
  // ...
  studio: {
    components: {
      logo: () => <img src="/logo.png" alt="Logo" />,
    },
  },
});
```

**Custom Theme:**

```typescript
export default defineConfig({
  // ...
  theme: {
    colors: {
      primary: "#007bff",
    },
  },
});
```

## Email Service Configuration

### Using Resend (Recommended)

**Setup:**

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (see DNS setup above)
3. Create API key
4. Add to environment variables:

```bash
EMAIL_FROM=noreply@yourdomain.com
EMAIL_PROVIDER_API_KEY=re_xxxxxxxxxxxxx
```

**Implementation:**

```typescript
// lib/email/client.ts
import { Resend } from "resend";

const resend = new Resend(process.env.EMAIL_PROVIDER_API_KEY);

export async function sendContactEmail(data: any) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: "contact@yourdomain.com",
    subject: "New Contact Form Submission",
    html: `<h1>Contact from ${data.name}</h1>...`,
  });
}
```

### Using SMTP

**Configuration:**

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

**Implementation:**

```typescript
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT!),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});
```

### Email Rate Limiting

Implement rate limiting to prevent abuse:

```typescript
// app/api/contact/route.ts
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: "Too many submissions, please try again later",
});

export async function POST(request: Request) {
  // Check rate limit
  // Process form submission
}
```

**Alternative: Vercel Rate Limiting**

Use Vercel's built-in rate limiting (Pro plan):

```typescript
export const config = {
  api: {
    bodyParser: true,
    rateLimit: {
      max: 5,
      windowMs: 60000, // 1 minute
    },
  },
};
```

## Monitoring & Logging

### Error Tracking (Sentry)

**Setup:**

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

**Configuration:**

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

**Environment Variable:**

```bash
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

### Uptime Monitoring

**Recommended Services:**

- **Vercel Analytics**: Built-in with Vercel Pro
- **UptimeRobot**: Free tier available
- **Pingdom**: Professional monitoring
- **Better Uptime**: Modern interface

**Setup Healthcheck Endpoint:**

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
```

### Performance Monitoring

**Web Vitals:**

```typescript
// app/layout.tsx
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Google Analytics:**

```typescript
// app/layout.tsx
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
```

## Backup Strategy

### Sanity Content Backups

**Automated Daily Backups:**

```bash
# Create backup script
# backup.sh
#!/bin/bash
DATE=$(date +%Y%m%d)
sanity dataset export production "backups/backup-$DATE.tar.gz"

# Upload to cloud storage (e.g., S3)
aws s3 cp "backups/backup-$DATE.tar.gz" s3://your-bucket/sanity-backups/
```

**Schedule with Cron:**

```bash
# Run daily at 2 AM
0 2 * * * /path/to/backup.sh
```

**Or Use GitHub Actions:**

```yaml
# .github/workflows/backup.yml
name: Backup Sanity Content
on:
  schedule:
    - cron: "0 2 * * *" # Daily at 2 AM UTC
  workflow_dispatch:

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
      - name: Install Sanity CLI
        run: npm install -g @sanity/cli
      - name: Export Dataset
        run: |
          sanity dataset export production backup.tar.gz \
            --token ${{ secrets.SANITY_TOKEN }}
      - name: Upload to S3
        uses: aws-actions/configure-aws-credentials@v2
        # ... configure S3 upload
```

### Code Backups

- **Git Repository**: Primary backup
- **GitHub/GitLab**: Cloud hosting
- **Local Clones**: Team member machines

### Database Considerations

This project uses Sanity (managed):
- Sanity handles infrastructure backups
- Content is replicated across regions
- Export data regularly for extra safety

## Security Best Practices

### Environment Variables

- Never commit `.env` files to Git
- Use `.env.example` as template
- Rotate API keys regularly (quarterly)
- Use different keys for staging/production

### API Security

**Rate Limiting:**

Implement on all public API routes:

```typescript
const rateLimitMap = new Map();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const max = 5; // max requests

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  const requests = rateLimitMap.get(ip);
  const recentRequests = requests.filter((time) => now - time < windowMs);

  if (recentRequests.length >= max) {
    return false;
  }

  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
}
```

**Input Validation:**

```typescript
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(1000),
});

export async function POST(request: Request) {
  const body = await request.json();
  const validated = contactSchema.parse(body); // Throws if invalid
  // Process validated data
}
```

**CSRF Protection:**

```typescript
// Use origin header verification
const origin = request.headers.get("origin");
const allowedOrigins = [process.env.NEXT_PUBLIC_APP_URL];

if (!allowedOrigins.includes(origin)) {
  return new Response("Forbidden", { status: 403 });
}
```

### Content Security Policy

Add CSP headers in `next.config.mjs`:

```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://api.sanity.io",
            ].join("; "),
          },
        ],
      },
    ];
  },
};
```

## Performance Optimization

### Caching Strategy

**Sanity CDN:**

```typescript
// lib/sanity/client.ts
export const sanityClient = createClient({
  useCdn: process.env.NODE_ENV === "production", // Use CDN in prod
  apiVersion: "2024-01-01",
});
```

**Next.js Caching:**

```typescript
// Revalidate every hour
export const revalidate = 3600;

// Or use on-demand revalidation
import { revalidatePath } from "next/cache";
revalidatePath("/blog");
```

### Image Optimization

**Sanity Image CDN:**

```typescript
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(sanityClient);

// Responsive images
export function getImageUrl(source: any, width: number) {
  return builder
    .image(source)
    .width(width)
    .format("webp")
    .quality(80)
    .url();
}
```

**Next.js Image Component:**

```typescript
<Image
  src={imageUrl}
  alt={alt}
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### Build Optimization

**Analyze Bundle Size:**

```bash
npm install @next/bundle-analyzer

# next.config.mjs
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);

# Run analysis
ANALYZE=true npm run build
```

## Troubleshooting

### Common Issues

**Build Fails on Vercel:**

- Check environment variables are set
- Verify all dependencies in `package.json`
- Check TypeScript errors: `npx tsc --noEmit`
- Review build logs in Vercel dashboard

**Sanity Connection Issues:**

- Verify project ID and dataset name
- Check API token permissions
- Ensure CORS configured in Sanity project
- Test queries in Sanity Vision

**Email Not Sending:**

- Verify API key is correct
- Check email provider dashboard for errors
- Ensure domain is verified (Resend/SendGrid)
- Check rate limits haven't been exceeded
- Review email provider logs

**Images Not Loading:**

- Check Sanity project ID is correct
- Verify image references in queries
- Test image URLs in browser
- Check CDN configuration

### Debug Mode

Enable debug logging:

```typescript
// lib/sanity/client.ts
export const sanityClient = createClient({
  // ...
  withCredentials: true,
  useCdn: false, // Disable CDN for debugging
});

// Log all queries
sanityClient.config({
  logger: console,
});
```

### Support Resources

- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Sanity Help**: [sanity.io/help](https://sanity.io/help)
- **Community**: Join respective Discord/Slack communities

## Maintenance Schedule

### Daily

- Monitor error tracking dashboard
- Check uptime status
- Review email delivery logs

### Weekly

- Review analytics and performance metrics
- Check for security updates
- Test contact form functionality
- Review Sanity Studio access logs

### Monthly

- Update dependencies (`npm update`)
- Review and rotate API keys
- Backup content (if not automated)
- Review and optimize images
- Check SSL certificate expiry

### Quarterly

- Major dependency updates
- Security audit
- Performance audit
- Content cleanup (remove old drafts)
- Review user access permissions

## Scaling Considerations

### High Traffic

- Enable Vercel Pro for better performance
- Use Sanity CDN aggressively
- Implement Redis caching for API routes
- Consider ISR for frequently accessed pages

### Content Growth

- Monitor Sanity dataset size
- Archive old content
- Optimize queries (select only needed fields)
- Use pagination for large lists

### Team Growth

- Implement Sanity access roles
- Create editing guidelines
- Set up staging environment
- Document internal processes

## Further Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Sanity Operations](https://www.sanity.io/docs/operations)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Contact Workflow](./contact-workflow.md)
- [Architecture Overview](./architecture.md)
