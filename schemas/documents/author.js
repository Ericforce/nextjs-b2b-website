module.exports = {
  name: 'author',
  type: 'document',
  title: 'Author',
  fields: [
    { name: 'name', type: 'string', title: 'Name', validation: (Rule) => Rule.required() },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'image',
      type: 'image',
      title: 'Portrait',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alt Text', validation: (Rule) => Rule.required() },
        { name: 'caption', type: 'string', title: 'Caption' },
      ],
    },
    {
      name: 'bio',
      type: 'blockContent',
      title: 'Bio',
      description: 'Short biography for the author profile.',
    },
  ],
  preview: {
    select: { title: 'name', media: 'image' },
    prepare({ title, media }) {
      return { title, media };
    },
  },
};
