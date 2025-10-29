import type { ReactNode } from "react";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { getSiteSettings } from "@/lib/sanity";

export default async function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const siteSettings = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        siteName={siteSettings.siteName}
        logo={siteSettings.logo}
        navigation={siteSettings.navigation.main}
        secondaryNavigation={siteSettings.navigation.secondary}
        headerCta={siteSettings.headerCta ?? undefined}
      />
      <main className="flex-1">{children}</main>
      <Footer
        siteName={siteSettings.siteName}
        description={siteSettings.description}
        logo={siteSettings.logo}
        footerSections={siteSettings.footerSections}
        social={siteSettings.social}
        copyrightText={siteSettings.copyrightText}
      />
    </div>
  );
}
