# Content Model

This document describes the Sanity CMS content model, including all schemas, field descriptions, and how each content type is used throughout the application.

## Overview

The content model is designed to provide maximum flexibility for content editors while maintaining consistency across the site. All schemas are defined in the Sanity Studio and can be edited through the Studio interface.

## Core Schemas

### Page

The `page` schema represents individual pages on the site (e.g., Home, About, Products).

**Fields:**

- **title** (`string`, required)
  - The page title used for SEO and internal references
  - Appears in browser tabs and search results

- **slug** (`slug`, required)
  - URL-friendly identifier (e.g., `about-us`, `pricing`)
  - Auto-generated from title but can be customized
  - Must be unique across all pages

- **seoTitle** (`string`, optional)
  - Override the default title for SEO purposes
  - Recommended length: 50-60 characters
  - Falls back to `title` if not provided

- **seoDescription** (`text`, optional)
  - Meta description for search engines
  - Recommended length: 150-160 characters
  - Should be compelling and include target keywords

- **openGraphImage** (`image`, optional)
  - Image displayed when page is shared on social media
  - Recommended size: 1200x630px
  - Falls back to default site image if not provided

- **sections** (`array`, required)
  - List of reusable content sections that make up the page
  - Can include: Hero, Features, CTA, Testimonials, etc.
  - Drag-and-drop ordering in Studio
  - See [Section Types](#section-types) below

- **publishedAt** (`datetime`, optional)
  - Publication date and time
  - Used for sorting and display
  - Automatically set on first publish

### Blog Post

The `blogPost` schema represents individual blog articles.

**Fields:**

- **title** (`string`, required)
  - Blog post title
  - Used in listings, detail page, and SEO

- **slug** (`slug`, required)
  - URL identifier (e.g., `introducing-new-features`)
  - Auto-generated from title
  - Must be unique across all blog posts

- **excerpt** (`text`, optional)
  - Short summary of the post (2-3 sentences)
  - Displayed in blog listings and meta descriptions
  - Recommended length: 150-200 characters

- **author** (`reference`, optional)
  - Reference to an Author document
  - Displays author name, photo, and bio on post

- **mainImage** (`image`, required)
  - Featured image for the blog post
  - Displayed at top of post and in listings
  - Recommended size: 1200x675px
  - Includes alt text field for accessibility

- **categories** (`array`, optional)
  - Tags/categories for organization
  - References to Category documents
  - Used for filtering and related posts

- **body** (`blockContent`, required)
  - Main content of the blog post
  - Supports rich text formatting, images, code blocks, and embeds
  - See [Block Content](#block-content) below

- **seoTitle** (`string`, optional)
  - Override title for SEO
  - Falls back to `title` if not provided

- **seoDescription** (`text`, optional)
  - Meta description for search engines
  - Falls back to `excerpt` if not provided

- **publishedAt** (`datetime`, required)
  - Publication date
  - Used for sorting, display, and RSS feed
  - Can be scheduled for future publication

### Author

The `author` schema represents blog post authors and team members.

**Fields:**

- **name** (`string`, required)
  - Full name of the author

- **slug** (`slug`, required)
  - URL identifier for author archive pages

- **image** (`image`, optional)
  - Author photo/headshot
  - Displayed with blog posts
  - Recommended size: 400x400px (square)

- **bio** (`text`, optional)
  - Short biography (2-3 sentences)
  - Displayed on author pages and blog posts

- **socialLinks** (`object`, optional)
  - Twitter, LinkedIn, GitHub profile URLs
  - Displayed as social icons with author info

### Category

The `category` schema is used to organize blog posts.

**Fields:**

- **title** (`string`, required)
  - Category name (e.g., "Product Updates", "Engineering")

- **slug** (`slug`, required)
  - URL identifier for category pages

- **description** (`text`, optional)
  - Brief description of the category
  - Displayed on category archive pages

### Site Settings

The `siteSettings` schema stores global site configuration (singleton).

**Fields:**

- **title** (`string`, required)
  - Site name (e.g., "B2B App")
  - Used in headers, footers, and SEO

- **description** (`text`, required)
  - Default site description for SEO

- **logo** (`image`, optional)
  - Site logo image
  - Displayed in header

- **favicon** (`image`, optional)
  - Browser favicon
  - Recommended size: 32x32px or 64x64px

- **socialLinks** (`object`, optional)
  - Global social media profile URLs
  - Displayed in footer

- **contactEmail** (`string`, optional)
  - Primary contact email address
  - Used in footer and contact forms

- **copyrightText** (`string`, optional)
  - Copyright notice displayed in footer
  - Default: "© {year} {siteName}. All rights reserved."

- **headerCTA** (`object`, optional)
  - Call-to-action button in header
  - Fields: text, link, variant

- **footerSections** (`array`, optional)
  - Footer navigation sections
  - Organized into columns with links

## Section Types

Sections are reusable content blocks that can be added to pages. Each section type has specific fields optimized for its purpose.

### Hero Section

Hero banner with headline, subheadline, and CTA buttons.

**Fields:**
- `headline` (string): Main heading
- `subheadline` (text): Supporting text
- `primaryCTA` (object): Button text and link
- `secondaryCTA` (object): Optional second button
- `backgroundImage` (image): Optional background image
- `alignment` (string): left, center, or right

### Feature Grid

Grid layout showcasing features or benefits.

**Fields:**
- `headline` (string): Section title
- `description` (text): Section introduction
- `features` (array): List of features
  - `title` (string): Feature name
  - `description` (text): Feature description
  - `icon` (string): Icon identifier
  - `image` (image): Optional feature image
- `columns` (number): 2, 3, or 4 columns

### CTA Section

Call-to-action section with button.

**Fields:**
- `headline` (string): Main text
- `description` (text): Supporting text
- `buttonText` (string): CTA button label
- `buttonLink` (string): Button URL
- `backgroundColor` (string): Section background color
- `alignment` (string): left, center, or right

### Testimonial Section

Customer testimonials and social proof.

**Fields:**
- `headline` (string): Section title
- `testimonials` (array): List of testimonials
  - `quote` (text): Customer quote
  - `author` (string): Customer name
  - `role` (string): Customer title/company
  - `image` (image): Customer photo
  - `rating` (number): Optional star rating
- `layout` (string): carousel, grid, or single

### Rich Text Section

Flexible content area with formatted text, images, and embeds.

**Fields:**
- `content` (blockContent): Rich text editor
- `backgroundColor` (string): Section background
- `width` (string): narrow, medium, or full

### Logo Cloud

Display client/partner logos.

**Fields:**
- `headline` (string): Section title
- `logos` (array): List of logo images
  - `image` (image): Logo image
  - `alt` (string): Logo alt text
  - `link` (url): Optional company website
- `grayscale` (boolean): Display logos in grayscale

### FAQ Section

Frequently asked questions with expandable answers.

**Fields:**
- `headline` (string): Section title
- `faqs` (array): List of Q&A pairs
  - `question` (string): Question text
  - `answer` (blockContent): Answer with formatting
- `layout` (string): single-column or two-column

### Stats Section

Highlight key metrics and numbers.

**Fields:**
- `headline` (string): Section title
- `description` (text): Supporting text
- `stats` (array): List of statistics
  - `value` (string): Metric value (e.g., "500+", "99.9%")
  - `label` (string): Metric description
  - `icon` (string): Optional icon identifier

## Block Content

Block content is Sanity's rich text format, supporting:

- **Text Formatting**: Bold, italic, underline, strikethrough
- **Headings**: H2, H3, H4, H5, H6
- **Lists**: Bulleted and numbered lists
- **Links**: Internal page links and external URLs
- **Images**: Inline images with captions and alt text
- **Code Blocks**: Syntax-highlighted code with language selection
- **Quotes**: Blockquote formatting
- **Custom Blocks**: Buttons, callouts, embeds (YouTube, Twitter, etc.)

## Field Validation

All schemas include validation rules to ensure content quality:

- **Required Fields**: Marked with asterisk (*) in Studio
- **Slug Uniqueness**: Enforced at document level
- **Image Requirements**: Minimum dimensions and file types
- **Character Limits**: Enforced for SEO fields
- **URL Validation**: Ensures valid URLs in link fields

## Content Organization

### Page Structure

Pages are built using a modular section system:

1. Content editor creates/edits a Page document
2. Sections are added via the "Add section" button
3. Each section can be reordered by drag-and-drop
4. Section-specific fields appear based on section type
5. Preview available before publishing

### Blog Structure

Blog posts follow a standard article format:

1. Title, excerpt, and featured image at the top
2. Author information and metadata
3. Rich text body content
4. Categories for organization
5. Related posts automatically suggested

## Best Practices

### SEO Optimization

- Always fill in `seoTitle` and `seoDescription` for important pages
- Use descriptive alt text for all images
- Keep URLs short and keyword-focused
- Include target keywords naturally in content

### Content Quality

- Write compelling headlines (under 60 characters)
- Keep meta descriptions between 150-160 characters
- Use clear, action-oriented CTA button text
- Optimize images before uploading (compress, resize)
- Test pages on mobile devices

### Content Reuse

- Create reusable sections for consistent messaging
- Use references for authors and categories
- Maintain a consistent tone and style
- Document custom section usage internally

## Schema Relationships

```
Page
└── sections[] (Section types)
    └── references (e.g., testimonials, logos)

BlogPost
├── author → Author
├── categories[] → Category[]
└── body (blockContent with embedded media)

SiteSettings (singleton)
├── logo (image)
├── footerSections[]
└── socialLinks

Category
└── blogPosts[] (reverse reference)

Author
└── blogPosts[] (reverse reference)
```

## Content Migration

When migrating content from another system:

1. Export existing content to JSON/CSV
2. Map old fields to new schema fields
3. Use Sanity's import tool or custom script
4. Validate imported content in Studio
5. Update URLs and internal links
6. Set up redirects for old URLs

## Further Resources

- [Sanity Schema Documentation](https://www.sanity.io/docs/schema-types)
- [Block Content Guide](https://www.sanity.io/docs/block-content)
- [Editing Guide](./editing-guide.md) - For content editors
- [Architecture Guide](./architecture.md) - For developers
