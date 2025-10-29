import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import {
  buildHomePageJsonLd,
  generatePageMetadata,
  getMetadataDefaults,
  jsonLdScriptProps,
} from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { siteSettings } = await getMetadataDefaults();
  return generatePageMetadata({
    title: siteSettings.defaultSeo.title ?? siteSettings.siteName,
    description:
      siteSettings.defaultSeo.description ?? siteSettings.description,
    canonicalPath: "/",
    type: "website",
  });
}

export default async function Home() {
  const { siteSettings } = await getMetadataDefaults();
  const jsonLd = buildHomePageJsonLd(siteSettings);

  return (
    <>
      <Script {...jsonLdScriptProps("homepage-jsonld", jsonLd)} />
      <div className="flex flex-col">
        <section className="bg-gradient-to-b from-primary-50 to-white py-20 lg:py-32">
          <div className="container-custom">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-5xl font-bold tracking-tight text-secondary-900 sm:text-6xl">
                Modern B2B Solutions for Growing Businesses
              </h1>
              <p className="mt-6 text-lg leading-8 text-secondary-600">
                Streamline your operations, enhance collaboration, and drive
                growth with our comprehensive suite of business tools designed
                for modern enterprises.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="/signup" className="btn-primary text-base">
                  Get started for free
                </Link>
                <Link href="/demo" className="btn-outline text-base">
                  Request demo
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="container-custom">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-secondary-900 sm:text-4xl">
                Everything you need to succeed
              </h2>
              <p className="mt-4 text-lg text-secondary-600">
                Powerful features designed to help your business thrive in the
                modern marketplace.
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="card">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                    <div className="h-6 w-6 rounded bg-primary-600"></div>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-secondary-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-secondary-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-secondary-900 py-16 lg:py-24">
          <div className="container-custom">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to get started?
              </h2>
              <p className="mt-4 text-lg text-secondary-300">
                Join thousands of businesses already using our platform to
                streamline their operations.
              </p>
              <div className="mt-8">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3 text-base font-medium text-secondary-900 shadow-sm hover:bg-neutral-50 transition-colors"
                >
                  Start your free trial
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

const features = [
  {
    title: "Advanced Analytics",
    description:
      "Get deep insights into your business with powerful analytics and reporting tools.",
  },
  {
    title: "Team Collaboration",
    description:
      "Work seamlessly with your team using our integrated collaboration features.",
  },
  {
    title: "Security First",
    description:
      "Enterprise-grade security to keep your data safe and compliant.",
  },
  {
    title: "API Access",
    description:
      "Integrate with your existing tools using our comprehensive REST API.",
  },
  {
    title: "24/7 Support",
    description:
      "Get help whenever you need it from our dedicated support team.",
  },
  {
    title: "Scalable Infrastructure",
    description:
      "Grow your business without worrying about performance or reliability.",
  },
];
