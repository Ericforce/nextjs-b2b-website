module.exports = {
  name: 'siteSettings',
  type: 'document',
  title: 'Site Settings',
  // Marked as a singleton by convention; enforce via desk structure in Studio
  options: { singleton: true },
  fields: [
    {
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      description: 'Primary contact email shown on the site and used for forms.',
      validation: (Rule) => Rule.required().email().error('Please enter a valid email address'),
    },
    {
      name: 'navigation',
      title: 'Navigation Links',
      type: 'array',
      of: [{ type: 'link' }],
      description: 'Top navigation links for the site header. Drag to order.',
      validation: (Rule) => Rule.min(0),
    },
    {
      name: 'footerLinks',
      title: 'Footer Links',
      type: 'array',
      of: [{ type: 'link' }],
      description: 'Links to show in the site footer. Drag to order.',
      validation: (Rule) => Rule.min(0),
    },
    {
      name: 'defaultSeo',
      title: 'Default SEO',
      type: 'seo',
      description:
        'Fallback meta information used when specific pages or posts do not override these values.',
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Global Site Settings',
        subtitle: 'Navigation, Footer, Contact, SEO Defaults',
      };
    },
  },
};
