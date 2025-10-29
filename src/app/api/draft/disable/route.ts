import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  draftMode().disable();

  const redirectTo = request.nextUrl.searchParams.get("redirect") || "/";

  redirect(redirectTo);
}
