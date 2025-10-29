import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { render } from "@react-email/render";
import { getResendClient, isResendConfigured } from "@/lib/email/resend";
import { ContactRequestEmail } from "@/emails/contact-request";
import { env } from "@/lib/env";
import { rateLimit } from "@/lib/utils/rate-limit";

const contactSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z
    .string()
    .max(100, "Company name must be less than 100 characters")
    .optional(),
  phone: z
    .string()
    .max(20, "Phone number must be less than 20 characters")
    .optional(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters"),
  consent: z
    .boolean()
    .refine((val) => val === true, "You must agree to be contacted"),
  honeypot: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    if (!isResendConfigured()) {
      console.error("Resend is not properly configured");
      return NextResponse.json(
        {
          error:
            "Email service is not configured. Please contact the administrator.",
        },
        { status: 503 }
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const rateLimitResult = rateLimit(ip);

    if (!rateLimitResult.success) {
      const resetInSeconds = Math.ceil(
        (rateLimitResult.resetAt - Date.now()) / 1000
      );
      return NextResponse.json(
        {
          error: `Too many requests. Please try again in ${resetInSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = contactSchema.parse(body);

    if (validated.honeypot) {
      console.warn("Honeypot field filled - likely spam bot");
      return NextResponse.json({
        success: true,
        message: "Your message has been sent successfully!",
      });
    }

    const resend = getResendClient();

    const emailHtml = render(
      ContactRequestEmail({
        name: validated.name,
        email: validated.email,
        company: validated.company,
        phone: validated.phone,
        message: validated.message,
      })
    );

    const emailText = `
New Contact Form Submission

Name: ${validated.name}
Email: ${validated.email}
${validated.company ? `Company: ${validated.company}` : ""}
${validated.phone ? `Phone: ${validated.phone}` : ""}

Message:
${validated.message}

---
This email was sent from your website contact form.
To reply, simply respond to this email.
    `.trim();

    const result = await resend.emails.send({
      from: env.resend.fromEmail,
      to: env.contact.recipientEmail,
      replyTo: validated.email,
      subject: `New Contact Form Submission from ${validated.name}`,
      html: emailHtml,
      text: emailText,
    });

    if (result.error) {
      console.error("Failed to send email:", result.error);
      return NextResponse.json(
        { error: "Failed to send message. Please try again later." },
        { status: 500 }
      );
    }

    console.log("Contact email sent successfully:", result.data?.id);

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully!",
    });
  } catch (error) {
    console.error("Contact form error:", error);

    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }

    return NextResponse.json(
      {
        error:
          "An unexpected error occurred. Please try again later or contact us directly.",
      },
      { status: 500 }
    );
  }
}
