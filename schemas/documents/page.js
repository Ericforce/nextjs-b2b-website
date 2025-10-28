module.exports = {
  name: 'page',
  type: 'document',
  title: 'Page',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      description: 'Page title used for navigation and SEO.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      description: 'URL path for this page. Auto-generated from title.',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'sections',
      type: 'array',
      title: 'Sections',
      description:
        'Compose this page by adding sections such as Hero, Features, Testimonials, CTA, etc. Drag to reorder.',
      of: [
        { type: 'hero' },
        { type: 'features' },
        { type: 'testimonials' },
        { type: 'cta' },
        { type: 'contentBlock' },
        { type: 'stats' },
        { type: 'faq' },
      ],
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo',
    },
  ],
  orderings: [
    { title: 'Title, A-Z', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
    { title: 'Title, Z-A', name: 'titleDesc', by: [{ field: 'title', direction: 'desc' }] },
    { title: 'Last Updated, Newest', name: 'updatedDesc', by: [{ field: '_updatedAt', direction: 'desc' }] },
    { title: 'Last Updated, Oldest', name: 'updatedAsc', by: [{ field: '_updatedAt', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current' },
    prepare({ title, slug }) {
      return {
        title: title || 'Untitled Page',
        subtitle: slug ? `/${slug}` : 'No slug set',
      };
    },
  },
};
