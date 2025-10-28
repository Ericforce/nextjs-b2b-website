module.exports = {
  name: 'faqItem',
  type: 'object',
  title: 'FAQ Item',
  fields: [
    { name: 'question', type: 'string', title: 'Question', validation: (Rule) => Rule.required() },
    { name: 'answer', type: 'blockContent', title: 'Answer', validation: (Rule) => Rule.required() },
  ],
  preview: {
    select: { title: 'question' },
    prepare({ title }) {
      return { title };
    },
  },
};
