import { Resend } from "resend";
import { env } from "@/lib/env";

let resendInstance: Resend | null = null;

function getResendClient() {
  if (!resendInstance) {
    resendInstance = new Resend(env.email.apiKey);
  }
  return resendInstance;
}

export async function sendContactEmail({
  name,
  company,
  email,
  phone,
  message,
  budget,
}: {
  name: string;
  company: string;
  email: string;
  phone?: string;
  message: string;
  budget: string;
}) {
  const budgetLabel = {
    "under-10k": "Under $10,000",
    "10k-50k": "$10,000 - $50,000",
    "50k-100k": "$50,000 - $100,000",
    "100k-250k": "$100,000 - $250,000",
    "250k-plus": "$250,000+",
    "not-sure": "Not sure yet",
  }[budget];

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
        New Contact Form Submission
      </h2>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
        <p style="margin: 10px 0;"><strong>Company:</strong> ${company}</p>
        <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        ${phone ? `<p style="margin: 10px 0;"><strong>Phone:</strong> ${phone}</p>` : ""}
        <p style="margin: 10px 0;"><strong>Budget Range:</strong> ${budgetLabel}</p>
      </div>

      <div style="margin: 20px 0;">
        <h3 style="color: #334155;">Message:</h3>
        <p style="white-space: pre-wrap; background: #ffffff; padding: 15px; border-left: 4px solid #3b82f6; border-radius: 4px;">
          ${message}
        </p>
      </div>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      
      <p style="color: #64748b; font-size: 12px;">
        This email was sent from your website's contact form.
      </p>
    </div>
  `;

  const textContent = `
New Contact Form Submission

Name: ${name}
Company: ${company}
Email: ${email}
${phone ? `Phone: ${phone}` : ""}
Budget Range: ${budgetLabel}

Message:
${message}

---
This email was sent from your website's contact form.
  `;

  try {
    const resend = getResendClient();
    const result = await resend.emails.send({
      from: env.email.from,
      to: env.email.to,
      subject: `New Contact Form Submission from ${name} - ${company}`,
      html: htmlContent,
      text: textContent,
      replyTo: email,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to send email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}

export async function sendConfirmationEmail({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1e40af; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
        Thank You for Contacting Us
      </h2>
      
      <p style="color: #334155; line-height: 1.6;">
        Hi ${name},
      </p>
      
      <p style="color: #334155; line-height: 1.6;">
        Thank you for reaching out! We've received your message and will get back to you as soon as possible, 
        typically within 1-2 business days.
      </p>
      
      <p style="color: #334155; line-height: 1.6;">
        In the meantime, feel free to explore our resources or reach out directly if you have urgent questions.
      </p>

      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      
      <p style="color: #64748b; font-size: 12px;">
        This is an automated confirmation email. Please do not reply to this message.
      </p>
    </div>
  `;

  const textContent = `
Thank You for Contacting Us

Hi ${name},

Thank you for reaching out! We've received your message and will get back to you as soon as possible, 
typically within 1-2 business days.

In the meantime, feel free to explore our resources or reach out directly if you have urgent questions.

---
This is an automated confirmation email. Please do not reply to this message.
  `;

  try {
    const resend = getResendClient();
    const result = await resend.emails.send({
      from: env.email.from,
      to: email,
      subject: "Thank you for contacting us",
      html: htmlContent,
      text: textContent,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to send confirmation",
    };
  }
}
