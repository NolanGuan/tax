# Umamusume Guide – Launch Template

适合快速搭建 Umamusume / Pretty Derby 相关站点的 Next.js 模板，开箱即用地提供：

- ✅ 集中化站点配置（`src/config/site.ts`、`src/config/seo.ts`）
- ✅ SEO 元数据、结构化数据与 sitemap/robots 自动化
- ✅ 首页可复用 Section（Hero、功能亮点、CTA、快捷链接）
- ✅ Markdown/MDX 博客，支持 frontmatter SEO 字段与结构化数据
- ✅ 预上线检查脚本 `npm run preflight`
- ✅ 多语言准备（`src/content/locales/*` + 简易翻译工具）

## 快速开始

```bash
npm install
npm run dev
```

## 自定义流程

1. **站点基础** – 更新 `src/config/site.ts`
   - `domain` / `contactEmail`
   - 顶部公告栏 `announcement`
   - 导航、页脚链接
2. **SEO 配置** – 更新 `src/config/seo.ts`
   - 每个页面的 `title`、`description`、`keywords`
   - 结构化数据、sitemap 与 robots 设置
3. **首页内容** – 编辑 `src/content/home-sections.ts`
   - 文案来自 `src/content/locales/*.json`
   - 如需多语言，可在 `siteConfig.supportedLocales` 中追加语言，扩充 locale JSON
4. **资源替换** – 更新 `public/images` 下的 OG 图、Hero 图等素材
5. **博客文章** – 在 `content/posts` 中撰写 Markdown／MDX（参阅 `content/posts/README.txt`）

## 预上线检查

运行以下命令快速检测常见疏漏（默认域名、邮箱、缺少文章等）：

```bash
npm run preflight
```

脚本会在发现风险项时给出提示，确保上线前完成必要调整。

## 架构说明

```
app/                    # App Router 路由（首页、博客、法律页、sitemap/robots）
content/                # 文案与首页 Section 配置
public/                 # 静态资源与默认 OG 图片
scripts/preflight.mjs   # 预检查脚本
src/config/             # 站点与 SEO 配置
src/content/locales/    # 默认语言包，可扩展多语言
src/features/layout/    # 头部、页脚、布局、公告栏、面包屑
src/features/sections/  # Hero/Features/CTA 等可复用模块
src/features/blog/      # 博客列表与文章页组件
src/lib/                # 实用工具（博客解析、i18n）
```

## 部署建议 Checklist

1. 替换域名、邮箱、社交链接
2. 更新 SEO 配置与 OG 图
3. 补齐首页与 Section 文案、图片
4. 导入博客文章，检查 frontmatter
5. 运行 `npm run preflight`
6. `npm run build`
7. 部署到 Vercel/自托管环境

如需进一步扩展（更多 Section、表单、CMS 接入等），可在 `src/features` 中按模块新增即可。
