# Content Editing Guide

A comprehensive guide for marketers and content editors to manage website content using Sanity Studio.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Accessing Sanity Studio](#accessing-sanity-studio)
- [Understanding the Interface](#understanding-the-interface)
- [Adding New Pages](#adding-new-pages)
- [Managing Blog Posts](#managing-blog-posts)
- [Working with Sections](#working-with-sections)
- [Updating Navigation](#updating-navigation)
- [Media Management](#media-management)
- [Preview Mode](#preview-mode)
- [Publishing Workflow](#publishing-workflow)
- [SEO Best Practices](#seo-best-practices)
- [Tips & Tricks](#tips--tricks)
- [Common Issues](#common-issues)

## 🚀 Getting Started

### What is Sanity Studio?

Sanity Studio is your content management system (CMS) - a user-friendly interface where you can:
- Create and edit website pages
- Publish blog posts
- Update navigation menus
- Upload and manage images
- Preview changes before going live

### No Code Required!

You don't need any technical knowledge to use Sanity Studio. If you can use a word processor, you can manage your website content.

## 🔐 Accessing Sanity Studio

### Option 1: Standalone Studio

Visit your studio URL: `https://your-project.sanity.studio`

### Option 2: Embedded Studio

If the studio is embedded in your website, visit: `https://your-website.com/studio`

### Login

1. Click **"Sign In"**
2. Use your authorized email address
3. Authenticate via email, Google, or GitHub (as configured by your admin)

### First-Time Setup

If this is your first time logging in:
1. Check your email for an invitation link
2. Click the link to activate your account
3. Choose your preferred sign-in method
4. You're ready to start editing!

## 🎨 Understanding the Interface

### Main Navigation (Left Sidebar)

The sidebar shows all content types available:

- **📄 Pages** - Website pages (Home, About, Contact, etc.)
- **📝 Posts** - Blog articles
- **🧩 Sections** - Reusable content blocks
- **🔗 Navigation** - Menu items and site navigation
- **⚙️ Settings** - Global site settings (footer, SEO, etc.)
- **🖼️ Media** - Image and file library

### Content List (Middle Panel)

Shows all documents of the selected type:
- **Search bar** at the top to find content quickly
- **Filter options** to sort by date, status, or category
- **Create button** (usually "+ Create new") to add content

### Editor (Right Panel)

Where you edit the selected document:
- **Title and fields** for entering content
- **Publish button** (green) to make changes live
- **Preview button** to see before publishing
- **More options menu** (⋮) for additional actions

## 📄 Adding New Pages

### Step 1: Create a New Page

1. Click **"Pages"** in the left sidebar
2. Click **"+ Create new page"** button
3. You'll see a blank page editor

### Step 2: Fill in Page Details

#### Basic Information

- **Title** (required): The page name (e.g., "About Us")
- **Slug** (required): URL-friendly version (e.g., "about-us")
  - Auto-generates from title
  - Can be manually edited
  - Result: `yourwebsite.com/about-us`

#### SEO Settings

- **Meta Title**: Title that appears in search results (50-60 characters)
- **Meta Description**: Description in search results (150-160 characters)
- **Open Graph Image**: Image shown when shared on social media

### Step 3: Add Content Sections

Pages are built using flexible content sections:

#### Hero Section
Large banner at the top of the page
- **Heading**: Main headline
- **Subheading**: Supporting text
- **Background Image**: Visual backdrop
- **Call-to-Action Button**: Link text and URL

#### Text Block
Standard content section
- **Heading**: Section title
- **Body Text**: Rich text editor (formatting, links, lists)
- **Alignment**: Left, center, or right

#### Image Section
Display images with captions
- **Upload Image**: Drag and drop or browse
- **Caption**: Descriptive text below image
- **Alt Text**: For accessibility and SEO

#### Two-Column Layout
Side-by-side content
- **Left Column**: Text or image
- **Right Column**: Text or image
- **Responsive**: Stacks on mobile devices

#### Call-to-Action (CTA)
Highlight important actions
- **Title**: What you want visitors to do
- **Description**: Supporting information
- **Button Text**: Action label (e.g., "Get Started")
- **Button Link**: Where it leads

#### FAQ Section
Question and answer format
- **Add Items**: Click "+ Add FAQ item"
- **Question**: The question visitors might ask
- **Answer**: Rich text answer

### Step 4: Preview Your Page

1. Click the **"Preview"** button (👁️ eye icon)
2. Your page opens in a new tab
3. Check layout, text, and images
4. Return to editor to make adjustments

### Step 5: Publish

1. Review all content for accuracy
2. Check spelling and formatting
3. Click **"Publish"** (green button)
4. Your page is now live!

## 📝 Managing Blog Posts

### Creating a Blog Post

1. Click **"Posts"** in the sidebar
2. Click **"+ Create new post"**

### Post Fields

#### Essential Fields

- **Title**: Post headline (engaging and descriptive)
- **Slug**: URL path (auto-generated from title)
- **Author**: Select from author list
- **Published Date**: When the post goes live
- **Featured Image**: Main post image
- **Excerpt**: Short summary (2-3 sentences)
- **Category**: Select relevant category
- **Tags**: Add relevant keywords

#### Content

Use the rich text editor to write your post:

**Formatting Options:**
- **Bold**: Highlight important text
- **Italic**: Emphasize words
- **Headings**: Structure your content (H2, H3, H4)
- **Lists**: Bulleted or numbered
- **Links**: Add internal or external links
- **Images**: Insert inline images
- **Code blocks**: For technical content
- **Quotes**: Highlight testimonials or quotes

**Writing Tips:**
- Start with a compelling introduction
- Use headings to break up content
- Keep paragraphs short (3-4 sentences)
- Include relevant images
- End with a call-to-action

### Post Status

Posts can have different states:

- **Draft**: Work in progress (not visible on site)
- **Published**: Live on the website
- **Scheduled**: Will publish at a future date

### Scheduling Posts

1. Write your post
2. Set the **"Published Date"** to a future date
3. Click **"Publish"**
4. Post will automatically go live at the scheduled time

### Updating Published Posts

1. Find the post in the Posts list
2. Click to open
3. Make your changes
4. Click **"Publish"** to update

**Note**: Changes appear on the website within 60 seconds (or instantly if webhooks are configured).

### Unpublishing Posts

To remove a post from the site:

1. Open the post
2. Click the **"⋮"** menu (top right)
3. Select **"Unpublish"**
4. Confirm

## 🧩 Working with Sections

Sections are reusable content blocks that can appear on multiple pages.

### Types of Sections

- **Announcement Bar**: Sitewide messages (promotions, news)
- **Feature Grid**: Showcase features or services
- **Testimonials**: Customer reviews
- **Team Section**: Team member profiles
- **Partner Logos**: Company/partner logo grid
- **Newsletter Signup**: Email capture form

### Creating a Reusable Section

1. Click **"Sections"** in sidebar
2. Click **"+ Create new section"**
3. Choose section type
4. Fill in content
5. Give it a memorable name
6. Click **"Publish"**

### Using Sections on Pages

1. Edit a page
2. Scroll to **"Content Sections"**
3. Click **"+ Add section"**
4. Choose **"Reference Section"**
5. Select your saved section
6. Save the page

**Benefits:**
- Update once, changes everywhere
- Consistent branding
- Faster page creation

## 🔗 Updating Navigation

### Main Menu

1. Click **"Navigation"** in sidebar
2. Open **"Main Navigation"** document

#### Adding Menu Items

1. Click **"+ Add menu item"**
2. Fill in:
   - **Label**: Text shown in menu (e.g., "About")
   - **Link Type**: Choose page type
   - **Page**: Select destination page
3. **Drag to reorder** items
4. Click **"Publish"**

#### Dropdown Menus

For submenus:
1. Add a menu item
2. Enable **"Has submenu"**
3. Click **"+ Add submenu item"**
4. Fill in submenu details
5. Nest multiple levels if needed

### Footer Menu

Similar process for footer links:
1. Open **"Footer Navigation"**
2. Add items by section:
   - Company links
   - Product links
   - Support links
   - Social media

### Mobile Menu

The mobile menu typically uses the same main navigation but displays differently on small screens.

## 🖼️ Media Management

### Uploading Images

1. Click **"Media"** or use upload in any image field
2. **Drag and drop** files or **click to browse**
3. Supports: JPG, PNG, SVG, GIF
4. Max file size: 10MB (recommended: under 2MB)

### Best Practices

#### Image Sizes

- **Hero images**: 1920x1080px
- **Featured images**: 1200x630px
- **Thumbnails**: 400x300px
- **Logo**: 500x500px (SVG preferred)

#### Image Optimization

Before uploading:
1. Resize to appropriate dimensions
2. Compress using tools like TinyPNG or Squoosh
3. Use descriptive file names (e.g., `team-photo-2024.jpg`)

### Alt Text

Always add alt text for accessibility:
- Describe the image content
- Keep it under 125 characters
- Don't start with "Image of..."
- Be specific and descriptive

**Good**: "Team celebrating product launch in office"
**Bad**: "Image" or "IMG_1234"

### Organizing Media

- Use clear, descriptive file names
- Delete unused images to save space
- Create consistent naming conventions

## 👁️ Preview Mode

Preview changes before publishing them live.

### How to Preview

1. Make changes to any document
2. Click **"Preview"** button (don't publish yet)
3. View the draft version on your website

### Preview URL

Preview links look like:
```
https://yourwebsite.com/api/preview?secret=xxx&slug=/your-page
```

### Sharing Previews

To share unpublished content with teammates:
1. Click **"Preview"**
2. Copy the preview URL
3. Share the link (requires authentication)

### Exiting Preview Mode

When viewing previews, you'll see a banner:
**"Preview Mode Active"** with an **"Exit Preview"** button

## 📤 Publishing Workflow

### Standard Workflow

1. **Create/Edit** content in Sanity Studio
2. **Review** for accuracy and quality
3. **Preview** to check appearance
4. **Publish** to make live
5. **Verify** on the actual website

### Content Review Process

**Before Publishing, Check:**
- [ ] Spelling and grammar
- [ ] All links work correctly
- [ ] Images load and display properly
- [ ] SEO fields are filled
- [ ] Mobile preview looks good
- [ ] Content matches brand guidelines

### Collaboration

#### Leaving Comments

Some fields support comments:
1. Highlight text
2. Click comment icon
3. Leave feedback for teammates

#### Version History

View previous versions:
1. Click **"History"** button (clock icon)
2. See all changes with timestamps
3. Compare versions
4. Restore previous version if needed

## 🔍 SEO Best Practices

### Page Titles

- Keep under 60 characters
- Include main keyword
- Make it compelling
- Unique for each page

**Good**: "Expert Web Design Services | Your Company"
**Bad**: "Home"

### Meta Descriptions

- 150-160 characters
- Include call-to-action
- Summarize page content
- Use active voice

**Good**: "Transform your online presence with our award-winning web design services. Get a free consultation today!"
**Bad**: "This is our website about web design"

### URLs (Slugs)

- Keep short and readable
- Use hyphens, not underscores
- Include target keyword
- Avoid special characters

**Good**: `/services/web-design`
**Bad**: `/page?id=123&type=service`

### Images

- Use descriptive file names
- Add alt text
- Compress for fast loading
- Include captions when relevant

### Headings

- One H1 per page (usually the page title)
- Use H2 for main sections
- Use H3 for subsections
- Create logical hierarchy

### Internal Linking

- Link to related pages
- Use descriptive anchor text
- Don't overdo it (2-3 per page)

## 💡 Tips & Tricks

### Keyboard Shortcuts

- **Cmd/Ctrl + S**: Save draft
- **Cmd/Ctrl + P**: Publish
- **Cmd/Ctrl + K**: Insert link
- **Cmd/Ctrl + B**: Bold text
- **Cmd/Ctrl + I**: Italic text

### Quick Edits

- Double-click any list item to edit
- Use Tab key to navigate between fields
- Copy/paste formatted text from Word (some formatting preserved)

### Bulk Operations

- Select multiple items with checkboxes
- Delete, publish, or unpublish in bulk
- Useful for managing old posts

### Search Tips

- Use quotes for exact phrases: `"summer sale"`
- Filter by date range
- Search works across all text fields

### Saving Time

- **Duplicate pages**: Use as templates for similar pages
- **Save sections**: Reuse common blocks
- **Set defaults**: Ask admin to set default values for frequently used fields

## ❗ Common Issues

### "Document not found" Error

**Cause**: The page was deleted or unpublished
**Solution**: Check trash or ask admin to restore

### Changes Not Appearing on Website

**Cause**: Cache or ISR delay
**Solutions**:
1. Wait 60 seconds and refresh
2. Do a hard refresh: Ctrl/Cmd + Shift + R
3. Clear browser cache
4. Check if webhooks are working (ask developer)

### Can't Upload Image

**Causes & Solutions**:
- **File too large**: Compress image to under 2MB
- **Wrong format**: Use JPG, PNG, or SVG
- **Connection issue**: Check internet connection

### Lost Changes

**Cause**: Didn't save or publish
**Solution**: 
- Always click "Publish" to save changes
- Check "History" for previous versions
- Set up auto-save (ask admin)

### No Permission to Edit

**Cause**: Insufficient access rights
**Solution**: Contact your admin to grant permissions

### Preview Not Working

**Causes & Solutions**:
- **Not logged in**: Sign in to Sanity
- **Secret expired**: Ask developer to refresh preview secret
- **Wrong URL**: Use the preview button in Studio

## 🎓 Learning Resources

### Video Tutorials

Ask your team admin for video walkthroughs of:
- Creating your first page
- Publishing a blog post
- Managing navigation
- Using preview mode

### Getting Help

1. **Check this guide**: Most questions are answered here
2. **Ask your team**: Reach out to colleagues who use Sanity
3. **Contact admin**: For technical issues or permission requests
4. **Sanity Documentation**: [sanity.io/docs](https://www.sanity.io/docs)

## 📞 Support

For technical issues or questions not covered in this guide:

- **Email**: [your-support-email]
- **Slack**: [your-slack-channel]
- **Developer**: [developer-contact]

---

**Happy editing! 🎉**

Remember: You can't break anything! All changes are tracked and can be reverted. Don't be afraid to experiment and learn as you go.
