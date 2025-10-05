/**
 * 站点基础配置
 *
 * 上线前请务必确认以下字段：
 * - domain：部署使用的主域名（用于生成 canonical / sitemap）
 * - contactEmail：对外联系邮箱
 * - announcement：页面顶部公告，可设为 null 关闭
 * - nav / footer：导航与页脚链接
 */

export interface NavItem {
  label: string;
  href: string;
}

export interface FooterConfig {
  about: string;
  copyright: string;
  links?: NavItem[];
  resources?: NavItem[];
}

export interface SiteConfig {
  name: string;
  tagline: string;
  nav: NavItem[];
  footer: FooterConfig;
  contactEmail: string;
  social: {
    github: string;
    twitter: string;
  };
  domain: string;
  defaultOgImage: string;
  announcement?: {
    message: string;
    href?: string;
    label?: string;
  };
  defaultLocale: string;
  supportedLocales: string[];
}

export const siteConfig: SiteConfig = {
  name: 'Umamusume Guide',
  tagline: 'Complete guide to training, racing and winning in Umamusume: Pretty Derby.',
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' }
  ],
  footer: {
    about: 'Complete guide to training, racing and winning in Umamusume: Pretty Derby. Built for trainers who want to succeed.',
    copyright: '© 2025 Umamusume Guide. All rights reserved.',
    links: [
      { label: 'Deployment checklist', href: '/terms' },
      { label: 'Privacy policy', href: '/privacy' },
      { label: 'Blog overview', href: '/blog' }
    ],
    resources: [
      { label: 'Project repository', href: 'https://github.com/umamusume-guide' },
      { label: 'Strategy updates', href: '/blog' }
    ]
  },
  contactEmail: 'hello@umamusume-guide.com',
  social: {
    github: 'https://github.com/umamusume-guide',
    twitter: 'https://twitter.com/umamusume_guide'
  },
  domain: 'umamusume-guide.com',
  defaultOgImage: '/images/og-default.jpg',
  announcement: {
    message: 'Launching a new Umamusume project? Follow the deployment checklist before going live.',
    href: '/terms',
    label: 'View checklist'
  },
  defaultLocale: 'en',
  supportedLocales: ['en']
};
