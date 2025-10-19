# Gain Tax Calculator – Project Overview

This repository powers the Gain Tax Calculator marketing site and product funnel. It is built with Next.js (App Router) and ships with the following:

- Centralized configuration for site and SEO settings (`src/config/site.ts`, `src/config/seo.ts`)
- Automated metadata, structured data, sitemap, and robots generation
- Reusable homepage sections (Hero, feature grid, CTA, quick links)
- Markdown/MDX blog support with optional SEO overrides and structured data
- A preflight script (`npm run preflight`) to catch common launch mistakes
- Localization scaffolding (`src/content/locales/*.json`) prepared for future locales

## Getting Started

```bash
npm install
npm run dev
```

## Customization Checklist

1. **Site basics** – update `src/config/site.ts`
   - `domain`, `contactEmail`
   - `announcement` banner content
   - Navigation and footer links
2. **SEO** – update `src/config/seo.ts`
   - `title` and `description` for every page key
   - Structured data, sitemap, and robots configuration
3. **Homepage content** – edit `src/content/home-sections.ts`
   - Copy comes from `src/content/locales/*.json`
   - Add locales in `siteConfig.supportedLocales` if you need translations
4. **Assets** – replace OG images, hero graphics, and other static assets in `public/images`
5. **Blog posts** – add Markdown/MDX files under `content/posts` (see `content/posts/README.txt`)

## Preflight Checks

Run the following command to identify missing configuration (domain, email, blog content, etc.):

```bash
npm run preflight
```

The script reports blocking issues and follow-up suggestions so you can address them before deployment.

## Project Structure

```
app/                    # App Router entry points (home, blog, legal pages, sitemap/robots)
content/                # Marketing copy and homepage section configuration
public/                 # Static assets and default OG image
scripts/preflight.mjs   # Pre-deployment checklist script
src/config/             # Site and SEO configuration
src/content/locales/    # Default locale dictionary (expand for additional locales)
src/features/layout/    # Header, footer, breadcrumbs, layout components
src/features/sections/  # Reusable sections (Hero, features, CTA, etc.)
src/features/blog/      # Blog listing and article components
src/lib/                # Utilities (blog parsing, i18n helpers)
```

## Deployment Checklist

1. Replace the domain, email address, and social links
2. Refresh SEO configuration and OG imagery
3. Finalize homepage copy, sections, and imagery
4. Import blog posts and confirm frontmatter values
5. Run `npm run preflight`
6. Run `npm run build`
7. Deploy to Vercel or your hosting provider of choice

Extend the project by adding new sections, forms, or integrating a CMS inside `src/features` as needed.
