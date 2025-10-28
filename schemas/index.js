// Central export for all schema types
// These are plain JavaScript schema objects compatible with Sanity v3 shape

const siteSettings = require('./documents/siteSettings');
const page = require('./documents/page');
const blogPost = require('./documents/blogPost');
const author = require('./documents/author');
const category = require('./documents/category');
const tag = require('./documents/tag');

// Objects
const seo = require('./objects/seo');
const link = require('./objects/link');
const blockContent = require('./objects/blockContent');
const imageWithAlt = require('./objects/imageWithAlt');

const hero = require('./sections/hero');
const features = require('./sections/features');
const featureItem = require('./sections/featureItem');
const testimonials = require('./sections/testimonials');
const testimonial = require('./sections/testimonial');
const cta = require('./sections/cta');
const stats = require('./sections/stats');
const stat = require('./sections/stat');
const faq = require('./sections/faq');
const faqItem = require('./sections/faqItem');
const contentBlock = require('./sections/contentBlock');

// Export in a single array suitable for Sanity config
const schemaTypes = [
  // Documents
  siteSettings,
  page,
  blogPost,
  author,
  category,
  tag,

  // Shared objects
  seo,
  link,
  blockContent,
  imageWithAlt,

  // Sections
  hero,
  features,
  featureItem,
  testimonials,
  testimonial,
  cta,
  stats,
  stat,
  faq,
  faqItem,
  contentBlock,
];

module.exports = { schemaTypes };
