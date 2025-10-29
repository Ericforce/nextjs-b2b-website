import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/env";

const HOME_SLUG = "home";

function resolveRedirectPath(rawSlug?: string | null): string {
  if (!rawSlug || rawSlug === "/") {
    return "/";
  }

  const trimmed = rawSlug.replace(/^\/+/, "").replace(/\/+$/, "");

  if (!trimmed || trimmed === HOME_SLUG) {
    return "/";
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");
  const slugParam = url.searchParams.get("slug") ?? url.searchParams.get("path");

  if (!env.sanity.previewSecret) {
    return NextResponse.json(
      { message: "Preview mode is not configured." },
      { status: 401 }
    );
  }

  if (secret !== env.sanity.previewSecret) {
    return NextResponse.json({ message: "Invalid preview token." }, { status: 401 });
  }

  const redirectPath = resolveRedirectPath(slugParam);

  draftMode().enable();

  return NextResponse.redirect(new URL(redirectPath, url.origin));
}
