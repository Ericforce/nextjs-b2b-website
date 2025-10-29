# Next.js 14 B2B Application

A modern B2B application built with Next.js 14, TypeScript, Tailwind CSS, and the App Router.

## Features

- ⚡ **Next.js 14** with App Router
- 🎨 **Tailwind CSS** with custom B2B design tokens
- 📘 **TypeScript** for type safety
- 🎯 **ESLint & Prettier** configured
- 🏗️ **Structured project** with organized folders
- 🧩 **Reusable components** (Header, Footer, Button)
- 🎨 **Custom design system** with B2B-focused colors and spacing

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Copy the environment variables:

```bash
cp .env.example .env.local
```

3. Update the environment variables in `.env.local` with your actual values.

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building

Build the application for production:

```bash
npm run build
```

### Linting

Run ESLint to check for code quality issues:

```bash
npm run lint
```

### Starting Production Server

After building, start the production server:

```bash
npm start
```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── layout.tsx      # Root layout with Header/Footer
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles and Tailwind layers
├── components/
│   ├── layout/         # Layout components (Header, Footer)
│   └── ui/             # Reusable UI components (Button, etc.)
├── data/               # Static data and mock content
├── lib/
│   └── utils/          # Utility functions
├── styles/             # Additional styles (if needed)
└── types/              # TypeScript type definitions
```

## Design Tokens

The project includes a comprehensive design system with B2B-focused tokens:

### Colors
- **Primary**: Blue palette for main actions and branding
- **Secondary**: Slate palette for text and UI elements
- **Accent**: Amber palette for highlights and CTAs
- **Neutral**: Gray palette for backgrounds and borders

### Typography
- Custom font sizes from `2xs` to `5xl`
- Inter font family for clean, professional text
- Optimized line heights for readability

### Spacing
- Extended spacing scale (18, 88, 112, 128)
- Consistent padding and margin utilities

### Components
- Pre-built button variants (primary, secondary, outline)
- Card component with soft shadows
- Custom input styles with focus states

## Environment Variables

See `.env.example` for required environment variables:

- **NEXT_PUBLIC_APP_URL**: Application base URL
- **Sanity Configuration**: CMS integration settings
- **Email Provider**: Email service configuration
- **Analytics**: Optional tracking IDs

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## License

MIT
