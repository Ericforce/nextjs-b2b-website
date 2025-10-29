# Content Editing Guide

This guide is for content editors and marketers who will be creating and managing content through the Sanity Studio CMS.

## Accessing the CMS

### Sanity Studio

The Sanity Studio is your content management interface where you'll create and edit all content.

**Access URL:**
- **Local Development**: `http://localhost:3333` (when running locally)
- **Production**: `https://your-project.sanity.studio/` (provided by your team)

**Login:**
1. Navigate to the Studio URL
2. Sign in with your Sanity account (Google, GitHub, or email)
3. Ensure you have been granted editor/admin access by a project administrator

## Dashboard Overview

When you log into Sanity Studio, you'll see:

- **Navigation Sidebar**: Access different content types (Pages, Blog Posts, Authors, etc.)
- **Document List**: View all documents of the selected type
- **Document Editor**: Edit individual documents
- **Publish Button**: Save and publish changes to the live site
- **Preview Pane**: See how content will look (if configured)

## Creating & Editing Pages

### Creating a New Page

1. Click **"Pages"** in the sidebar
2. Click the **"+"** button or **"Create new page"**
3. Fill in required fields (marked with red asterisk):
   - **Title**: The page name (e.g., "About Us")
   - **Slug**: Auto-generated URL (e.g., `about-us`)
4. Add **SEO information**:
   - **SEO Title**: Appears in search results (50-60 characters)
   - **SEO Description**: Brief summary (150-160 characters)
   - **Open Graph Image**: Image for social media sharing (1200x630px)
5. Add **sections** to build your page (see [Working with Sections](#working-with-sections))
6. Click **"Publish"** when ready

### Editing an Existing Page

1. Click **"Pages"** in the sidebar
2. Find the page in the list (use search if needed)
3. Click on the page to open it
4. Make your changes
5. Click **"Publish"** to save changes to the live site
   - Or click **"Save"** to keep as draft

### Unpublishing a Page

1. Open the page you want to unpublish
2. Click the **three-dot menu** (⋯) at the top
3. Select **"Unpublish"**
4. Confirm the action
5. The page will no longer appear on the live site

## Working with Sections

Sections are modular content blocks that make up your pages. Each section type has specific purposes and fields.

### Adding a Section

1. Open or create a page
2. Scroll to the **"Sections"** field
3. Click **"Add item"** or **"+"**
4. Choose a section type from the dropdown:
   - Hero Section
   - Feature Grid
   - CTA Section
   - Testimonial Section
   - Rich Text Section
   - Logo Cloud
   - FAQ Section
   - Stats Section
5. Fill in the section-specific fields
6. Click outside the section to collapse it

### Reordering Sections

1. Click and hold the **drag handle** (⋮⋮) on the left of a section
2. Drag the section up or down
3. Release to drop in the new position
4. Changes save automatically (remember to publish!)

### Removing a Section

1. Click the **trash icon** (🗑️) on the section
2. Confirm deletion
3. Publish changes to update the live site

### Section Types Explained

#### Hero Section

Use for page headers with a main headline and call-to-action buttons.

**Best Practices:**
- Keep headline short and impactful (5-10 words)
- Subheadline provides context (1-2 sentences)
- Use high-quality background images (1920x1080px)
- Primary CTA should be the main action (e.g., "Get Started")
- Secondary CTA is optional (e.g., "Learn More")

#### Feature Grid

Showcase product features, services, or benefits in a grid layout.

**Best Practices:**
- Use 3-4 features for best visual balance
- Keep feature titles concise (2-5 words)
- Descriptions should be 1-2 sentences
- Use consistent icons across all features
- Choose 2, 3, or 4 columns based on number of features

#### CTA Section

Encourage visitors to take action with a prominent button.

**Best Practices:**
- Use action-oriented button text (e.g., "Start Free Trial", "Schedule Demo")
- Keep headline direct and benefit-focused
- Description should create urgency or value
- Choose background colors that stand out

#### Testimonial Section

Display customer reviews and social proof.

**Best Practices:**
- Use real customer quotes (with permission)
- Include customer photo for authenticity
- Add company/role for credibility
- 3-6 testimonials work best
- Carousel layout for many testimonials, grid for 3-4

#### Rich Text Section

Flexible content area for detailed text, images, and formatting.

**Best Practices:**
- Use headings (H2, H3) to organize content
- Break up long paragraphs
- Add images to illustrate points
- Use bullet points for scannable lists
- Keep line length readable (narrow or medium width)

#### Logo Cloud

Display client, partner, or technology logos.

**Best Practices:**
- Use high-quality, transparent PNG logos
- Keep logos similar in size
- 6-12 logos work best
- Use grayscale option for consistency
- Link to company websites if appropriate

#### FAQ Section

Answer common questions with expandable answers.

**Best Practices:**
- Write questions as customers would ask them
- Keep answers concise but complete
- Use formatting in answers (bold, bullets)
- Group related questions
- 5-10 FAQs per section recommended

#### Stats Section

Highlight impressive metrics and numbers.

**Best Practices:**
- Use round, impressive numbers (e.g., "10K+", "99%")
- Keep labels short (2-4 words)
- 3-4 stats work best visually
- Include relevant context in description
- Use icons to make stats more visual

## Creating & Editing Blog Posts

### Creating a New Blog Post

1. Click **"Blog Posts"** in the sidebar
2. Click the **"+"** button
3. Fill in required fields:
   - **Title**: Post headline
   - **Slug**: Auto-generated URL (e.g., `how-to-scale-your-business`)
   - **Excerpt**: 2-3 sentence summary
   - **Main Image**: Featured image (1200x675px recommended)
   - **Body**: Main post content (see [Writing Blog Content](#writing-blog-content))
   - **Published At**: Publication date and time
4. Optional fields:
   - **Author**: Select from existing authors
   - **Categories**: Tag relevant categories
   - **SEO Title/Description**: Override defaults
5. Click **"Publish"** when ready

### Writing Blog Content

The body field uses a rich text editor with many formatting options:

**Formatting Toolbar:**
- **Bold** (⌘+B): Emphasize important text
- **Italic** (⌘+I): Add emphasis
- **Headings**: Use H2 for main sections, H3 for subsections
- **Lists**: Bullet or numbered lists
- **Links**: Highlight text and click link icon
- **Blockquotes**: For pull quotes or citations

**Adding Media:**
1. Click **"+"** in the editor
2. Select **"Image"** to upload an image
3. Add **alt text** (description for screen readers)
4. Optional: Add caption below image

**Adding Code Blocks:**
1. Click **"+"** in the editor
2. Select **"Code"**
3. Choose programming language
4. Paste code
5. Great for technical tutorials

**Embedding Media:**
- YouTube videos
- Twitter posts
- Other embeds (if configured)

### Blog Post Best Practices

**Writing:**
- Start with a strong hook in the first paragraph
- Use short paragraphs (2-4 sentences)
- Include relevant subheadings (H2, H3)
- Add images every 3-4 paragraphs
- End with a conclusion and call-to-action

**SEO:**
- Include target keyword in title
- Use keyword naturally in first paragraph
- Add keyword to a few headings
- Write compelling meta description
- Use descriptive alt text for images

**Formatting:**
- Break up text with headings
- Use bullet points for lists
- Bold important points
- Add relevant internal links
- Include external sources when citing

**Images:**
- Use high-quality images
- Compress images before uploading
- Always add descriptive alt text
- Include captions when helpful
- Featured image should be eye-catching

### Scheduling Posts

To schedule a post for future publication:

1. Fill in all required fields
2. Set **"Published At"** to future date/time
3. Click **"Publish"**
4. Post will automatically go live at scheduled time

### Managing Categories

Categories help organize blog content:

1. Click **"Categories"** in sidebar
2. Create new category or edit existing
3. Add title, slug, and description
4. Use categories consistently across posts
5. 5-10 categories is ideal (avoid too many)

## Managing Authors

If you have permission to manage authors:

### Creating an Author

1. Click **"Authors"** in sidebar
2. Click **"+"** button
3. Fill in fields:
   - **Name**: Author's full name
   - **Slug**: URL-friendly identifier
   - **Image**: Headshot photo (400x400px square)
   - **Bio**: 2-3 sentence biography
   - **Social Links**: Twitter, LinkedIn, GitHub URLs
4. Click **"Publish"**

### Assigning Authors to Posts

1. Open or create a blog post
2. Scroll to **"Author"** field
3. Click and search for author
4. Select from dropdown
5. Author info will display on the published post

## Site Settings

Some users may have access to global site settings. Be careful when editing these as they affect the entire site.

### Editing Site Settings

1. Click **"Site Settings"** in sidebar
2. Edit fields carefully:
   - **Site Title**: Main site name
   - **Description**: Default site description
   - **Logo**: Upload site logo
   - **Contact Email**: Primary contact address
   - **Social Links**: Company social profiles
   - **Footer Sections**: Footer navigation links
3. Click **"Publish"** to save changes

## Image Best Practices

### Image Sizes

Different areas of the site require different image sizes:

- **Hero Backgrounds**: 1920x1080px (landscape)
- **Blog Featured Images**: 1200x675px (16:9 ratio)
- **Open Graph Images**: 1200x630px (social sharing)
- **Logos**: 400x200px (landscape) or 200x200px (square)
- **Author Photos**: 400x400px (square)
- **Section Images**: 800x600px or larger

### Image Optimization

Before uploading images:

1. **Resize** to appropriate dimensions
2. **Compress** to reduce file size (use tools like TinyPNG)
3. **Format**: Use JPG for photos, PNG for logos/graphics
4. **File Size**: Keep under 500KB when possible

### Alt Text

Always add alt text to images:

- Describe what's in the image
- Keep it concise (10-15 words)
- Include relevant keywords naturally
- Don't start with "Image of..." or "Picture of..."

**Example Alt Texts:**
- ❌ "Image of a team"
- ✅ "Marketing team collaborating in office meeting room"

## Publishing Workflow

### Draft → Review → Publish

1. **Create Draft**:
   - Work on content without publishing
   - Changes are saved but not live
   - Document shows "Draft" badge

2. **Request Review** (if applicable):
   - Click three-dot menu (⋯)
   - Select "Request review" (if configured)
   - Assign reviewer

3. **Publish**:
   - Click **"Publish"** button
   - Changes go live immediately
   - Document shows "Published" status

### Editing Published Content

1. Open published document
2. Make changes
3. Click **"Publish"** again to update live content
4. Changes appear on site immediately (may take 1-2 minutes for cache)

### Unpublishing Content

To remove content from live site:

1. Open document
2. Click three-dot menu (⋯)
3. Select **"Unpublish"**
4. Content is saved as draft but not visible on site

## Previewing Changes

### Live Preview (if configured)

Some projects include live preview:

1. Make changes in Studio
2. Look at preview pane (right side)
3. See how content will appear
4. Click link to open full preview

### Manual Preview

1. Publish your changes
2. Navigate to the page on the live site
3. Review how it looks
4. Return to Studio to make adjustments if needed

## Common Tasks

### Updating Homepage

1. Go to **Pages**
2. Find "Home" page
3. Edit sections as needed
4. Publish changes

### Adding a New Blog Post

1. Go to **Blog Posts**
2. Click **"+"**
3. Fill in all required fields
4. Add content with rich text editor
5. Select author and categories
6. Publish or schedule

### Changing Footer Links

1. Go to **Site Settings**
2. Scroll to **Footer Sections**
3. Edit existing sections or add new
4. Publish changes

### Updating SEO for a Page

1. Open the page
2. Scroll to SEO fields
3. Update **SEO Title** and **SEO Description**
4. Add **Open Graph Image** if needed
5. Publish changes

## Troubleshooting

### Changes Not Appearing

**Issue**: Published changes don't show on site

**Solutions:**
- Wait 1-2 minutes for cache to clear
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache
- Contact developer if issue persists

### Can't Upload Image

**Issue**: Image upload fails

**Solutions:**
- Check file size (should be under 10MB)
- Use JPG or PNG format
- Compress image before uploading
- Check internet connection
- Try different browser

### Lost Work

**Issue**: Changes disappeared

**Solutions:**
- Check if document is still in draft state
- Use revision history (three-dot menu → "Review changes")
- Check if working on correct document
- Contact admin if issue persists

### Can't Find Document

**Issue**: Can't locate a page or post

**Solutions:**
- Use search bar at top
- Check if it's been unpublished
- Look in different content type section
- Check filters (published/drafts)

### Permission Denied

**Issue**: Can't edit certain content

**Solutions:**
- Check your user role and permissions
- You may not have access to certain content types
- Contact project administrator
- Site Settings typically require admin access

## Getting Help

If you need assistance:

1. **Check this guide** for common tasks
2. **Review tooltips** in Studio (hover over field labels)
3. **Contact your team's developer** for technical issues
4. **Contact project admin** for permission issues
5. **Sanity Support**: [https://www.sanity.io/help](https://www.sanity.io/help)

## Quick Reference

### Keyboard Shortcuts

- **Publish**: Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows)
- **Bold**: Cmd+B (Mac) or Ctrl+B (Windows)
- **Italic**: Cmd+I (Mac) or Ctrl+I (Windows)
- **Save Draft**: Cmd+S (Mac) or Ctrl+S (Windows)

### Content Checklists

**Before Publishing a Page:**
- ✅ Title is clear and descriptive
- ✅ SEO title and description filled in
- ✅ Sections are in correct order
- ✅ All images have alt text
- ✅ CTAs have clear, action-oriented text
- ✅ No placeholder text remains
- ✅ Reviewed on preview/staging site

**Before Publishing a Blog Post:**
- ✅ Compelling headline
- ✅ Strong opening paragraph
- ✅ Proper headings (H2, H3) throughout
- ✅ Featured image added with alt text
- ✅ Author and categories selected
- ✅ Internal and external links included
- ✅ Excerpt written
- ✅ SEO fields completed
- ✅ Proofread for spelling/grammar

## Resources

- [Content Model Documentation](./content-model.md)
- [Architecture Overview](./architecture.md)
- [Sanity Studio Documentation](https://www.sanity.io/docs/sanity-studio)
- [Block Content Guide](https://www.sanity.io/docs/block-content)
