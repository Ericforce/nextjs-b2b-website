"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input, Textarea } from "@/components/ui";

const contactFormSchema = z.object({
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
  consent: z.boolean().refine((val) => val === true, {
    message: "You must agree to be contacted",
  }),
  honeypot: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  className?: string;
}

export default function ContactForm({ className }: ContactFormProps) {
  const [submitState, setSubmitState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phone: "",
      message: "",
      consent: false,
      honeypot: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitState("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      setSubmitState("success");
      reset();

      setTimeout(() => {
        setSubmitState("idle");
      }, 5000);
    } catch (error) {
      setSubmitState("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again."
      );

      setTimeout(() => {
        setSubmitState("idle");
        setErrorMessage("");
      }, 8000);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className} noValidate>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Input
            id="name"
            label="Name"
            type="text"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register("name")}
            required
            aria-required="true"
            aria-invalid={errors.name ? "true" : "false"}
          />

          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="john@company.com"
            error={errors.email?.message}
            {...register("email")}
            required
            aria-required="true"
            aria-invalid={errors.email ? "true" : "false"}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Input
            id="company"
            label="Company (Optional)"
            type="text"
            placeholder="Acme Inc."
            error={errors.company?.message}
            {...register("company")}
            aria-invalid={errors.company ? "true" : "false"}
          />

          <Input
            id="phone"
            label="Phone (Optional)"
            type="tel"
            placeholder="+1 (555) 123-4567"
            error={errors.phone?.message}
            {...register("phone")}
            aria-invalid={errors.phone ? "true" : "false"}
          />
        </div>

        <Textarea
          id="message"
          label="Message"
          placeholder="Tell us about your project or inquiry..."
          rows={6}
          error={errors.message?.message}
          {...register("message")}
          required
          aria-required="true"
          aria-invalid={errors.message ? "true" : "false"}
        />

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="consent"
              type="checkbox"
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              {...register("consent")}
              aria-required="true"
              aria-invalid={errors.consent ? "true" : "false"}
            />
          </div>
          <div className="ml-3">
            <label htmlFor="consent" className="text-sm text-secondary-700">
              I agree to be contacted about my inquiry
              {errors.consent && (
                <span className="block text-red-600 mt-1">
                  {errors.consent.message}
                </span>
              )}
            </label>
          </div>
        </div>

        <input
          type="text"
          {...register("honeypot")}
          style={{
            position: "absolute",
            left: "-9999px",
            width: "1px",
            height: "1px",
          }}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        {submitState === "success" && (
          <div
            className="p-4 rounded-lg bg-green-50 border border-green-200"
            role="alert"
            aria-live="polite"
          >
            <p className="text-sm font-medium text-green-800">
              ✓ Your message has been sent successfully!
            </p>
            <p className="text-sm text-green-700 mt-1">
              We'll get back to you as soon as possible.
            </p>
          </div>
        )}

        {submitState === "error" && errorMessage && (
          <div
            className="p-4 rounded-lg bg-red-50 border border-red-200"
            role="alert"
            aria-live="polite"
          >
            <p className="text-sm font-medium text-red-800">✗ {errorMessage}</p>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={submitState === "loading"}
          className="w-full sm:w-auto"
        >
          {submitState === "loading" ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </Button>
      </div>
    </form>
  );
}
