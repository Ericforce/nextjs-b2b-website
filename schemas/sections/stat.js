module.exports = {
  name: 'stat',
  type: 'object',
  title: 'Stat',
  fields: [
    { name: 'label', type: 'string', title: 'Label', validation: (Rule) => Rule.required() },
    { name: 'value', type: 'string', title: 'Value', validation: (Rule) => Rule.required() },
  ],
  preview: {
    select: { title: 'value', subtitle: 'label' },
    prepare({ title, subtitle }) {
      return { title, subtitle };
    },
  },
};
