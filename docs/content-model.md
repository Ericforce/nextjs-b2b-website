# Content Model Documentation

This document outlines the Sanity content model, including document types, sections, objects, and editorial workflows.

## Document Types

### Site Settings
- **Type**: `siteSettings`
- **Purpose**: Global site configuration and defaults
- **Singleton**: Yes (only one instance)
- **Key Fields**:
  - Site name, description, locale, URL
  - Logo and favicon
  - Default SEO settings
  - Navigation (main and secondary)
  - Header CTA
  - Footer sections
  - Social media links
  - Copyright text

### Pages
- **Type**: `page`
- **Purpose**: Static pages with flexible content sections
- **Key Fields**:
  - Title and slug
  - Description
  - SEO overrides
  - Sections (array of content sections)

### Blog Posts
- **Type**: `blogPost`
- **Purpose**: Blog articles with rich content
- **Key Fields**:
  - Title, slug, excerpt
  - Featured image
  - Portable Text body content
  - Author reference
  - Category and tag references
  - Published date
  - SEO overrides

### Authors
- **Type**: `author`
- **Purpose**: Blog post authors
- **Key Fields**:
  - Name, slug, bio
  - Profile image
  - Website and email
  - Social media links

### Categories
- **Type**: `category`
- **Purpose**: Blog post categorization
- **Key Fields**:
  - Title, slug, description
  - Color for UI display
  - Icon

### Tags
- **Type**: `tag`
- **Purpose**: Blog post tagging
- **Key Fields**:
  - Title, slug, description
  - Color for UI display

### Reusable Sections
- **Type**: `reusableSection`
- **Purpose**: Content sections that can be reused across multiple pages
- **Key Fields**:
  - Title and description
  - Array of sections (same as page sections)

## Section Types

### Hero Section
- **Type**: `heroSection`
- **Purpose**: Page hero with headline, description, and CTAs
- **Features**:
  - Eyebrow, headline, subheadline, tagline
  - Description text
  - Alignment options
  - Background color
  - Primary and secondary CTAs
  - Background image
  - Media image

### Feature Grid Section
- **Type**: `featureGridSection`
- **Purpose**: Display features in a grid layout
- **Features**:
  - Headline and description
  - Column count (1-4)
  - Feature items with title, description, icon, and image

### Testimonial Section
- **Type**: `testimonialSection`
- **Purpose**: Display customer testimonials
- **Features**:
  - Headline and description
  - Layout options (carousel, grid, single)
  - Testimonials with quote, author, role, company, rating, images

### Call to Action Section
- **Type**: `ctaSection`
- **Purpose**: Prominent call-to-action section
- **Features**:
  - Headline and description
  - Alignment options
  - Background color
  - Primary and secondary CTAs

### Rich Text Section
- **Type**: `richTextSection`
- **Purpose**: Rich text content with formatting
- **Features**:
  - Headline
  - Background color
  - Width options (narrow, medium, full)
  - Portable Text content with links, images, code blocks

### FAQ Section
- **Type**: `faqSection`
- **Purpose**: Frequently asked questions
- **Features**:
  - Headline
  - Layout options (single-column, two-column)
  - FAQ items with question and Portable Text answers

### Stats Section
- **Type**: `statsSection`
- **Purpose**: Display key statistics
- **Features**:
  - Headline and description
  - Stat items with value, label, and icon

### Logo Cloud Section
- **Type**: `logoCloudSection`
- **Purpose**: Display logos of partners or clients
- **Features**:
  - Headline
  - Grayscale option
  - Logo items with images and optional links

### Contact Section
- **Type**: `contactSection`
- **Purpose**: Contact information and form
- **Features**:
  - Eyebrow, headline, description
  - Background color
  - Show/hide contact form
  - Contact details (email, phone, address, etc.)

### Reusable Section Reference
- **Type**: `reusableSectionReference`
- **Purpose**: Reference to a reusable section
- **Features**:
  - Reference to a reusable section document

## Object Types

### Navigation Link
- **Type**: `navigationLink`
- **Purpose**: Links for navigation menus
- **Features**:
  - Label text
  - External URL or internal page reference
  - Open in new tab option

### Call to Action
- **Type**: `callToAction`
- **Purpose**: Button-style links
- **Features**:
  - Button text
  - External URL or internal page reference
  - Variant (primary, secondary, ghost, link)
  - Open in new tab option

### Image with Hotspot
- **Type**: `imageWithHotspot`
- **Purpose**: Images with hotspot cropping
- **Features**:
  - Image with hotspot
  - Alternative text
  - Caption

### SEO
- **Type**: `seo`
- **Purpose**: SEO metadata
- **Features**:
  - Title, description, title template
  - Canonical URL, no index option
  - Keywords
  - Open Graph and Twitter card settings

### Social Links
- **Type**: `socialLinks`
- **Purpose**: Social media profile links
- **Features**:
  - Twitter, LinkedIn, GitHub, YouTube, Facebook, Instagram

### Contact Details
- **Type**: `contactDetails`
- **Purpose**: Contact information items
- **Features**:
  - Label and value
  - Icon
  - Optional link (mailto:, tel:, or URL)

### Link Annotations
- **Internal Link**: `linkInternal` - Links to internal documents
- **External Link**: `linkExternal` - Links to external URLs

### Code Block
- **Type**: `codeBlock`
- **Purpose**: Code snippets in Portable Text
- **Features**:
  - Language syntax highlighting
  - Code content
  - Optional filename

## Editorial Workflows

### Creating a New Page
1. Navigate to Pages in Sanity Studio
2. Create new page document
3. Add title and slug
4. Add sections to build page content
5. Configure SEO settings
6. Publish

### Creating a Blog Post
1. Navigate to Blog Posts in Sanity Studio
2. Create new blog post document
3. Add title, slug, and excerpt
4. Set featured image
5. Write body content using Portable Text editor
6. Assign author, categories, and tags
7. Set published date
8. Configure SEO settings
9. Publish

### Managing Authors
1. Navigate to Authors in Sanity Studio
2. Create author document
3. Add name, bio, and profile information
4. Set profile image
5. Add social media links
6. Publish

### Creating Reusable Sections
1. Navigate to Reusable Sections in Sanity Studio
2. Create new reusable section document
3. Add title and description
4. Build section content
5. Publish
6. Reference from pages using "Reusable Section Reference"

### Site Configuration
1. Navigate to Site Settings in Sanity Studio
2. Update global settings
3. Configure navigation menus
4. Set default SEO
5. Add social media links
6. Save changes

## Naming Conventions

### Document Types
- Use PascalCase for type names (e.g., `blogPost`, `siteSettings`)
- Use singular form for document types

### Field Names
- Use camelCase for field names
- Be descriptive but concise
- Use consistent naming across similar fields

### Section Types
- End section type names with "Section" (e.g., `heroSection`, `ctaSection`)
- Use descriptive names that indicate purpose

### Object Types
- Use PascalCase for type names
- Use descriptive names that indicate function

### Slugs
- Use kebab-case for slug values
- Auto-generate from title when possible
- Ensure uniqueness within document type

## Content Guidelines

### Images
- Always provide alternative text for accessibility
- Use appropriate image formats (WebP for photos, PNG for graphics)
- Optimize image sizes for web performance
- Use hotspot cropping for better composition

### SEO
- Keep titles under 60 characters
- Keep descriptions under 160 characters
- Use descriptive alt text for images
- Include relevant keywords naturally

### Portable Text
- Use proper heading hierarchy (H1-H4)
- Keep paragraphs concise
- Use lists for bullet points
- Add internal links when relevant
- Use code blocks for technical content

### CTAs
- Use action-oriented text
- Keep button text concise
- Ensure sufficient contrast for accessibility
- Test on different screen sizes

## Performance Considerations

### Queries
- Use GROQ projections to limit returned fields
- Select only required image dimensions
- Use reference fetching for related content
- Implement pagination for large content lists

### Images
- Use Sanity's image optimization
- Implement lazy loading for below-fold images
- Use appropriate image formats and sizes
- Consider WebP format for better compression

### Content Structure
- Keep Portable Text content reasonable length
- Use reusable sections for repeated content
- Implement content caching where appropriate
- Consider incremental static regeneration for dynamic content