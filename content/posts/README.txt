# Blog Content

Store articles as Markdown or MDX files inside `content/posts`. Use URL-friendly filenames, for example:

```
my-post-slug.md
my-post-slug.mdx
```

## Frontmatter Template

```yaml
---
title: "Post title"
excerpt: "One-sentence summary for lists and SEO"
author: "Author name"
publishedAt: "2025-01-15"
updatedAt: "2025-01-20" # optional
coverImage: "/images/blog/my-cover.png" # optional, ideally 1200x630
featured: false
seo:
  title: "Custom SEO title"
  description: "Override excerpt when needed"
  image: "/images/blog/my-cover.png"
---
```

Write the body with standard Markdown syntax. The build step automatically generates reading time, a table of contents, and structured data.

> Run `npm run preflight` to make sure no placeholder content slips into production.
