module.exports = {
  name: 'testimonial',
  type: 'object',
  title: 'Testimonial',
  fields: [
    { name: 'quote', type: 'text', title: 'Quote', rows: 3, validation: (Rule) => Rule.required() },
    { name: 'name', type: 'string', title: 'Author Name', validation: (Rule) => Rule.required() },
    { name: 'title', type: 'string', title: 'Author Title/Company' },
    { name: 'avatar', type: 'imageWithAlt', title: 'Author Photo' },
  ],
  preview: {
    select: { title: 'name', subtitle: 'title', media: 'avatar.image' },
    prepare({ title, subtitle, media }) {
      return { title, subtitle, media };
    },
  },
};
