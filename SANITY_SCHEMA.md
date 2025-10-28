# Sanity Schema Guide

This document provides guidance for setting up Sanity schemas that work with this Next.js application.

## Page Document

```javascript
export default {
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
        },
      ],
    },
    {
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        { type: 'hero' },
        { type: 'features' },
        { type: 'testimonials' },
        { type: 'cta' },
        { type: 'richText' },
        { type: 'stats' },
        { type: 'faq' },
      ],
    },
  ],
}
```

## Section Objects

### Hero Section

```javascript
export default {
  name: 'hero',
  title: 'Hero Section',
  type: 'object',
  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
    },
    {
      name: 'cta',
      title: 'Primary CTA',
      type: 'object',
      fields: [
        { name: 'label', type: 'string' },
        { name: 'href', type: 'string' },
      ],
    },
    {
      name: 'secondaryCta',
      title: 'Secondary CTA',
      type: 'object',
      fields: [
        { name: 'label', type: 'string' },
        { name: 'href', type: 'string' },
      ],
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        },
      ],
    },
  ],
}
```

### Features Section

```javascript
export default {
  name: 'features',
  title: 'Features Section',
  type: 'object',
  fields: [
    {
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
    },
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
    },
    {
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Grid', value: 'grid' },
          { title: 'List', value: 'list' },
        ],
      },
      initialValue: 'grid',
    },
    {
      name: 'items',
      title: 'Features',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'description', type: 'text' },
            { name: 'icon', type: 'string', description: 'Emoji or icon character' },
          ],
        },
      ],
    },
  ],
}
```

### Testimonials Section

```javascript
export default {
  name: 'testimonials',
  title: 'Testimonials Section',
  type: 'object',
  fields: [
    {
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
    },
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'quote', type: 'text', validation: (Rule) => Rule.required() },
            { name: 'name', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'title', type: 'string' },
            {
              name: 'avatar',
              type: 'image',
              options: { hotspot: true },
              fields: [{ name: 'alt', type: 'string' }],
            },
          ],
        },
      ],
    },
  ],
}
```

### CTA Section

```javascript
export default {
  name: 'cta',
  title: 'Call to Action Section',
  type: 'object',
  fields: [
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
    },
    {
      name: 'cta',
      title: 'Primary CTA',
      type: 'object',
      fields: [
        { name: 'label', type: 'string' },
        { name: 'href', type: 'string' },
      ],
    },
    {
      name: 'secondaryCta',
      title: 'Secondary CTA',
      type: 'object',
      fields: [
        { name: 'label', type: 'string' },
        { name: 'href', type: 'string' },
      ],
    },
  ],
}
```

### Rich Text Section

```javascript
export default {
  name: 'richText',
  title: 'Rich Text Section',
  type: 'object',
  fields: [
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
    },
  ],
}
```

### Stats Section

```javascript
export default {
  name: 'stats',
  title: 'Stats Section',
  type: 'object',
  fields: [
    {
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
    },
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
    },
    {
      name: 'items',
      title: 'Stats',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'stat', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'value', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'description', type: 'text' },
          ],
        },
      ],
    },
  ],
}
```

### FAQ Section

```javascript
export default {
  name: 'faq',
  title: 'FAQ Section',
  type: 'object',
  fields: [
    {
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
    },
    {
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', type: 'string', validation: (Rule) => Rule.required() },
            { name: 'answer', type: 'text', validation: (Rule) => Rule.required() },
          ],
        },
      ],
    },
  ],
}
```

## Slug Configuration

The application supports multiple slug formats:

- **Homepage**: Use slug `""` (empty), `"/"`, or `"home"`
- **Other pages**: Use slug without leading slash (e.g., `"about"`, `"pricing"`)
- **Nested pages**: Use forward slashes (e.g., `"products/pricing"`)

## Testing Your Schema

1. Create a page with slug `"/"` or `"home"` for the homepage
2. Add at least one section to the page
3. Publish the page
4. The Next.js application will fetch and render it automatically with ISR
