import { siteConfig } from '@/config/site';
import { getDictionary, getTranslator } from '@/lib/i18n';
import type {
  HeroSectionConfig,
  FeatureGridConfig,
  LinkListConfig,
  CtaBannerConfig
} from '@/features/sections';

/**
 * 首页模块配置
 *
 * 通过 i18n 字典与固定链接组合生成。若需要定制不同页面结构，
 * 可以按 locale 返回不同的 Section 配置。
 */

interface HomeSections {
  hero: HeroSectionConfig;
  features: FeatureGridConfig;
  quickLinks: LinkListConfig;
  cta: CtaBannerConfig;
}

const quickLinkTargets = ['/about', '/privacy', '/blog'] as const;

export function getHomePageSections(locale: string): HomeSections {
  const t = getTranslator(locale);
  const dictionary = getDictionary(locale);

  const heroBadges: string[] = Array.isArray(dictionary.home?.hero?.badges)
    ? dictionary.home.hero.badges
    : [];

  const featureItems = Array.isArray(dictionary.home?.features?.items)
    ? dictionary.home.features.items.map((item: any) => ({
        title: item?.title ?? '',
        description: item?.description ?? ''
      }))
    : [];

  const quickLinkLabels = Array.isArray(dictionary.home?.links?.items)
    ? dictionary.home.links.items
    : [];

  return {
    hero: {
      eyebrow: t('home.hero.eyebrow'),
      title: t('home.hero.title'),
      subtitle: t('home.hero.subtitle'),
      supportText: t('home.hero.support'),
      primaryCta: {
        label: t('home.hero.primaryCta'),
        href: '/blog'
      },
      secondaryCta: {
        label: t('home.hero.secondaryCta'),
        href: '/about'
      },
      image: {
        src: '/images/hero.png',
        alt: t('home.hero.title')
      },
      badges: heroBadges
    },
    features: {
      title: t('home.features.title'),
      description: t('home.features.description'),
      items: featureItems,
      columns: 3
    },
    quickLinks: {
      title: t('home.links.title'),
      description: t('home.links.description'),
      variant: 'pill',
      links: quickLinkTargets.map((href, index) => ({
        href,
        label: quickLinkLabels[index] ?? href
      }))
    },
    cta: {
      title: t('home.cta.title'),
      description: t('home.cta.description'),
      primaryCta: {
        label: t('home.cta.primaryCta'),
        href: '/terms'
      },
      secondaryCta: {
        label: t('home.cta.secondaryCta'),
        href: siteConfig.social.github,
        external: true
      },
      background: 'dark'
    }
  };
}

export const homePageSections = getHomePageSections(siteConfig.defaultLocale);
