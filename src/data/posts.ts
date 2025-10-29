import type { BlogPostDocument } from "@/types";
import type { PortableTextBlock } from "sanity";

const block = (
  key: string,
  text: string,
  style: PortableTextBlock["style"] = "normal"
): PortableTextBlock => ({
  _type: "block",
  _key: key,
  style,
  markDefs: [],
  children: [
    {
      _type: "span",
      _key: `${key}-span`,
      text,
      marks: [],
    },
  ],
});

const bullet = (key: string, text: string): PortableTextBlock => ({
  ...block(key, text),
  listItem: "bullet",
});

const janeDoeAuthor = {
  _type: "author" as const,
  name: "Jane Doe",
  slug: { _type: "slug" as const, current: "jane-doe" },
  role: "Director of Product Marketing",
  website: "https://www.linkedin.com/in/jane-doe",
};

const jordanLeeAuthor = {
  _type: "author" as const,
  name: "Jordan Lee",
  slug: { _type: "slug" as const, current: "jordan-lee" },
  role: "Revenue Operations Lead",
  website: "https://www.linkedin.com/in/jordan-lee",
};

const analyticsBody: PortableTextBlock[] = [
  block("analytics-heading-1", "A new era of analytics", "h2"),
  block(
    "analytics-body-1",
    "Our analytics suite ships with pre-built dashboards, forecasting, and team performance metrics."
  ),
  block("analytics-heading-2", "What's included", "h3"),
  bullet("analytics-item-1", "Executive dashboards"),
  bullet("analytics-item-2", "Predictive forecasting"),
  bullet("analytics-item-3", "Team collaboration insights"),
  block("analytics-heading-3", "Getting started", "h3"),
  block(
    "analytics-body-2",
    "All enterprise customers can access the analytics suite starting today."
  ),
];

const automationBody: PortableTextBlock[] = [
  block("automation-heading-1", "Automation unlocks growth", "h2"),
  block(
    "automation-body-1",
    "Learn how top-performing teams use automation to drive predictable revenue."
  ),
  block("automation-heading-2", "Key benefits", "h3"),
  bullet("automation-item-1", "Lead prioritization"),
  bullet("automation-item-2", "Automated follow-ups"),
  bullet("automation-item-3", "Intelligent insights"),
  block("automation-heading-3", "Customer spotlight", "h3"),
  block(
    "automation-body-2",
    "Acme Corp increased pipeline velocity by 32% using our automation workflows."
  ),
];

export const posts: BlogPostDocument[] = [
  {
    _type: "blogPost",
    slug: { _type: "slug", current: "announcing-analytics-suite" },
    title: "Announcing the Next.js B2B Analytics Suite",
    excerpt:
      "We're introducing a powerful analytics suite built on top of the Next.js B2B Application.",
    heroImage: {
      _type: "image",
      url: "/og?title=Analytics%20Suite&subtitle=Data-driven%20growth",
      width: 1200,
      height: 630,
      alt: "Charts and analytics visuals",
    },
    body: analyticsBody,
    readingTime: 6,
    tags: [
      {
        _type: "tag",
        title: "Product",
        slug: { _type: "slug", current: "product" },
      },
      {
        _type: "tag",
        title: "Analytics",
        slug: { _type: "slug", current: "analytics" },
      },
    ],
    categories: [
      {
        _type: "category",
        title: "Product Updates",
        slug: { _type: "slug", current: "product-updates" },
      },
    ],
    createdAt: "2024-09-01T08:00:00.000Z",
    publishedAt: "2024-09-10T08:00:00.000Z",
    updatedAt: "2024-09-12T12:00:00.000Z",
    author: janeDoeAuthor,
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
        _type: "image",
        url: "/og?title=Analytics%20Suite&subtitle=Data-driven%20growth",
        width: 1200,
        height: 630,
        alt: "Charts and analytics visuals",
      },
    },
  },
  {
    _type: "blogPost",
    slug: { _type: "slug", current: "scaling-with-automation" },
    title: "How Automation Helps Revenue Teams Scale",
    excerpt:
      "Automation helps revenue teams focus on relationships instead of repetitive tasks.",
    heroImage: {
      _type: "image",
      url: "/og?title=Automation%20at%20Scale&subtitle=Workflows%20that%20close%20deals",
      width: 1200,
      height: 630,
      alt: "Automation workflow illustration",
    },
    body: automationBody,
    readingTime: 5,
    tags: [
      {
        _type: "tag",
        title: "Automation",
        slug: { _type: "slug", current: "automation" },
      },
      {
        _type: "tag",
        title: "Revenue",
        slug: { _type: "slug", current: "revenue" },
      },
    ],
    categories: [
      {
        _type: "category",
        title: "Revenue Operations",
        slug: { _type: "slug", current: "revenue-operations" },
      },
    ],
    createdAt: "2024-08-18T11:30:00.000Z",
    publishedAt: "2024-08-24T11:30:00.000Z",
    updatedAt: "2024-09-01T09:45:00.000Z",
    author: jordanLeeAuthor,
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
        _type: "image",
        url: "/og?title=Automation%20at%20Scale&subtitle=Workflows%20that%20close%20deals",
        width: 1200,
        height: 630,
        alt: "Automation workflow illustration",
      },
    },
  },
];
