module.exports = {
  name: 'testimonials',
  type: 'object',
  title: 'Testimonials',
  fields: [
    { name: 'heading', type: 'string', title: 'Heading' },
    {
      name: 'items',
      type: 'array',
      title: 'Testimonials',
      of: [{ type: 'testimonial' }],
      validation: (Rule) => Rule.min(1).error('Add at least one testimonial'),
    },
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Testimonials', subtitle: 'Testimonials section' };
    },
  },
};
