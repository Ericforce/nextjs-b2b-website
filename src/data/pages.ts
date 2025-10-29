import type { PageDocument } from "@/types";
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
  ...block(key, text, "normal"),
  listItem: "bullet",
});

const aboutRichText: PortableTextBlock[] = [
  block("about-mission", "Our Mission", "h2"),
  block(
    "about-mission-body",
    "We help modern enterprises unlock the full potential of their teams with collaborative tools and data-driven insights."
  ),
  block("about-values", "Our Values", "h2"),
  bullet("about-value-1", "Customer obsession"),
  bullet("about-value-2", "Craftsmanship"),
  bullet("about-value-3", "Continuous improvement"),
  bullet("about-value-4", "Transparency"),
];

const solutionsFeatures = [
  {
    _type: "feature",
    title: "Role-based dashboards",
    description: "Give every go-to-market team the context they need to move faster.",
    icon: "chart-bar",
  },
  {
    _type: "feature",
    title: "Enterprise analytics",
    description: "Track revenue performance across the entire customer lifecycle.",
    icon: "sparkline",
  },
  {
    _type: "feature",
    title: "Secure collaboration",
    description: "Keep work moving securely with stakeholder reviews and automated workflows.",
    icon: "shield-check",
  },
];

const contactFormFields = [
  {
    _type: "formField",
    name: "name",
    label: "Full name",
    type: "text",
    required: true,
    placeholder: "Jane Smith",
  },
  {
    _type: "formField",
    name: "email",
    label: "Work email",
    type: "email",
    required: true,
    placeholder: "you@company.com",
  },
  {
    _type: "formField",
    name: "company",
    label: "Company",
    type: "company",
    required: true,
  },
  {
    _type: "formField",
    name: "message",
    label: "How can we help?",
    type: "textarea",
    required: true,
  },
];

export const pages: PageDocument[] = [
  {
    _type: "page",
    slug: { _type: "slug", current: "about" },
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
    sections: [
      {
        _type: "heroSection",
        variant: "simple",
        kicker: "Company",
        heading: "About Next.js B2B",
        subheading:
          "Meet the team behind the platform and learn what drives our product decisions.",
        primaryCta: {
          _type: "link",
          label: "Contact us",
          linkType: "external",
          url: "/contact",
          style: "primary",
        },
      },
      {
        _type: "richTextSection",
        title: "Our story",
        layout: "narrow",
        content: aboutRichText,
      },
    ],
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
        _type: "image",
        url: "/og?title=About%20Next.js%20B2B&subtitle=A%20platform%20built%20for%20teams",
        width: 1200,
        height: 630,
        alt: "Team collaborating in an office",
      },
    },
  },
  {
    _type: "page",
    slug: { _type: "slug", current: "solutions" },
    title: "Solutions",
    description:
      "Explore the industry-specific solutions powered by the Next.js B2B Application.",
    body: `## Industry Solutions
From SaaS to enterprise services, our platform adapts to your workflows.

## Highlights
- Role-based dashboards
- Enterprise analytics
- Secure collaboration`,
    sections: [
      {
        _type: "heroSection",
        variant: "split",
        kicker: "Solutions",
        heading: "Solutions made for revenue teams",
        subheading:
          "Bring marketing, sales, and customer success together on a single integrated platform.",
        primaryCta: {
          _type: "link",
          label: "View pricing",
          linkType: "external",
          url: "/pricing",
          style: "primary",
        },
        secondaryCta: {
          _type: "link",
          label: "Talk to sales",
          linkType: "external",
          url: "/contact",
          style: "secondary",
        },
      },
      {
        _type: "featureGridSection",
        kicker: "Highlights",
        title: "Purpose-built for modern GTM teams",
        intro: "The Next.js B2B Application adapts to your operating model with configurable workflows and analytics.",
        columns: 3,
        features: solutionsFeatures,
      },
      {
        _type: "statsSection",
        title: "Outcomes our customers report",
        intro: "Teams unlock measurable improvements across the customer lifecycle.",
        stats: [
          {
            _type: "stat",
            label: "Faster sales cycles",
            value: "32%",
            description: "Average reduction in deal velocity after implementation.",
          },
          {
            _type: "stat",
            label: "Pipeline coverage",
            value: "4.5x",
            description: "More predictable revenue through accurate forecasting.",
          },
          {
            _type: "stat",
            label: "Team efficiency",
            value: "+48%",
            description: "Fewer manual handoffs across marketing and sales teams.",
          },
        ],
      },
    ],
    createdAt: "2024-07-12T12:30:00.000Z",
    updatedAt: "2024-10-10T08:45:00.000Z",
    seo: {
      title: "Solutions for Growing Enterprises",
      description:
        "Industry-specific solutions leveraging the Next.js B2B Application to drive growth.",
      canonical: "/solutions",
      keywords: ["Enterprise Solutions", "B2B", "Next.js"],
      ogImage: {
        _type: "image",
        url: "/og?title=Enterprise%20Solutions&subtitle=Tailored%20for%20modern%20teams",
        width: 1200,
        height: 630,
        alt: "Screens illustrating analytics dashboards",
      },
    },
  },
  {
    _type: "page",
    slug: { _type: "slug", current: "contact" },
    title: "Contact",
    description:
      "Get in touch with the Next.js B2B team to schedule a demo or request support.",
    body: `## Contact Us
We'd love to hear from you. Reach out for demos, partnerships, or customer support.

- Email: hello@nextjsb2b.com
- Phone: (415) 555-0123`,
    sections: [
      {
        _type: "heroSection",
        variant: "centered",
        heading: "Let’s build together",
        subheading:
          "Reach out to our team for demos, partnerships, or customer support.",
        primaryCta: {
          _type: "link",
          label: "Schedule a demo",
          linkType: "external",
          url: "/contact",
          style: "primary",
        },
      },
      {
        _type: "contactFormSection",
        title: "Tell us about your team",
        intro: [
          block(
            "contact-intro",
            "Share a few details and we'll connect you with the right product specialist."
          ),
        ],
        submitLabel: "Request demo",
        successMessage: "Thanks! We'll be in touch shortly.",
        fields: contactFormFields,
      },
      {
        _type: "faqSection",
        title: "Frequently asked",
        intro: "Quick answers to the most common questions we receive.",
        faqs: [
          {
            _type: "faq",
            question: "How quickly can we get started?",
            answer: [
              block(
                "contact-faq-1",
                "Most teams launch in under four weeks with guided onboarding from our solutions engineers."
              ),
            ],
          },
          {
            _type: "faq",
            question: "Do you support custom integrations?",
            answer: [
              block(
                "contact-faq-2",
                "Yes. Our platform provides a GraphQL API, webhooks, and pre-built connectors for popular CRMs."
              ),
            ],
          },
        ],
      },
    ],
    createdAt: "2024-09-05T14:50:00.000Z",
    updatedAt: "2024-10-05T14:50:00.000Z",
    seo: {
      title: "Contact Next.js B2B",
      description:
        "Connect with the Next.js B2B team for sales inquiries, demos, or customer support.",
      canonical: "/contact",
      keywords: ["Contact", "Support", "Demo"],
      ogImage: {
        _type: "image",
        url: "/og?title=Contact%20Next.js%20B2B&subtitle=Let's%20build%20together",
        width: 1200,
        height: 630,
        alt: "Customer success team ready to help",
      },
    },
  },
];
