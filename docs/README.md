# Documentation

This directory contains comprehensive guides for developers and content editors working with this Next.js + Sanity CMS application.

## For Developers

### Getting Started
1. Read the main [README.md](../README.md) for quick start instructions
2. Follow [setup-and-testing.md](./setup-and-testing.md) to configure your environment and run smoke tests
3. Review [architecture.md](./architecture.md) to understand the system design
4. Consult [operations.md](./operations.md) for deployment and maintenance

### Technical Documentation

**[setup-and-testing.md](./setup-and-testing.md)**
- Local environment prerequisites
- `.env.local` template and variable reference
- Running Next.js and Sanity Studio in development
- Frontend/backend smoke tests and troubleshooting tips

**[architecture.md](./architecture.md)**
- Complete technical overview
- Data flow diagrams
- Section renderer implementation
- Server vs. client components
- SEO and performance optimization
- Testing strategies

**[operations.md](./operations.md)**
- Deployment guides (Vercel, Sanity)
- Environment configuration
- DNS and domain setup
- Monitoring and logging
- Backup strategies
- Security best practices
- Performance optimization
- Troubleshooting

**[contact-workflow.md](./contact-workflow.md)**
- Contact form implementation
- Email integration (Resend, SMTP)
- Spam protection techniques
- Rate limiting
- Testing and troubleshooting

**[content-model.md](./content-model.md)**
- Complete Sanity schema reference
- Field descriptions and validation
- Section types documentation
- Block content guide
- Content organization patterns

## For Content Editors

**[editing-guide.md](./editing-guide.md)**
- How to access Sanity Studio
- Creating and editing pages
- Working with sections
- Managing blog posts
- Image best practices
- SEO optimization tips
- Common tasks and workflows
- Troubleshooting

## Quick Reference

### Common Tasks

**Developers:**
- Deploy to production: See [operations.md#deployment](./operations.md#deployment)
- Add new section type: See [architecture.md#section-renderer](./architecture.md#section-renderer)
- Configure email: See [contact-workflow.md#email-integration](./contact-workflow.md#email-integration)
- Set up monitoring: See [operations.md#monitoring--logging](./operations.md#monitoring--logging)

**Content Editors:**
- Create a new page: See [editing-guide.md#creating-a-new-page](./editing-guide.md#creating-a-new-page)
- Write a blog post: See [editing-guide.md#creating--editing-blog-posts](./editing-guide.md#creating--editing-blog-posts)
- Add sections: See [editing-guide.md#working-with-sections](./editing-guide.md#working-with-sections)
- Optimize images: See [editing-guide.md#image-best-practices](./editing-guide.md#image-best-practices)

## Document Structure

```
docs/
├── README.md              # This file - documentation index
├── architecture.md        # Technical architecture and implementation
├── contact-workflow.md    # Contact form and email workflow
├── content-model.md       # Sanity schemas and content types
├── editing-guide.md       # Guide for content editors
├── operations.md          # Deployment and operations guide
└── setup-and-testing.md   # Local environment setup and smoke testing
```

## Contributing to Documentation

When updating documentation:

1. Keep it up-to-date with code changes
2. Use clear, concise language
3. Include code examples where helpful
4. Add diagrams for complex concepts
5. Cross-reference related documents
6. Test all instructions before documenting
7. Update this index when adding new docs

## Getting Help

If you can't find what you're looking for:

1. Check the main [README.md](../README.md)
2. Search across all documentation files
3. Review code comments and type definitions
4. Consult official documentation:
   - [Next.js](https://nextjs.org/docs)
   - [Sanity](https://www.sanity.io/docs)
   - [Tailwind CSS](https://tailwindcss.com/docs)
5. Contact the development team

## Feedback

Found an issue or have a suggestion for improving the documentation? Please let the development team know!
