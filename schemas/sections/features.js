module.exports = {
  name: 'features',
  type: 'object',
  title: 'Features',
  fields: [
    {
      name: 'heading',
      type: 'string',
      title: 'Heading',
    },
    {
      name: 'intro',
      type: 'text',
      title: 'Introduction',
      rows: 2,
    },
    {
      name: 'items',
      type: 'array',
      title: 'Feature Items',
      of: [{ type: 'featureItem' }],
      validation: (Rule) => Rule.min(1).error('Add at least one feature'),
    },
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Features', subtitle: 'Features section' };
    },
  },
};
