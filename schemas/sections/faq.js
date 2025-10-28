module.exports = {
  name: 'faq',
  type: 'object',
  title: 'FAQ',
  fields: [
    { name: 'heading', type: 'string', title: 'Heading' },
    {
      name: 'items',
      type: 'array',
      title: 'Questions & Answers',
      of: [{ type: 'faqItem' }],
      validation: (Rule) => Rule.min(1).error('Add at least one question'),
    },
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'FAQ', subtitle: 'FAQ section' };
    },
  },
};
