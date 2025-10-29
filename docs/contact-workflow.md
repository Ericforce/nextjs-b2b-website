# Contact Form Workflow

This guide explains how the contact form system works, including email delivery, spam protection, and troubleshooting.

## Current Implementation

The contact form is **fully implemented** using:
- **React Hook Form** for client-side form management
- **Zod** for schema validation (client and server)
- **Resend** for email delivery with React Email templates
- **In-memory rate limiting** (3 requests per minute per IP)
- **Honeypot field** for spam bot detection
- **Consent checkbox** for GDPR compliance

**Location:** The contact form automatically appears on the `/contact` page.

**Files:**
- Form component: `src/components/forms/ContactForm.tsx`
- API route: `src/app/api/contact/route.ts`
- Email template: `src/emails/contact-request.tsx`
- Rate limiting: `src/lib/utils/rate-limit.ts`
- Resend client: `src/lib/email/resend.ts`

## Overview

The contact form allows visitors to send messages to your team. When a user submits the form:

1. Form data is validated on the client
2. Request is sent to API route
3. Server validates and sanitizes data
4. Spam protection checks are performed
5. Email is sent via email provider
6. Optional: Submission stored in CMS
7. Success/error response returned to user

## Architecture

```
┌─────────────┐
│   User      │
│  Browser    │
└──────┬──────┘
       │ 1. Fill form
       │ 2. Submit
       ↓
┌──────────────────┐
│  ContactForm     │
│  Component       │
│  (Client-side)   │
└──────┬───────────┘
       │ 3. POST /api/contact
       ↓
┌──────────────────────┐
│  API Route           │
│  /api/contact/route.ts│
│  • Validate          │
│  • Rate limit        │
│  • Spam check        │
└──────┬───────────────┘
       │
       ├─────────────────────────┐
       │                         │
       ↓                         ↓
┌──────────────┐        ┌───────────────┐
│ Email Service│        │ Sanity CMS    │
│ (Resend/SMTP)│        │ (Optional)    │
└──────┬───────┘        └───────┬───────┘
       │                        │
       │ 4. Send email          │ 4. Store submission
       ↓                        ↓
┌──────────────┐        ┌───────────────┐
│ Recipient    │        │ Admin Review  │
│ Inbox        │        │ Dashboard     │
└──────────────┘        └───────────────┘
```

## Implementation

### Contact Form Component

```typescript
// components/ContactForm.tsx
"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

type FormState = {
  name: string;
  email: string;
  company: string;
  message: string;
};

type SubmitState = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSubmitState("success");
      setFormData({ name: "", email: "", company: "", message: "" });
    } catch (error) {
      setSubmitState("error");
      setErrorMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        required
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      
      <Input
        label="Email"
        type="email"
        required
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      
      <Input
        label="Company"
        value={formData.company}
        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
      />
      
      <textarea
        className="w-full p-2 border rounded"
        rows={5}
        required
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        placeholder="Your message..."
      />

      <Button type="submit" disabled={submitState === "loading"}>
        {submitState === "loading" ? "Sending..." : "Send Message"}
      </Button>

      {submitState === "success" && (
        <p className="text-green-600">Message sent successfully!</p>
      )}

      {submitState === "error" && (
        <p className="text-red-600">{errorMessage}</p>
      )}
    </form>
  );
}
```

### API Route Handler

```typescript
// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendContactEmail } from "@/lib/email/client";
import { rateLimit } from "@/lib/utils/rate-limit";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  company: z.string().max(100).optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000),
  honeypot: z.string().optional(), // Spam trap
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rateLimitResult = await rateLimit(ip);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validated = contactSchema.parse(body);

    // Honeypot spam check
    if (validated.honeypot) {
      // Bot filled honeypot field
      return NextResponse.json({ success: true }); // Fake success
    }

    // Send email
    await sendContactEmail({
      name: validated.name,
      email: validated.email,
      company: validated.company || "Not provided",
      message: validated.message,
    });

    // Optional: Store in Sanity
    // await storeContactSubmission(validated);

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully!",
    });

  } catch (error) {
    console.error("Contact form error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
```

## Email Integration

### Using Resend

```typescript
// lib/email/client.ts
import { Resend } from "resend";

const resend = new Resend(process.env.EMAIL_PROVIDER_API_KEY);

export async function sendContactEmail(data: {
  name: string;
  email: string;
  company: string;
  message: string;
}) {
  const { name, email, company, message } = data;

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: "contact@yourdomain.com", // Your team's email
    replyTo: email, // User's email for easy replies
    subject: `New Contact Form Submission from ${name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
      <hr>
      <p><small>Sent from your website contact form</small></p>
    `,
  });
}
```

### Using SMTP

```typescript
// lib/email/client.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendContactEmail(data: {
  name: string;
  email: string;
  company: string;
  message: string;
}) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: "contact@yourdomain.com",
    replyTo: data.email,
    subject: `New Contact Form Submission from ${data.name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Company:</strong> ${data.company}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, "<br>")}</p>
    `,
  });
}
```

### Email Templates

For better email design, use templates:

```typescript
// lib/email/templates.ts
export function contactEmailTemplate(data: {
  name: string;
  email: string;
  company: string;
  message: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #007bff;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .content {
            background-color: #f4f4f4;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .field {
            margin-bottom: 15px;
          }
          .label {
            font-weight: bold;
            color: #555;
          }
          .footer {
            text-align: center;
            color: #888;
            font-size: 12px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>New Contact Form Submission</h1>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">Name:</span> ${data.name}
          </div>
          <div class="field">
            <span class="label">Email:</span> 
            <a href="mailto:${data.email}">${data.email}</a>
          </div>
          <div class="field">
            <span class="label">Company:</span> ${data.company}
          </div>
          <div class="field">
            <span class="label">Message:</span>
            <p>${data.message.replace(/\n/g, "<br>")}</p>
          </div>
        </div>
        <div class="footer">
          <p>This email was sent from your website contact form</p>
          <p>To reply, simply respond to this email</p>
        </div>
      </body>
    </html>
  `;
}
```

## Spam Protection

### 1. Honeypot Field

Add hidden field that humans won't fill but bots will:

```typescript
// In ContactForm component
<input
  type="text"
  name="honeypot"
  style={{ display: "none" }}
  tabIndex={-1}
  autoComplete="off"
  value={formData.honeypot}
  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
/>
```

### 2. Rate Limiting

Limit submissions per IP address:

```typescript
// lib/utils/rate-limit.ts
const rateLimitMap = new Map<string, number[]>();

export function rateLimit(
  identifier: string,
  options = { windowMs: 60000, max: 3 }
): { success: boolean; remaining: number } {
  const now = Date.now();
  const { windowMs, max } = options;

  if (!rateLimitMap.has(identifier)) {
    rateLimitMap.set(identifier, []);
  }

  const requests = rateLimitMap.get(identifier)!;
  const recentRequests = requests.filter((time) => now - time < windowMs);

  if (recentRequests.length >= max) {
    return { success: false, remaining: 0 };
  }

  recentRequests.push(now);
  rateLimitMap.set(identifier, recentRequests);

  return {
    success: true,
    remaining: max - recentRequests.length - 1,
  };
}
```

### 3. reCAPTCHA (Optional)

Add Google reCAPTCHA v3 for advanced protection:

```typescript
// Install: npm install react-google-recaptcha-v3

// app/layout.tsx
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function RootLayout({ children }) {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}

// components/ContactForm.tsx
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export function ContactForm() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!executeRecaptcha) {
      return;
    }

    const token = await executeRecaptcha("contact_form");

    const response = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify({ ...formData, recaptchaToken: token }),
    });
  };
}

// API route verification
async function verifyRecaptcha(token: string): Promise<boolean> {
  const response = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
    }
  );

  const data = await response.json();
  return data.success && data.score > 0.5; // Adjust threshold
}
```

### 4. Content Validation

Check for spam patterns:

```typescript
function containsSpam(text: string): boolean {
  const spamPatterns = [
    /viagra/i,
    /casino/i,
    /crypto/i,
    /\[url=/i,
    /\[link=/i,
    /<a href/i,
  ];

  return spamPatterns.some((pattern) => pattern.test(text));
}

// In API route
if (containsSpam(validated.message)) {
  return NextResponse.json(
    { error: "Invalid content detected" },
    { status: 400 }
  );
}
```

## Storing Submissions in Sanity

Optionally store submissions in CMS for admin review:

### Create Sanity Schema

```typescript
// sanity/schemas/contactSubmission.ts
export default {
  name: "contactSubmission",
  title: "Contact Submissions",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Name",
      type: "string",
      readOnly: true,
    },
    {
      name: "email",
      title: "Email",
      type: "string",
      readOnly: true,
    },
    {
      name: "company",
      title: "Company",
      type: "string",
      readOnly: true,
    },
    {
      name: "message",
      title: "Message",
      type: "text",
      readOnly: true,
    },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Reviewed", value: "reviewed" },
          { title: "Responded", value: "responded" },
          { title: "Spam", value: "spam" },
        ],
      },
      initialValue: "new",
    },
    {
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      readOnly: true,
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "email",
      status: "status",
    },
    prepare({ title, subtitle, status }) {
      return {
        title: `${title} (${status})`,
        subtitle: subtitle,
      };
    },
  },
};
```

### Store Submission

```typescript
// lib/sanity/submissions.ts
import { sanityClient } from "./client";

export async function storeContactSubmission(data: {
  name: string;
  email: string;
  company: string;
  message: string;
}) {
  await sanityClient.create({
    _type: "contactSubmission",
    name: data.name,
    email: data.email,
    company: data.company,
    message: data.message,
    status: "new",
    submittedAt: new Date().toISOString(),
  });
}
```

## Testing

### Local Testing

**Test Email Delivery:**

Use [Mailhog](https://github.com/mailhog/MailHog) for local email testing:

```bash
# Install Mailhog (macOS)
brew install mailhog

# Run Mailhog
mailhog

# Configure SMTP
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=test
SMTP_PASSWORD=test
```

Access emails at: http://localhost:8025

### Manual Testing Checklist

- ✅ Submit form with valid data
- ✅ Submit with invalid email
- ✅ Submit with empty required fields
- ✅ Submit with very long message (1000+ chars)
- ✅ Submit multiple times rapidly (rate limit)
- ✅ Check email arrives in inbox
- ✅ Verify email content formatting
- ✅ Test reply-to address works
- ✅ Check mobile responsive design
- ✅ Test with screen reader

### Automated Tests

```typescript
// __tests__/api/contact.test.ts
import { POST } from "@/app/api/contact/route";

describe("Contact API", () => {
  it("should accept valid submission", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        message: "This is a test message",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it("should reject invalid email", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Test User",
        email: "invalid-email",
        message: "This is a test message",
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
```

## Troubleshooting

### Emails Not Sending

**Check Configuration:**

```bash
# Verify environment variables
echo $EMAIL_PROVIDER_API_KEY
echo $EMAIL_FROM
```

**Test Email Provider:**

```typescript
// Test script: scripts/test-email.ts
import { sendContactEmail } from "../lib/email/client";

async function test() {
  try {
    await sendContactEmail({
      name: "Test",
      email: "test@example.com",
      company: "Test Co",
      message: "Test message",
    });
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

test();
```

**Common Issues:**

1. **Invalid API Key**: Verify key in email provider dashboard
2. **Domain Not Verified**: Complete domain verification (Resend/SendGrid)
3. **Rate Limit Hit**: Check provider dashboard for usage limits
4. **Firewall Blocking**: Ensure outbound SMTP ports open
5. **Wrong From Address**: Must match verified domain

### Form Not Submitting

**Check Browser Console:**

```javascript
// Look for errors like:
// - CORS errors
// - Network errors
// - Validation errors
```

**Verify API Route:**

```bash
# Test API directly with curl
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "message": "Test message"
  }'
```

**Common Issues:**

1. **CORS Error**: Add origin header check in API route
2. **Rate Limited**: Wait and try again
3. **Validation Failed**: Check required fields
4. **Server Error**: Check API route logs

### Rate Limiting Too Strict

Adjust rate limit parameters:

```typescript
// Increase limits for testing
const rateLimitResult = await rateLimit(ip, {
  windowMs: 60000, // 1 minute
  max: 10, // Allow 10 requests
});
```

## Best Practices

### User Experience

- **Clear Labels**: Make form fields obvious
- **Inline Validation**: Show errors as user types
- **Loading State**: Disable button and show spinner
- **Success Message**: Confirm submission received
- **Error Handling**: Show friendly error messages
- **Accessibility**: Proper ARIA labels and keyboard navigation

### Security

- **Always Validate Server-Side**: Never trust client input
- **Use HTTPS**: Encrypt data in transit
- **Rate Limit**: Prevent abuse
- **Honeypot**: Catch basic bots
- **Content Filtering**: Block obvious spam
- **Log Suspicious Activity**: Monitor for patterns

### Email Delivery

- **Use Verified Domain**: Better deliverability
- **Set Reply-To**: Enable easy responses
- **Professional Templates**: Look credible
- **Include Context**: Show submission details
- **Test Regularly**: Ensure emails arrive
- **Monitor Bounce Rate**: Fix issues promptly

### Maintenance

- **Monitor Submission Rate**: Detect spam attacks
- **Review Stored Submissions**: Mark spam
- **Update Spam Filters**: Adapt to new patterns
- **Check Email Deliverability**: Test monthly
- **Rotate API Keys**: Update annually
- **Review Rate Limits**: Adjust based on traffic

## Configuration Reference

### Environment Variables

```bash
# Required for email sending via Resend
RESEND_API_KEY=re_xxxxx                         # Your Resend API key
RESEND_FROM_EMAIL=noreply@yourdomain.com        # Verified sender email
CONTACT_RECIPIENT_EMAIL=contact@yourdomain.com  # Where to receive submissions

# Application URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Setting Up Resend

1. **Sign up** at [resend.com](https://resend.com)
2. **Verify your domain**:
   - Go to Domains in dashboard
   - Add your domain
   - Add DNS records (SPF, DKIM, DMARC)
   - Wait for verification
3. **Create API Key**:
   - Go to API Keys
   - Create new key
   - Copy to `RESEND_API_KEY`
4. **Test email**:
   - Use verified domain for `RESEND_FROM_EMAIL`
   - Set your email as `CONTACT_RECIPIENT_EMAIL`
   - Submit test form

**For Development:**
- Use Resend's test domain: `onboarding@resend.dev`
- Emails sent from test domain only go to your verified account email
- No DNS setup required for testing

### Rate Limit Settings

The rate limiter uses **in-memory storage** with the following defaults:

```typescript
// Default configuration in src/lib/utils/rate-limit.ts
const RATE_LIMIT_WINDOW_MS = 60 * 1000;  // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3;       // 3 submissions per IP

// Adjust when calling rateLimit():
rateLimit(identifier, {
  windowMs: 120000,  // 2 minutes
  maxRequests: 5,    // 5 submissions
});
```

**Important Notes:**
- Rate limits are stored in memory and reset on server restart
- For production with multiple servers, consider Redis-based rate limiting
- Rate limit is per IP address (using `x-forwarded-for` header)
- Cleanup runs every 60 seconds to remove expired entries

### Spam Detection

Current implementation includes:

1. **Honeypot Field**: Hidden field that bots typically fill
   - Located in `ContactForm.tsx` with `aria-hidden` and off-screen positioning
   - If filled, API returns fake success response

2. **Validation Limits**:
   ```typescript
   // Defined in Zod schema (src/app/api/contact/route.ts)
   name: max 100 characters
   email: valid email format required
   company: max 100 characters (optional)
   phone: max 20 characters (optional)
   message: min 10, max 2000 characters
   consent: must be true
   ```

3. **Rate Limiting**: 3 submissions per minute per IP

**Future Enhancements:**
- Add reCAPTCHA v3 for advanced bot detection
- Implement content-based spam filtering
- Add IP blacklisting for repeat offenders

## Further Resources

- [Resend Documentation](https://resend.com/docs)
- [Nodemailer Documentation](https://nodemailer.com/)
- [reCAPTCHA Documentation](https://developers.google.com/recaptcha)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Operations Guide](./operations.md)
