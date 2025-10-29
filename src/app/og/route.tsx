import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

import { getMetadataDefaults } from "@/lib/seo";

export const runtime = "edge";

const themes = {
  light: {
    background: "linear-gradient(135deg, #312e81, #1d4ed8)",
    foreground: "#f8fafc",
    accent: "rgba(255,255,255,0.2)",
  },
  dark: {
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    foreground: "#e2e8f0",
    accent: "rgba(226,232,240,0.12)",
  },
} as const;

export async function GET(request: NextRequest) {
  const { siteSettings } = await getMetadataDefaults();
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const title = searchParams.get("title") ?? siteSettings.siteName;
  const subtitle =
    searchParams.get("subtitle") ??
    siteSettings.defaultSeo.description ??
    siteSettings.description;
  const theme = (searchParams.get("theme") ?? "light") as keyof typeof themes;
  const selectedTheme = themes[theme] ?? themes.light;

  const element = (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "96px",
        color: selectedTheme.foreground,
        backgroundImage: selectedTheme.background,
        fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          maxWidth: 920,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            padding: "6px 16px",
            borderRadius: 9999,
            backgroundColor: selectedTheme.accent,
            fontSize: 24,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {siteSettings.siteName}
        </span>
        <h1
          style={{
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          {title.length > 120 ? `${title.slice(0, 117)}...` : title}
        </h1>
        {subtitle ? (
          <p
            style={{
              margin: 0,
              fontSize: 32,
              fontWeight: 400,
              opacity: 0.85,
              lineHeight: 1.3,
            }}
          >
            {subtitle.length > 160 ? `${subtitle.slice(0, 157)}...` : subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );

  return new ImageResponse(element, {
    width: 1200,
    height: 630,
  });
}
