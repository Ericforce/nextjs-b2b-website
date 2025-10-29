import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get("slug") || "/";
  const secret = searchParams.get("secret");

  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response("Invalid token", { status: 401 });
  }

  draftMode().enable();

  redirect(slug);
}
