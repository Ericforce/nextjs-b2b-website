import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/contact";
import { sendContactEmail, sendConfirmationEmail } from "@/lib/email/resend";
import { checkHoneypot, getHoneypotError } from "@/lib/security/honeypot";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/security/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const rateLimit = checkRateLimit(ip);

    if (!rateLimit.success) {
      const waitTime = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);

      return NextResponse.json(
        {
          success: false,
          error: `Too many requests. Please try again in ${waitTime} seconds.`,
        },
        {
          status: 429,
          headers: getRateLimitHeaders(
            rateLimit.remaining,
            rateLimit.resetTime
          ),
        }
      );
    }

    const body = await request.json();

    const validationResult = contactSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          errors: validationResult.error.format(),
        },
        {
          status: 400,
          headers: getRateLimitHeaders(
            rateLimit.remaining,
            rateLimit.resetTime
          ),
        }
      );
    }

    const data = validationResult.data;

    if (!checkHoneypot(data.honeypot)) {
      return NextResponse.json(
        {
          success: false,
          error: getHoneypotError(),
        },
        {
          status: 400,
          headers: getRateLimitHeaders(
            rateLimit.remaining,
            rateLimit.resetTime
          ),
        }
      );
    }

    const emailResult = await sendContactEmail({
      name: data.name,
      company: data.company,
      email: data.email,
      phone: data.phone,
      message: data.message,
      budget: data.budget,
    });

    if (!emailResult.success) {
      console.error("Failed to send contact email:", emailResult.error);
      return NextResponse.json(
        {
          success: false,
          error:
            "Failed to send your message. Please try again or contact us directly.",
        },
        {
          status: 500,
          headers: getRateLimitHeaders(
            rateLimit.remaining,
            rateLimit.resetTime
          ),
        }
      );
    }

    await sendConfirmationEmail({
      name: data.name,
      email: data.email,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your message. We'll be in touch soon!",
      },
      {
        status: 200,
        headers: getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime),
      }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}
