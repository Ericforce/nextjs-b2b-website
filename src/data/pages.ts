import type { PageDocument } from "@/types";

export const pages: PageDocument[] = [
  {
    _type: "page",
    slug: "about",
    title: "About Next.js B2B",
    description:
      "Learn about the mission and values that drive the Next.js B2B Application forward.",
    body: `## Our Mission
We help modern enterprises unlock the full potential of their teams with collaborative tools and data-driven insights.

## Our Values
- Customer obsession
- Craftsmanship
- Continuous improvement
- Transparency`,
    createdAt: "2024-08-01T09:15:00.000Z",
    updatedAt: "2024-10-02T10:00:00.000Z",
    seo: {
      title: "About Our B2B Platform",
      description:
        "Discover the mission, vision, and team behind the Next.js B2B Application.",
      canonical: "/about",
      keywords: ["Next.js", "About", "B2B Platform"],
      ogTitle: "About the Next.js B2B Platform",
      ogDescription:
        "A closer look at the team, mission, and journey behind our B2B platform.",
      ogImage: {
        url: "/og?title=About%20Next.js%20B2B&subtitle=A%20platform%20built%20for%20teams",
        width: 1200,
        height: 630,
        alt: "Team collaborating in an office",
      },
    },
  },
  {
    _type: "page",
    slug: "solutions",
    title: "Solutions",
    description:
      "Explore the industry-specific solutions powered by the Next.js B2B Application.",
    body: `## Industry Solutions
From SaaS to enterprise services, our platform adapts to your workflows.

## Highlights
- Role-based dashboards
- Enterprise analytics
- Secure collaboration`,
    createdAt: "2024-07-12T12:30:00.000Z",
    updatedAt: "2024-10-10T08:45:00.000Z",
    seo: {
      title: "Solutions for Growing Enterprises",
      description:
        "Industry-specific solutions leveraging the Next.js B2B Application to drive growth.",
      canonical: "/solutions",
      keywords: ["Enterprise Solutions", "B2B", "Next.js"],
      ogImage: {
        url: "/og?title=Enterprise%20Solutions&subtitle=Tailored%20for%20modern%20teams",
        width: 1200,
        height: 630,
        alt: "Screens illustrating analytics dashboards",
      },
    },
  },
  {
    _type: "page",
    slug: "contact",
    title: "Contact",
    description:
      "Get in touch with the Next.js B2B team to schedule a demo or request support.",
    body: `## Contact Us
We'd love to hear from you. Reach out for demos, partnerships, or customer support.

- Email: hello@nextjsb2b.com
- Phone: (415) 555-0123`,
    createdAt: "2024-09-05T14:50:00.000Z",
    updatedAt: "2024-10-05T14:50:00.000Z",
    seo: {
      title: "Contact Next.js B2B",
      description:
        "Connect with the Next.js B2B team for sales inquiries, demos, or customer support.",
      canonical: "/contact",
      keywords: ["Contact", "Support", "Demo"],
      ogImage: {
        url: "/og?title=Contact%20Next.js%20B2B&subtitle=Let's%20build%20together",
        width: 1200,
        height: 630,
        alt: "Customer success team ready to help",
      },
    },
  },
];
