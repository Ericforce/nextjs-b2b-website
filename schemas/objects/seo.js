module.exports = {
  name: 'seo',
  type: 'object',
  title: 'SEO',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Meta Title',
      description: 'Overrides default meta title for this document.',
    },
    {
      name: 'description',
      type: 'text',
      rows: 3,
      title: 'Meta Description',
      description: 'Brief description for search engines and social sharing. Aim for ~155-160 characters.',
      validation: (Rule) => Rule.max(200).warning('Keep under 160 characters for best SEO results'),
    },
    {
      name: 'openGraphImage',
      type: 'imageWithAlt',
      title: 'Open Graph Image',
      description: 'Used for social sharing (Facebook, Twitter, etc.).',
    },
  ],
};
