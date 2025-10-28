const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

type RecaptchaApiResponse = {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
};

export interface RecaptchaVerificationResult {
  success: boolean;
  score?: number;
  action?: string;
  errors?: string[];
}

export function isRecaptchaEnabled() {
  return process.env.CONTACT_RECAPTCHA_ENABLED === "true";
}

export async function verifyRecaptchaToken(
  token: string,
  remoteIp?: string | null
): Promise<RecaptchaVerificationResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    console.warn("[recaptcha] Missing RECAPTCHA_SECRET_KEY. Failing verification.");
    return {
      success: false,
      errors: ["missing-secret"]
    };
  }

  const params = new URLSearchParams();
  params.append("secret", secret);
  params.append("response", token);
  if (remoteIp) {
    params.append("remoteip", remoteIp);
  }

  try {
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[recaptcha] Verification failed", response.status, text);
      return {
        success: false,
        errors: ["verification-request-failed"]
      };
    }

    const payload = (await response.json()) as RecaptchaApiResponse;

    return {
      success: payload.success,
      score: payload.score,
      action: payload.action,
      errors: payload["error-codes"]
    };
  } catch (error) {
    console.error("[recaptcha] Verification threw", error);
    return {
      success: false,
      errors: ["verification-exception"]
    };
  }
}
