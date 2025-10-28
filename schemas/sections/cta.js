module.exports = {
  name: 'cta',
  type: 'object',
  title: 'Call To Action',
  fields: [
    { name: 'heading', type: 'string', title: 'Heading', validation: (Rule) => Rule.required() },
    { name: 'body', type: 'blockContent', title: 'Body' },
    { name: 'primaryCta', type: 'link', title: 'Primary CTA' },
    { name: 'secondaryCta', type: 'link', title: 'Secondary CTA' },
    {
      name: 'tone',
      type: 'string',
      title: 'Tone',
      options: { list: [
        { title: 'Primary', value: 'primary' },
        { title: 'Neutral', value: 'neutral' },
        { title: 'Subtle', value: 'subtle' },
      ] },
      initialValue: 'primary',
    },
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Call To Action', subtitle: 'CTA section' };
    },
  },
};
