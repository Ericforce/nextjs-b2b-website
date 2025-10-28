module.exports = {
  name: 'category',
  type: 'document',
  title: 'Category',
  fields: [
    { name: 'title', type: 'string', title: 'Title', validation: (Rule) => Rule.required() },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    { name: 'description', type: 'text', title: 'Description', rows: 2 },
  ],
  preview: {
    select: { title: 'title', subtitle: 'slug.current' },
    prepare({ title, subtitle }) {
      return { title, subtitle: subtitle ? `/${subtitle}` : '' };
    },
  },
};
