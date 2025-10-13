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
  name: 'CPMCalculation',
  tagline: 'Free online CPM calculator for digital advertising campaigns and marketing ROI analysis.',
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Calculator', href: '/calculator' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' }
  ],
  footer: {
    about: 'Professional CPM calculator tool for digital marketers and advertisers. Calculate cost per mille, analyze campaign performance, and optimize your advertising budget.',
    copyright: '© 2025 CPMCalculation. All rights reserved.',
    links: [
      { label: 'CPM Calculator', href: '/calculator' },
      { label: 'Privacy policy', href: '/privacy' },
      { label: 'Blog overview', href: '/blog' }
    ],
    resources: [
      { label: 'Project repository', href: 'https://github.com/cpmcalculation' },
      { label: 'Marketing guides', href: '/blog' }
    ]
  },
  contactEmail: 'hello@cpmcalculation.com',
  social: {
    github: 'https://github.com/cpmcalculation',
    twitter: 'https://twitter.com/cpmcalculation'
  },
  domain: 'cpmcalculation.com',
  defaultOgImage: '/images/og-default.jpg',
  announcement: {
    message: 'New CPM calculator features added! Enhanced reporting and campaign analysis tools now available.',
    href: '/calculator',
    label: 'Try now'
  },
  defaultLocale: 'en',
  supportedLocales: ['en', 'zh']
};
