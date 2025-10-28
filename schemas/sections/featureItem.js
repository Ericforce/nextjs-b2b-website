module.exports = {
  name: 'featureItem',
  type: 'object',
  title: 'Feature Item',
  fields: [
    { name: 'title', type: 'string', title: 'Title', validation: (Rule) => Rule.required() },
    { name: 'description', type: 'text', title: 'Description', rows: 3 },
    {
      name: 'icon',
      type: 'image',
      title: 'Icon',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alt Text', validation: (Rule) => Rule.required() },
      ],
    },
  ],
  preview: {
    select: { title: 'title', media: 'icon' },
    prepare({ title, media }) {
      return { title, media, subtitle: 'Feature' };
    },
  },
};
