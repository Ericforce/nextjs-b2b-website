import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const redirectParam = url.searchParams.get("redirect") ?? "/";
  const redirectPath = redirectParam.startsWith("/")
    ? redirectParam
    : `/${redirectParam.replace(/^\/+/, "")}`;

  draftMode().disable();

  return NextResponse.redirect(new URL(redirectPath, url.origin));
}
