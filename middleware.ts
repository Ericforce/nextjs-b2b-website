import { NextRequest, NextResponse } from "next/server";

const RATE_LIMIT_MAX = Number(process.env.CONTACT_RATE_LIMIT_MAX ?? "5");
const RATE_LIMIT_WINDOW_MS = Number(process.env.CONTACT_RATE_LIMIT_WINDOW_MS ?? "60000");

type RateRecord = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateRecord>();

function getClientIdentifier(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const [first] = forwardedFor.split(",");
    if (first) {
      return first.trim();
    }
  }

  return request.ip ?? "anonymous";
}

export function middleware(request: NextRequest) {
  if (request.method !== "POST") {
    return NextResponse.next();
  }

  const identifier = getClientIdentifier(request);
  const now = Date.now();

  for (const [key, record] of rateLimitStore) {
    if (record.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }

  const existing = rateLimitStore.get(identifier);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS
    });
    return NextResponse.next();
  }

  if (existing.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));

    return new NextResponse(JSON.stringify({ error: "Too many contact requests. Please try again soon." }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": retryAfter.toString()
      }
    });
  }

  existing.count += 1;
  rateLimitStore.set(identifier, existing);

  return NextResponse.next();
}

export const config = {
  matcher: "/api/contact"
};
