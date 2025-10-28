import { PortableTextBlock } from '@portabletext/types';

export interface SanityImage {
  asset: {
    _id: string;
    url: string;
    metadata?: {
      dimensions?: {
        width: number;
        height: number;
      };
      lqip?: string;
    };
  };
  alt?: string;
}

export interface CTA {
  label: string;
  href: string;
}

export interface FeatureItem {
  _key: string;
  title: string;
  description: string;
  icon?: string;
}

export interface StatItem {
  _key: string;
  stat: string;
  value: string;
  description?: string;
}

export interface TestimonialItem {
  _key: string;
  quote: string;
  name: string;
  title: string;
  avatar?: SanityImage;
}

export interface FAQItem {
  _key: string;
  question: string;
  answer: string;
}

export interface HeroSection {
  _type: 'hero';
  _key: string;
  heading: string;
  subheading?: string;
  cta?: CTA;
  secondaryCta?: CTA;
  image?: SanityImage;
}

export interface FeaturesSection {
  _type: 'features';
  _key: string;
  eyebrow?: string;
  heading: string;
  subheading?: string;
  layout?: 'grid' | 'list';
  items: FeatureItem[];
}

export interface TestimonialsSection {
  _type: 'testimonials';
  _key: string;
  eyebrow?: string;
  heading: string;
  testimonials: TestimonialItem[];
}

export interface CTASection {
  _type: 'cta';
  _key: string;
  heading: string;
  subheading?: string;
  cta?: CTA;
  secondaryCta?: CTA;
}

export interface RichTextSection {
  _type: 'richText';
  _key: string;
  content: PortableTextBlock[];
}

export interface StatsSection {
  _type: 'stats';
  _key: string;
  eyebrow?: string;
  heading?: string;
  items: StatItem[];
}

export interface FAQSection {
  _type: 'faq';
  _key: string;
  eyebrow?: string;
  heading: string;
  faqs: FAQItem[];
}

export type Section =
  | HeroSection
  | FeaturesSection
  | TestimonialsSection
  | CTASection
  | RichTextSection
  | StatsSection
  | FAQSection;

export interface Page {
  _id: string;
  _type: 'page';
  title: string;
  slug: {
    current: string;
  };
  description?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  sections: Section[];
}
