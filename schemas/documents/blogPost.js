module.exports = {
  name: 'blogPost',
  type: 'document',
  title: 'Blog Post',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published At',
      description: 'Set a publish date to schedule or order posts.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'excerpt',
      type: 'text',
      title: 'Excerpt',
      rows: 3,
      description: 'Short summary used in lists and meta descriptions (max ~160 chars).',
      validation: (Rule) => Rule.max(200).warning('Keep under 160 characters for best SEO results'),
    },
    {
      name: 'heroImage',
      title: 'Hero Image',
      type: 'imageWithAlt',
      description: 'Primary image shown at the top of the post. Supports hotspot & metadata.',
    },
    {
      name: 'content',
      type: 'blockContent',
      title: 'Content',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'authors',
      title: 'Authors',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'author' }] }],
      validation: (Rule) => Rule.min(1).error('Please add at least one author'),
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }],
    },
    {
      name: 'seo',
      title: 'SEO Overrides',
      type: 'seo',
    },
  ],
  orderings: [
    { title: 'Publish Date, Newest', name: 'publishedDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
    { title: 'Publish Date, Oldest', name: 'publishedAsc', by: [{ field: 'publishedAt', direction: 'asc' }] },
    { title: 'Last Updated, Newest', name: 'updatedDesc', by: [{ field: '_updatedAt', direction: 'desc' }] },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'heroImage.image',
      publishedAt: 'publishedAt',
      authors0: 'authors.0.name',
      slug: 'slug.current',
    },
    prepare({ title, media, publishedAt, authors0, slug }) {
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : 'Unpublished';
      return {
        title: title || 'Untitled Post',
        subtitle: `${date}${authors0 ? ` • by ${authors0}` : ''}${slug ? ` • /blog/${slug}` : ''}`,
        media,
      };
    },
  },
};
