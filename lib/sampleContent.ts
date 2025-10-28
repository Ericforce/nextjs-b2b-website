import type { Page } from '@/types/sanity';

const heroImageUrl =
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80';

const SAMPLE_HOME_PAGE: Page = {
  _id: 'sample-home-page',
  _type: 'page',
  title: 'Acme SaaS Platform',
  slug: { current: '/' },
  description: 'Modern SaaS platform template',
  sections: [
    {
      _type: 'hero',
      _key: 'hero-1',
      heading: 'Build products customers love',
      subheading:
        'Launch faster with a modern, composable marketing website integrated with Sanity and Next.js.',
      cta: {
        label: 'Start your trial',
        href: '#get-started',
      },
      secondaryCta: {
        label: 'View pricing',
        href: '/pricing',
      },
      image: {
        asset: {
          _id: 'image-hero',
          url: heroImageUrl,
          metadata: {
            dimensions: {
              width: 1200,
              height: 1600,
            },
          },
        },
        alt: 'People collaborating in a modern office',
      },
    },
    {
      _type: 'features',
      _key: 'features-1',
      eyebrow: 'Platform Overview',
      heading: 'Everything you need to scale your product',
      subheading:
        'Modular sections that can be re-arranged in Sanity to compose pages without touching code.',
      layout: 'grid',
      items: [
        {
          _key: 'feature-1',
          title: 'Reusable Sections',
          description: 'Pre-built sections for hero, features, testimonials, FAQ and more.',
          icon: '✨',
        },
        {
          _key: 'feature-2',
          title: 'Fast Performance',
          description: 'Next.js static generation with ISR ensures lightning fast page loads.',
          icon: '⚡️',
        },
        {
          _key: 'feature-3',
          title: 'Portable Content',
          description: 'GROQ queries fetch structured content directly from Sanity.',
          icon: '🗂️',
        },
      ],
    },
    {
      _type: 'stats',
      _key: 'stats-1',
      eyebrow: 'By the numbers',
      heading: 'Deliver results with confidence',
      items: [
        {
          _key: 'stat-1',
          stat: 'Sites launched',
          value: '250+',
          description: 'Teams scaling with composable content. ',
        },
        {
          _key: 'stat-2',
          stat: 'Avg. lift in conversions',
          value: '32%',
        },
        {
          _key: 'stat-3',
          stat: 'Time to publish',
          value: '2x faster',
        },
        {
          _key: 'stat-4',
          stat: 'Support satisfaction',
          value: '98%',
        },
      ],
    },
    {
      _type: 'richText',
      _key: 'richtext-1',
      content: [
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Craft pages in minutes',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Marketing teams can assemble custom landing pages from a library of sections while developers focus on shipping product.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Content updates go live instantly thanks to incremental static regeneration.',
            },
          ],
        },
      ],
    },
    {
      _type: 'testimonials',
      _key: 'testimonials-1',
      eyebrow: 'Customer stories',
      heading: 'Loved by product and marketing teams alike',
      testimonials: [
        {
          _key: 'testimonial-1',
          quote: 'We went from concept to launch in record time with this starter.',
          name: 'Jamie Fox',
          title: 'Head of Marketing, Foundry',
        },
        {
          _key: 'testimonial-2',
          quote: 'Structured content means we can experiment without developer support.',
          name: 'Avi Patel',
          title: 'Product Manager, Basecamp Labs',
        },
        {
          _key: 'testimonial-3',
          quote: 'Fast, flexible, and delightful to work with every day.',
          name: 'Sasha Lee',
          title: 'Design Lead, Framework',
        },
      ],
    },
    {
      _type: 'faq',
      _key: 'faq-1',
      eyebrow: 'FAQ',
      heading: 'Answers to common questions',
      faqs: [
        {
          _key: 'faq-item-1',
          question: 'Can I connect to my existing Sanity dataset?',
          answer: 'Yes. Update the environment variables with your Sanity project credentials and redeploy.',
        },
        {
          _key: 'faq-item-2',
          question: 'Does this support incremental static regeneration?',
          answer: 'Absolutely. Pages are statically generated with revalidation for fresh content.',
        },
        {
          _key: 'faq-item-3',
          question: 'How do I add more sections?',
          answer: 'Add a new section schema in Sanity and map it to a React component in the section renderer.',
        },
      ],
    },
    {
      _type: 'cta',
      _key: 'cta-1',
      heading: 'Ready to launch your next marketing site?',
      subheading: 'Start with the sample content, connect your Sanity dataset, and ship pages faster.',
      cta: {
        label: 'Get started',
        href: '#get-started',
      },
      secondaryCta: {
        label: 'Talk to sales',
        href: '/contact',
      },
    },
  ],
};

const SAMPLE_ABOUT_PAGE: Page = {
  _id: 'sample-about-page',
  _type: 'page',
  title: 'About Acme',
  slug: { current: 'about' },
  sections: [
    {
      _type: 'hero',
      _key: 'about-hero',
      heading: 'We build tools that help teams move faster',
      subheading: 'Our remote-first team spans four continents and shares a passion for great products.',
      cta: {
        label: 'Meet the team',
        href: '#team',
      },
    },
    {
      _type: 'richText',
      _key: 'about-story',
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Acme helps teams launch high-performing marketing sites quickly by combining structured content with modern frameworks.',
            },
          ],
        },
      ],
    },
  ],
};

const SAMPLE_PAGES: Record<string, Page> = {
  '': SAMPLE_HOME_PAGE,
  '/': SAMPLE_HOME_PAGE,
  home: SAMPLE_HOME_PAGE,
  about: SAMPLE_ABOUT_PAGE,
};

export function getSamplePage(slug: string[]): Page | null {
  const joined = slug.length ? slug.join('/') : '';
  return SAMPLE_PAGES[joined] ?? null;
}

export function getSampleSlugs(): string[][] {
  return [[], ['about']];
}
