module.exports = {
  name: 'contentBlock',
  type: 'object',
  title: 'Content Block',
  fields: [
    { name: 'heading', type: 'string', title: 'Heading' },
    { name: 'body', type: 'blockContent', title: 'Body' },
    {
      name: 'media',
      type: 'imageWithAlt',
      title: 'Image',
    },
    {
      name: 'alignment',
      type: 'string',
      title: 'Media Alignment',
      options: { list: [
        { title: 'Left', value: 'left' },
        { title: 'Right', value: 'right' },
        { title: 'Center', value: 'center' },
      ] },
      initialValue: 'center',
    },
  ],
  preview: {
    select: { title: 'heading', media: 'media.image' },
    prepare({ title, media }) {
      return { title: title || 'Content Block', media };
    },
  },
};
