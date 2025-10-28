# Contact Form Demo

This project implements an accessible contact form with client-side validation, spam protection, email delivery, and rate limiting using Next.js 14, React Hook Form, and Zod.

## Getting started

```bash
pnpm install # or npm install / yarn
pnpm dev      # runs the development server at http://localhost:3000
```

The primary user-facing component lives onscreen at `/` and includes a full contact section with success and error states plus toast notifications.

## Environment variables

Copy `.env.example` to `.env.local` (or `.env`) and configure the values that make sense for your environment.

| Variable | Description |
| --- | --- |
| `RESEND_API_KEY` | **Required for email delivery.** API key for [Resend](https://resend.com/). Leave unset to log submissions locally instead of sending mail. |
| `CONTACT_FROM_EMAIL` | **Required for email delivery.** The verified sender address to deliver from (example: `hello@yourdomain.com`). |
| `CONTACT_TO_EMAIL` | **Required for email delivery.** One or more recipient addresses (comma-separated). |
| `CONTACT_RATE_LIMIT_MAX` | (Optional) Number of POST requests allowed per IP address and window. Defaults to `5`. |
| `CONTACT_RATE_LIMIT_WINDOW_MS` | (Optional) Rate-limit window size in milliseconds. Defaults to `60000` (1 minute). |
| `CONTACT_RECAPTCHA_ENABLED` | Set to `true` to require server-side reCAPTCHA v3 verification. Requires `RECAPTCHA_SECRET_KEY`. |
| `CONTACT_RECAPTCHA_MIN_SCORE` | (Optional) Minimum acceptable reCAPTCHA score. Defaults to `0.3`. |
| `RECAPTCHA_SECRET_KEY` | Secret key from Google reCAPTCHA (used server-side). |
| `NEXT_PUBLIC_CONTACT_RECAPTCHA_ENABLED` | Matching client-side flag for reCAPTCHA usage. Must be `true` when `CONTACT_RECAPTCHA_ENABLED` is `true`. |
| `NEXT_PUBLIC_CONTACT_RECAPTCHA_SITE_KEY` | Site key from Google reCAPTCHA (exposed on the client). |

If `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, or `CONTACT_TO_EMAIL` are missing the API handler will log each submission to the server console and return a success response so you can still test end-to-end without third-party configuration.

## Features

- **Accessibility:** Semantic markup with proper labels, focus styles, aria messaging, keyboard navigation support, and hidden honeypot fields.
- **Validation:** Shared Zod schema ensures both client and server validation stay in sync. React Hook Form handles UX and inline errors.
- **Toast notifications:** Lightweight toast provider with focus-safe dismiss buttons communicates success and failure states.
- **Spam mitigation:** Hidden honeypot field blocks basic bots. Optional Google reCAPTCHA v3 integration protects against more advanced spam when enabled via environment variables.
- **Rate limiting:** Edge middleware enforces per-IP throttling (defaults to five submissions per minute) to defend the API endpoint.
- **Email delivery:** Resend email handler sends a structured template to the configured contact address. When delivery isn’t configured, submissions are safely logged for local testing.

## Testing the form

1. Start the dev server (`pnpm dev`).
2. Open [`http://localhost:3000`](http://localhost:3000) and complete the contact form.
3. With Resend configured, you should receive an email at the `CONTACT_TO_EMAIL` address. Without configuration, inspect the terminal running Next.js for a structured log entry.
4. Trigger validation errors by leaving required fields empty or entering invalid email addresses.
5. To verify rate limiting, submit the form more than the configured limit within a minute. The API will respond with HTTP 429 and the UI will display an error toast.
6. When reCAPTCHA is enabled, the form button will stay disabled until the widget is ready. Invalid tokens or low scores will display an error toast.

## Folder structure overview

```
app/
  api/contact/route.ts    # Contact form submission handler
  layout.tsx               # Global layout, toast provider
  page.tsx                 # Home page + contact section
components/
  contact/                 # Contact form UI components
  ui/                      # Toast provider and hook
emails/                    # Resend React email templates
lib/                       # Validation schema & helpers
middleware.ts              # Global rate limiting for /api/contact
```

Feel free to adjust copy, styles, or configuration defaults to match your brand and infrastructure.
