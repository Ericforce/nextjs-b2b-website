import { z } from "zod";

export const budgetOptions = [
  "Less than $5,000",
  "$5,000 – $15,000",
  "$15,000 – $30,000",
  "$30,000+"
] as const;

export const contactFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: "Name must be at least 2 characters long." })
      .max(120, { message: "Name must be 120 characters or fewer." }),
    email: z
      .string()
      .trim()
      .email({ message: "Enter a valid email address." })
      .max(160, { message: "Email must be 160 characters or fewer." }),
    company: z
      .string()
      .trim()
      .max(160, { message: "Company name must be 160 characters or fewer." })
      .optional(),
    budget: z
      .union([z.enum(budgetOptions), z.literal("")])
      .optional()
      .transform((value) => (value && value.length > 0 ? value : undefined)),
    message: z
      .string()
      .trim()
      .min(10, { message: "Please provide at least 10 characters." })
      .max(2000, { message: "Message must be 2000 characters or fewer." }),
    honeypot: z.string().optional(),
    recaptchaToken: z.string().optional()
  })
  .superRefine((data, ctx) => {
    if (data.honeypot && data.honeypot.trim().length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["honeypot"],
        message: "Spam detected."
      });
    }
  });

export type ContactFormInput = z.input<typeof contactFormSchema>;
export type ContactFormValues = z.output<typeof contactFormSchema>;
