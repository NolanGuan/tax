# Blog Content

在 `content/posts` 中通过 Markdown 或 MDX 文件管理文章。文件命名建议遵循以下规范：

```
my-post-slug.md
my-post-slug.mdx
```

## Frontmatter 模板

```yaml
---
title: "文章标题"
excerpt: "一句话摘要, 用于列表和 SEO"
author: "作者名"
publishedAt: "2025-01-15"
updatedAt: "2025-01-20" # 可选
coverImage: "/images/blog/my-cover.png" # 可选，推荐 1200x630
featured: false
seo:
  title: "自定义 SEO 标题"
  description: "可覆盖 excerpt 的 SEO 描述"
  keywords:
    - "Umamusume"
    - "Training"
  image: "/images/blog/my-cover.png"
---
```

正文可以使用标准 Markdown 语法。构建时工具会自动生成阅读时长、目录和结构化数据。

> 记得运行 `npm run preflight`，确保没有遗漏默认占位内容。
