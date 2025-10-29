"use client";

import { useState } from "react";
import { Button, Input, Select, Textarea, Checkbox } from "@/components/ui";
import {
  contactSchema,
  budgetOptions,
  ContactFormData,
} from "@/lib/validation/contact";

type FormErrors = {
  [K in keyof ContactFormData]?: string[];
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
    budget: "",
    consent: false,
    honeypot: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof ContactFormData];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });
    setErrors({});

    const validationResult = contactSchema.safeParse(formData);

    if (!validationResult.success) {
      const fieldErrors: FormErrors = {};
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path[0] as keyof ContactFormData;
        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }
        fieldErrors[path]?.push(issue.message);
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus({
          type: "success",
          message: data.message || "Thank you for your message!",
        });
        setFormData({
          name: "",
          company: "",
          email: "",
          phone: "",
          message: "",
          budget: "",
          consent: false,
          honeypot: "",
        });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Something went wrong. Please try again.",
        });
      }
    } catch {
      setSubmitStatus({
        type: "error",
        message: "Failed to submit form. Please check your connection.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-custom py-16 md:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-secondary-600">
              Ready to transform your business? Let&apos;s discuss how we can
              help you achieve your goals.
            </p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  id="name"
                  name="name"
                  label="Full Name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name?.[0]}
                  required
                  aria-required="true"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />

                <Input
                  id="company"
                  name="company"
                  label="Company Name"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  error={errors.company?.[0]}
                  required
                  aria-required="true"
                  aria-invalid={!!errors.company}
                  aria-describedby={
                    errors.company ? "company-error" : undefined
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  id="email"
                  name="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email?.[0]}
                  required
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />

                <Input
                  id="phone"
                  name="phone"
                  label="Phone Number (Optional)"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone?.[0]}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
              </div>

              <Select
                id="budget"
                name="budget"
                label="Project Budget Range"
                value={formData.budget}
                onChange={handleChange}
                options={budgetOptions}
                error={errors.budget?.[0]}
                required
                aria-required="true"
                aria-invalid={!!errors.budget}
                aria-describedby={errors.budget ? "budget-error" : undefined}
              />

              <Textarea
                id="message"
                name="message"
                label="Tell us about your project"
                value={formData.message}
                onChange={handleChange}
                error={errors.message?.[0]}
                required
                aria-required="true"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
                rows={6}
              />

              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "-9999px",
                  width: "1px",
                  height: "1px",
                }}
              />

              <Checkbox
                id="consent"
                name="consent"
                checked={formData.consent}
                onChange={handleChange}
                error={errors.consent?.[0]}
                label={
                  <span>
                    I consent to being contacted about my inquiry and agree to
                    the{" "}
                    <a
                      href="/privacy"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      privacy policy
                    </a>
                    .
                  </span>
                }
                required
                aria-required="true"
                aria-invalid={!!errors.consent}
                aria-describedby={errors.consent ? "consent-error" : undefined}
              />

              {submitStatus.type && (
                <div
                  role="alert"
                  aria-live="polite"
                  className={`p-4 rounded-lg ${
                    submitStatus.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      name: "",
                      company: "",
                      email: "",
                      phone: "",
                      message: "",
                      budget: "",
                      consent: false,
                      honeypot: "",
                    });
                    setErrors({});
                    setSubmitStatus({ type: null, message: "" });
                  }}
                  disabled={isSubmitting}
                >
                  Clear Form
                </Button>
              </div>
            </form>
          </div>

          <div className="mt-12 text-center">
            <p className="text-secondary-600 mb-4">
              Prefer to reach us directly?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-secondary-700">
              <a
                href="mailto:contact@example.com"
                className="hover:text-primary-600"
              >
                contact@example.com
              </a>
              <span className="hidden sm:inline">•</span>
              <a href="tel:+1234567890" className="hover:text-primary-600">
                +1 (234) 567-890
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
