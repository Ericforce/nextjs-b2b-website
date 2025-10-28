# Dynamic Pages UI with Sanity CMS

A Next.js application featuring dynamic, composable pages powered by Sanity CMS with Incremental Static Regeneration (ISR).

## Features

- 🏗️ **Catch-all dynamic routing** with `[[...slug]]` pattern
- 🔄 **Incremental Static Regeneration (ISR)** with 60-second revalidation
- 📝 **Modular Section System** (Hero, Features, Testimonials, CTA, RichText, Stats, FAQ)
- 🎨 **Responsive Tailwind CSS** styling
- 📊 **TypeScript** types derived from Sanity schemas
- 🔍 **GROQ queries** for efficient data fetching
- 🎯 **Sample content fallback** for first-run experience
- 🚫 **404 handling** for missing pages

## Project Structure

```
app/
  (website)/
    [[...slug]]/
      page.tsx          # Catch-all route with ISR
  layout.tsx            # Root layout
  not-found.tsx         # 404 page
components/
  sections/             # Reusable section components
    Hero.tsx
    Features.tsx
    Testimonials.tsx
    CallToAction.tsx
    RichText.tsx
    Stats.tsx
    FAQ.tsx
  SectionRenderer.tsx   # Section mapper
lib/
  sanity/
    client.ts           # Sanity client config
    queries.ts          # GROQ queries
  sampleContent.ts      # Fallback content
types/
  sanity.ts             # TypeScript types
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Sanity account (optional for development)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create environment variables (optional for Sanity integration):

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Sanity credentials:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the homepage with sample content.

## Pages

- **Homepage**: `/` - Renders sample content or Sanity page with slug `/`, `home`, or ``
- **About**: `/about` - Sample about page
- **Dynamic Pages**: `/any/path` - Fetches from Sanity or returns 404

## Sections

Each section component is responsive and styled with Tailwind CSS:

### Hero
Full-width hero with heading, subheading, CTA buttons, and optional image.

### Features
Grid or list layout showcasing product features with icons, titles, and descriptions.

### Testimonials
Customer testimonials with avatars, quotes, names, and titles.

### Call to Action
Prominent CTA section with heading, subheading, and action buttons.

### Rich Text
Portable Text content with custom styling for headings, paragraphs, lists, and links.

### Stats
Statistics display in grid format with values and descriptions.

### FAQ
Accordion-style frequently asked questions with expandable answers.

## ISR Configuration

Pages use ISR with the following settings:

- **Revalidation**: 60 seconds (configurable via `revalidate` export)
- **Tags**: Each page is tagged for on-demand revalidation
- **Fallback**: Sample content when Sanity is not configured
- **404**: Returns `notFound()` for missing pages

## Sanity Schema Requirements

Your Sanity schema should include:

### Page Document

```typescript
{
  _type: 'page',
  title: string,
  slug: { current: string },
  description?: string,
  seo?: {
    metaTitle?: string,
    metaDescription?: string,
  },
  sections: Section[]
}
```

### Section Types

Each section type should have `_key`, `_type`, and specific fields as defined in `types/sanity.ts`.

## Adding New Sections

1. Create a new section component in `components/sections/`
2. Define the section type in `types/sanity.ts`
3. Add the section to `SECTION_COMPONENTS` in `components/SectionRenderer.tsx`
4. Update Sanity schema to include the new section type

## Deployment

The application works seamlessly with Vercel:

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

Vercel will automatically handle ISR and on-demand revalidation.

## License

MIT
