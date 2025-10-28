import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import ContactEmailTemplate from "@/emails/contact-email";
import { isRecaptchaEnabled, verifyRecaptchaToken } from "@/lib/recaptcha";
import { contactFormSchema } from "@/lib/validation/contact";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const resendApiKey = process.env.RESEND_API_KEY;
const contactToEmail = process.env.CONTACT_TO_EMAIL;
const contactFromEmail = process.env.CONTACT_FROM_EMAIL;
const resendClient = resendApiKey ? new Resend(resendApiKey) : null;

const MIN_RECAPTCHA_SCORE = Number(process.env.CONTACT_RECAPTCHA_MIN_SCORE ?? "0.3");

function recipientsList(value?: string | null): string[] {
  if (!value) return [];
  return value
    .split(/[;,]/)
    .map((segment) => segment.trim())
    .filter(Boolean);
}

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const raw = await req.json();
    const parsed = contactFormSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: parsed.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const { honeypot, recaptchaToken, ...payload } = parsed.data;

    if (honeypot && honeypot.trim().length > 0) {
      return NextResponse.json({ error: "Spam detected" }, { status: 400 });
    }

    if (isRecaptchaEnabled()) {
      if (!recaptchaToken) {
        return NextResponse.json(
          { error: "Security verification failed. Please refresh and try again." },
          { status: 400 }
        );
      }

      const remoteIp = req.ip ?? req.headers.get("x-forwarded-for");
      const verification = await verifyRecaptchaToken(recaptchaToken, remoteIp);

      if (!verification.success) {
        return NextResponse.json(
          { error: "Security verification failed." },
          { status: 400 }
        );
      }

      if (typeof verification.score === "number" && verification.score < MIN_RECAPTCHA_SCORE) {
        return NextResponse.json(
          { error: "Security verification did not meet the minimum score." },
          { status: 400 }
        );
      }
    }

    const name = payload.name.trim();
    const email = payload.email.trim();
    const company = payload.company?.trim() || undefined;
    const budget = payload.budget;
    const message = payload.message.replace(/\r\n/g, "\n").trim();

    if (!resendClient || !contactToEmail || !contactFromEmail) {
      console.info("[contact] Email delivery skipped - missing configuration", {
        name,
        email,
        company,
        budget,
        message
      });

      return NextResponse.json({
        ok: true,
        message: "Message received. Email delivery is not configured in this environment."
      });
    }

    const to = recipientsList(contactToEmail);

    if (to.length === 0) {
      console.warn("[contact] CONTACT_TO_EMAIL did not contain any valid recipients");
      return NextResponse.json(
        { error: "Email delivery is not configured correctly." },
        { status: 500 }
      );
    }

    const emailResponse = await resendClient.emails.send({
      from: contactFromEmail,
      to,
      subject: `New contact request from ${name}`,
      reply_to: email,
      react: ContactEmailTemplate({
        name,
        email,
        company,
        budget,
        message
      })
    });

    if (emailResponse.error) {
      console.error("[contact] Resend error", emailResponse.error);
      return NextResponse.json({ error: "Failed to send email." }, { status: 502 });
    }

    return NextResponse.json({
      ok: true,
      message: "Your message has been sent. We will be in touch shortly."
    });
  } catch (error) {
    console.error("[contact] Unexpected error", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
