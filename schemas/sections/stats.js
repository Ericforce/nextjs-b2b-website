module.exports = {
  name: 'stats',
  type: 'object',
  title: 'Stats',
  fields: [
    { name: 'heading', type: 'string', title: 'Heading' },
    {
      name: 'items',
      type: 'array',
      title: 'Stat Items',
      of: [{ type: 'stat' }],
      validation: (Rule) => Rule.min(1).error('Add at least one stat'),
    },
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Stats', subtitle: 'Stats section' };
    },
  },
};
