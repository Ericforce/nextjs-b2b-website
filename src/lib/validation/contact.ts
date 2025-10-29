import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  company: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-\+\(\)]+$/.test(val),
      "Please enter a valid phone number"
    ),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
  budget: z.enum(
    ["under-10k", "10k-50k", "50k-100k", "100k-250k", "250k-plus", "not-sure"],
    { message: "Please select a budget range" }
  ),
  consent: z.literal(true, {
    message: "You must consent to being contacted to submit this form",
  }),
  honeypot: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const budgetOptions = [
  { value: "under-10k", label: "Under $10,000" },
  { value: "10k-50k", label: "$10,000 - $50,000" },
  { value: "50k-100k", label: "$50,000 - $100,000" },
  { value: "100k-250k", label: "$100,000 - $250,000" },
  { value: "250k-plus", label: "$250,000+" },
  { value: "not-sure", label: "Not sure yet" },
] as const;
