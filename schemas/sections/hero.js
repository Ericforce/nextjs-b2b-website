module.exports = {
  name: 'hero',
  type: 'object',
  title: 'Hero',
  fields: [
    { name: 'heading', type: 'string', title: 'Heading', validation: (Rule) => Rule.required() },
    { name: 'subheading', type: 'text', title: 'Subheading', rows: 2 },
    {
      name: 'variant',
      type: 'string',
      title: 'Layout Variant',
      options: { list: [
        { title: 'Centered', value: 'centered' },
        { title: 'Left-aligned', value: 'left' },
        { title: 'With background image', value: 'withImage' },
      ] },
      initialValue: 'centered',
    },
    {
      name: 'background',
      type: 'imageWithAlt',
      title: 'Background Image',
      hidden: ({ parent }) => parent?.variant !== 'withImage',
    },
    {
      name: 'primaryCta',
      type: 'link',
      title: 'Primary CTA',
    },
    {
      name: 'secondaryCta',
      type: 'link',
      title: 'Secondary CTA',
    },
  ],
  preview: {
    select: { title: 'heading', media: 'background.image' },
    prepare({ title, media }) {
      return { title: title || 'Hero', media, subtitle: 'Hero section' };
    },
  },
};
