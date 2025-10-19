import { siteConfig } from '@/config/site';
import { getAvailableLocales, getDictionary, getTranslator } from '@/lib/i18n';
import type {
  HeroSectionConfig,
  FeatureGridConfig,
  LinkListConfig,
  CtaBannerConfig
} from '@/features/sections';

/**
 * Home page section configuration
 *
 * Combines the i18n dictionary with fixed link targets. Add locale-specific
 * variations here if different layouts or content are required.
 */

interface HomeSections {
  hero: HeroSectionConfig;
  features: FeatureGridConfig;
  quickLinks: LinkListConfig;
  cta: CtaBannerConfig;
}

const quickLinkTargets = [
  '/calculator/capital-gains',
  '/calculator/capital-gains-estimate',
  '/guide/real-estate-capital-gains',
  '/guide/crypto-tax'
] as const;

function resolveLocale(locale: string): string {
  const available = getAvailableLocales();
  return available.includes(locale) ? locale : siteConfig.defaultLocale;
}

export function getHomePageSections(locale: string): HomeSections {
  const resolvedLocale = resolveLocale(locale);
  const t = getTranslator(resolvedLocale);
  const dictionary = getDictionary(resolvedLocale);

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
      alignment: 'left',
      eyebrow: t('home.hero.eyebrow'),
      title: t('home.hero.title'),
      subtitle: t('home.hero.subtitle'),
      supportText: t('home.hero.support'),
      primaryCta: {
        label: t('home.hero.primaryCta'),
        href: '/calculator/capital-gains-estimate'
      },
      secondaryCta: {
        label: t('home.hero.secondaryCta'),
        href: '/calculator'
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
        href: '/calculator/scenario-planner'
      },
      secondaryCta: {
        label: t('home.cta.secondaryCta'),
        href: '/guide'
      },
      background: 'dark'
    }
  };
}
