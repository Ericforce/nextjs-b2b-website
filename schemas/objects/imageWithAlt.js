// Reusable image object with hotspot and common metadata fields for optimization
module.exports = {
  name: 'imageWithAlt',
  type: 'object',
  title: 'Image',
  fields: [
    {
      name: 'image',
      type: 'image',
      title: 'Image',
      options: {
        hotspot: true,
      },
      fields: [
        { name: 'alt', type: 'string', title: 'Alt Text', validation: (Rule) => Rule.required() },
        { name: 'caption', type: 'string', title: 'Caption' },
        { name: 'attribution', type: 'string', title: 'Attribution' },
      ],
    },
    {
      name: 'priority',
      type: 'boolean',
      title: 'Load Priority',
      description: 'Mark as high priority for above-the-fold images to optimize loading.',
      initialValue: false,
    },
  ],
  preview: {
    select: { media: 'image', title: 'image.alt', subtitle: 'image.caption' },
    prepare({ media, title, subtitle }) {
      return { media, title: title || 'Image', subtitle };
    },
  },
};
