module.exports = {
  name: 'link',
  type: 'object',
  title: 'Link',
  fields: [
    {
      name: 'label',
      type: 'string',
      title: 'Label',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'linkType',
      type: 'string',
      title: 'Link Type',
      description: 'Choose whether this link goes to content in the Studio (internal) or an external URL.',
      options: {
        list: [
          { title: 'Internal', value: 'internal' },
          { title: 'External', value: 'external' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'reference',
      type: 'reference',
      title: 'Internal Reference',
      to: [
        { type: 'page' },
        { type: 'blogPost' },
        { type: 'category' },
        { type: 'tag' },
      ],
      hidden: ({ parent }) => parent?.linkType !== 'internal',
      validation: (Rule) => Rule.custom((value, context) => {
        const { parent } = context;
        if (parent?.linkType === 'internal' && !value) return 'Please select a document to link to';
        return true;
      }),
    },
    {
      name: 'url',
      type: 'url',
      title: 'External URL',
      hidden: ({ parent }) => parent?.linkType !== 'external',
      validation: (Rule) =>
        Rule.uri({ allowRelative: false, scheme: ['http', 'https', 'mailto', 'tel'] }).custom((value, context) => {
          const { parent } = context;
          if (parent?.linkType === 'external' && !value) return 'Please enter a URL';
          return true;
        }),
    },
  ],
  preview: {
    select: { label: 'label', linkType: 'linkType', url: 'url', slug: 'reference.slug.current', refType: 'reference._type' },
    prepare({ label, linkType, url, slug, refType }) {
      const subtitle = linkType === 'internal' ? `${refType || 'doc'}: /${slug || '?'}` : url;
      return { title: label, subtitle };
    },
  },
};
