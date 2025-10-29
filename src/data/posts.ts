import type { BlogPostDocument } from "@/types";

export const posts: BlogPostDocument[] = [
  {
    _type: "post",
    slug: "announcing-analytics-suite",
    title: "Announcing the Next.js B2B Analytics Suite",
    excerpt:
      "We're introducing a powerful analytics suite built on top of the Next.js B2B Application.",
    body: `## A new era of analytics
Our analytics suite ships with pre-built dashboards, forecasting, and team performance metrics.

### What's included
- Executive dashboards
- Predictive forecasting
- Team collaboration insights

### Getting started
All enterprise customers can access the analytics suite starting today.`,
    tags: ["Product", "Analytics"],
    readingTime: "6 min read",
    featuredImage: {
      url: "/og?title=Analytics%20Suite&subtitle=Data-driven%20growth",
      width: 1200,
      height: 630,
      alt: "Charts and analytics visuals",
    },
    createdAt: "2024-09-01T08:00:00.000Z",
    publishedAt: "2024-09-10T08:00:00.000Z",
    updatedAt: "2024-09-12T12:00:00.000Z",
    author: {
      name: "Jane Doe",
      url: "https://www.linkedin.com/in/jane-doe",
    },
    seo: {
      title: "Introducing our Next.js B2B Analytics Suite",
      description:
        "Explore the new analytics suite that helps revenue teams make faster, data-driven decisions.",
      canonical: "/blog/announcing-analytics-suite",
      keywords: ["Analytics", "Next.js", "B2B"],
      ogTitle: "Next.js B2B Analytics Suite",
      ogDescription:
        "Forecast, report, and collaborate with the new analytics suite for B2B teams.",
      ogImage: {
        url: "/og?title=Analytics%20Suite&subtitle=Data-driven%20growth",
        width: 1200,
        height: 630,
        alt: "Charts and analytics visuals",
      },
    },
  },
  {
    _type: "post",
    slug: "scaling-with-automation",
    title: "How Automation Helps Revenue Teams Scale",
    excerpt:
      "Automation helps revenue teams focus on relationships instead of repetitive tasks.",
    body: `## Automation unlocks growth
Learn how top-performing teams use automation to drive predictable revenue.

### Key benefits
- Lead prioritization
- Automated follow-ups
- Intelligent insights

### Customer spotlight
Acme Corp increased pipeline velocity by 32% using our automation workflows.`,
    tags: ["Automation", "Revenue"],
    readingTime: "5 min read",
    featuredImage: {
      url: "/og?title=Automation%20at%20Scale&subtitle=Workflows%20that%20close%20deals",
      width: 1200,
      height: 630,
      alt: "Automation workflow illustration",
    },
    createdAt: "2024-08-18T11:30:00.000Z",
    publishedAt: "2024-08-24T11:30:00.000Z",
    updatedAt: "2024-09-01T09:45:00.000Z",
    author: {
      name: "Jordan Lee",
      url: "https://www.linkedin.com/in/jordan-lee",
    },
    seo: {
      title: "Automation Strategies for Revenue Teams",
      description:
        "Discover automation strategies that help revenue teams close deals faster and smarter.",
      canonical: "/blog/scaling-with-automation",
      keywords: ["Automation", "Revenue Teams", "Workflow"],
      ogTitle: "Automation Playbooks for Revenue Teams",
      ogDescription:
        "Implement automation playbooks that accelerate revenue operations.",
      ogImage: {
        url: "/og?title=Automation%20at%20Scale&subtitle=Workflows%20that%20close%20deals",
        width: 1200,
        height: 630,
        alt: "Automation workflow illustration",
      },
    },
  },
];
