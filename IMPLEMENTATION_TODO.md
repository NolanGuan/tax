# Gain Tax Calculator — 上线 To‑Do

更新日期：2026-07-24

## 最终 SEO 复检收尾

- [x] 修复 `/blog?tag=*` 永久重定向到自身的循环。
- [x] 将旧 `/blog/tag/*` 与 `/blog/category/*` 永久重定向到 `/blog`。
- [x] 隐藏空 Reviewer，并将 Editorial Team 链接到公开编辑方法。
- [x] 为 Article JSON-LD 增加组织作者 URL，移除无依据的 “Expert” 措辞。
- [x] 分离 Organization logo 与 1200×630 社交分享图，并确保扩展名、MIME 和文件内容一致。
- [x] 持有期判断改用“一周年后的日期”，覆盖闰年边界。
- [x] 新增上述规则的自动化回归测试与 preflight 门禁。
- [x] 运行 preflight、测试、生产构建、依赖安全审计和本地生产回归。
- [x] 推送 `main` 触发 Vercel production 部署（提交 `dab07e1`）。
- [x] 线上验证重定向、21 个 sitemap URL、canonical、JSON-LD、图片 MIME、桌面/移动端和计算器。

## P0：上线阻断项

- [x] 将联邦税率与长期资本利得税档更新至 2026，并用 IRS Rev. Proc. 2025-32 校验。
- [x] 更新所支持州的 2026 简化税率、来源、适用范围和限制说明。
- [x] 删除无法证明的 CPA/CFP/CFA、人工复核和“始终准确”等表述。
- [x] 统一 Gain Tax Calculator 品牌、联系邮箱和结构化数据中的发布者身份。
- [x] 重写 Privacy 与 Terms，披露分析工具、未来 Google 广告数据使用和用户选择。
- [x] 增加 Contact 页面，并在全站页脚链接 Blog、About、Contact、Privacy、Terms。
- [x] 将分析脚本改为用户明确允许后才加载，并提供可重复打开和撤回的 Privacy choices。
- [x] 广告加载保持默认关闭；只有配置完成且通过合规门禁的页面才能加载。

## P1：SEO、抓取与可信度

- [x] 从 `robots.txt` 移除对 `/_next` 公共资源的阻止。
- [x] 将 sitemap 的部署时间 `lastmod` 改为稳定、真实的内容更新时间。
- [x] 移除失效的 GitHub/X `sameAs` 链接，使用专用 logo。
- [x] 为指南和文章提供可点击的官方来源，并更新编辑日期/复核日期。
- [x] 修正所有 2025 当前态文案；保留历史文章时明确标为历史内容。
- [x] 增加法律页和内容中心的内部链接，消除孤儿页。
- [x] 配置 `www` DNS 并永久跳转到裸域（Cloudflare DNS + Vercel 308）。

## P1：质量与安全

- [x] 修正资本利得短期/长期损益净额计算并增加边界测试。
- [x] 删除未实现的 NIIT 自动计算承诺，明确估算器限制。
- [x] 升级 Next.js 及存在 Critical/High 公告的生产依赖。
- [x] 扩展 preflight：品牌残留、年份、法律链接、robots、sitemap、广告门禁检查。
- [x] 增加 Privacy choices、导航、元数据、sitemap 和税率数据测试。

## 验收与上线

- [x] `npm run preflight` 无阻断错误。
- [x] `npm test` 全部通过。
- [x] `npm run build` 通过类型检查和生产构建。
- [x] `npm audit --omit=dev --audit-level=high` 无未接受的 Critical/High。
- [x] 本地生产模式完成桌面/移动端浏览器回归：导航、计算器、法律页、404、控制台和网络。
- [x] 推送发布分支并完成生产部署（Vercel production，提交 `2624e00`）。
- [x] 正式域名回归：HTTPS/状态码/canonical/robots/sitemap/ads.txt/内部链接/移动端/计算器。
- [x] 在 Search Console 提交 `https://gaintaxcalculator.com/sitemap.xml`，状态成功并发现 21 个网页。
- [ ] AdSense 后台人工门禁：账号唯一性、申请人资格、站点所有权、Sites 状态、Policy Center、publisher ID。
  - [x] 当前 AdSense 账号状态为“使用中”、可用产品为“内容广告”，且 `ads.txt` 的 `pub-8638451866433811` 与账号一致。
  - [x] Cloudflare、Vercel 和 Search Console 域名控制证据已验证。
  - [x] Policy Center 显示目前不存在任何问题。
  - [ ] 账号唯一性和申请人资格仍需账号所有者确认。
  - [ ] `gaintaxcalculator.com` 尚未添加到 AdSense Sites；添加/送审需所有者明确授权。
- [ ] 在 AdSense/Google Privacy & Messaging 中启用 Google 认证 CMP，并完成 EEA/UK/Swiss 同意、拒绝、管理和撤回测试。
  - [ ] 当前账号有其他网站的欧洲/美国消息，但没有覆盖 `gaintaxcalculator.com`。
  - [ ] 创建并发布该域的消息属于 AdSense 外部配置，需所有者明确授权后执行。
- [x] 在 DNS/托管平台配置 `www.gaintaxcalculator.com`，确认 HTTPS 单跳 308 到裸域。
