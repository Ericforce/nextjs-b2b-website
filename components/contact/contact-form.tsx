"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  budgetOptions,
  contactFormSchema,
  type ContactFormInput,
  type ContactFormValues
} from "@/lib/validation/contact";
import { useToast } from "@/components/ui/use-toast";

const recaptchaSiteKey = process.env.NEXT_PUBLIC_CONTACT_RECAPTCHA_SITE_KEY ?? "";
const recaptchaEnabledFlag = process.env.NEXT_PUBLIC_CONTACT_RECAPTCHA_ENABLED === "true";
const shouldUseRecaptcha = recaptchaEnabledFlag && recaptchaSiteKey.length > 0;

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const HONEYPOT_FIELD = "company_website";

export default function ContactForm() {
  const { toast } = useToast();
  const [status, setStatus] = useState<
    | { type: "idle" }
    | { type: "success"; message: string }
    | { type: "error"; message: string }
  >({ type: "idle" });
  const [recaptchaReady, setRecaptchaReady] = useState(!shouldUseRecaptcha);
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      budget: "",
      message: "",
      honeypot: ""
    }
  });

  useEffect(() => {
    if (!shouldUseRecaptcha) {
      return;
    }

    let cancelled = false;
    const scriptId = "recaptcha-script";

    const ensureReady = () => {
      if (cancelled) return;
      window.grecaptcha?.ready(() => {
        if (!cancelled) {
          setRecaptchaReady(true);
        }
      });
    };

    if (window.grecaptcha) {
      ensureReady();
      return () => {
        cancelled = true;
      };
    }

    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    const handleError = () => {
      if (!cancelled) {
        setRecaptchaError("Security check failed to load. Please try again later.");
      }
    };

    if (existingScript) {
      existingScript.addEventListener("load", ensureReady);
      existingScript.addEventListener("error", handleError);
      return () => {
        cancelled = true;
        existingScript.removeEventListener("load", ensureReady);
        existingScript.removeEventListener("error", handleError);
      };
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", ensureReady);
    script.addEventListener("error", handleError);

    document.head.appendChild(script);

    return () => {
      cancelled = true;
      script.removeEventListener("load", ensureReady);
      script.removeEventListener("error", handleError);
    };
  }, [shouldUseRecaptcha, recaptchaSiteKey]);

  const submitContactForm = handleSubmit(async (values) => {
    setStatus({ type: "idle" });

    let recaptchaToken: string | undefined;

    if (shouldUseRecaptcha) {
      if (!recaptchaReady || !window.grecaptcha) {
        setStatus({ type: "error", message: "Security verification is not ready. Please try again." });
        return;
      }

      try {
        recaptchaToken = await window.grecaptcha.execute(recaptchaSiteKey, {
          action: "contact_form_submit"
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to verify reCAPTCHA.";
        setStatus({ type: "error", message });
        toast({
          title: "Verification failed",
          description: message,
          variant: "error"
        });
        return;
      }
    }

    const normalizedCompany = values.company?.trim() ? values.company.trim() : undefined;
    const normalizedBudget: ContactFormValues["budget"] =
      values.budget && values.budget.length > 0 ? values.budget : undefined;

    const payload: ContactFormValues = {
      ...values,
      company: normalizedCompany,
      budget: normalizedBudget,
      recaptchaToken
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data: { error?: string; message?: string } = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMessage = data.error ?? "We could not send your message. Please try again.";
        throw new Error(errorMessage);
      }

      reset({
        name: "",
        email: "",
        company: "",
        budget: "",
        message: "",
        honeypot: ""
      });

      const successMessage = data.message ?? "Thanks for reaching out. We will be in touch soon.";
      setStatus({ type: "success", message: successMessage });
      toast({
        title: "Message sent",
        description: successMessage,
        variant: "success"
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      setStatus({ type: "error", message });
      toast({
        title: "Message not sent",
        description: message,
        variant: "error"
      });
    }
  });

  const statusMessage = useMemo(() => {
    if (status.type === "success") {
      return (
        <div className="status-message status-message--success" role="status" aria-live="polite">
          {status.message}
        </div>
      );
    }

    if (status.type === "error") {
      return (
        <div className="status-message status-message--error" role="alert" aria-live="assertive">
          {status.message}
        </div>
      );
    }

    return null;
  }, [status]);

  const submitDisabled = isSubmitting || (shouldUseRecaptcha && (!recaptchaReady || !!recaptchaError));

  return (
    <form method="post" onSubmit={submitContactForm} aria-describedby={recaptchaError ? "recaptcha-error" : undefined} noValidate>
      <div className="form-field">
        <label htmlFor="name">Full name *</label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Jane Doe"
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? "name-error" : undefined}
          {...register("name")}
        />
        {errors.name ? (
          <p id="name-error" className="form-field__error">
            {errors.name.message}
          </p>
        ) : (
          <p className="form-field__hint">Tell us who we&apos;ll be speaking with.</p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="email">Email address *</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="jane@example.com"
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        {errors.email ? (
          <p id="email-error" className="form-field__error">
            {errors.email.message}
          </p>
        ) : (
          <p className="form-field__hint">We&apos;ll reach out to this email.</p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          type="text"
          autoComplete="organization"
          placeholder="Acme Inc."
          aria-invalid={errors.company ? "true" : "false"}
          aria-describedby={errors.company ? "company-error" : undefined}
          {...register("company")}
        />
        {errors.company ? (
          <p id="company-error" className="form-field__error">
            {errors.company.message}
          </p>
        ) : (
          <p className="form-field__hint">Optional, but helpful for context.</p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="budget">Estimated budget</label>
        <select
          id="budget"
          aria-invalid={errors.budget ? "true" : "false"}
          aria-describedby={errors.budget ? "budget-error" : undefined}
          defaultValue=""
          {...register("budget")}
        >
          <option value="">Select an option</option>
          {budgetOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.budget ? (
          <p id="budget-error" className="form-field__error">
            {errors.budget.message}
          </p>
        ) : (
          <p className="form-field__hint">Optional; helps us tailor our response.</p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="message">How can we help? *</label>
        <textarea
          id="message"
          aria-invalid={errors.message ? "true" : "false"}
          aria-describedby={errors.message ? "message-error" : "message-hint"}
          placeholder="Share a few sentences about your project goals, timeline, and success criteria."
          {...register("message")}
        />
        {errors.message ? (
          <p id="message-error" className="form-field__error">
            {errors.message.message}
          </p>
        ) : (
          <p id="message-hint" className="form-field__hint">
            The more detail you provide, the easier it is for us to help.
          </p>
        )}
      </div>

      <div className="form-field honeypot" aria-hidden="true">
        <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
        <input id={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" {...register("honeypot")} />
      </div>

      {statusMessage}

      {recaptchaError ? (
        <div id="recaptcha-error" className="form-field__error" role="alert" aria-live="assertive">
          {recaptchaError}
        </div>
      ) : null}

      <button type="submit" className="button" disabled={submitDisabled}>
        {isSubmitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
