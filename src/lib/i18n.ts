import en from '@/content/locales/en.json';
import zh from '@/content/locales/zh.json';
import { siteConfig } from '@/config/site';

type Dictionaries = {
  [locale: string]: Record<string, any>;
};

const dictionaries: Dictionaries = {
  en,
  zh
};

const defaultLocale = siteConfig.defaultLocale || 'en';

export function getAvailableLocales(): string[] {
  return siteConfig.supportedLocales.length ? siteConfig.supportedLocales : Object.keys(dictionaries);
}

export function getDictionary(locale: string) {
  return dictionaries[locale] ?? dictionaries[defaultLocale] ?? {};
}

export function getTranslator(locale: string) {
  const dictionary = getDictionary(locale);

  return function t(key: string, fallback?: string): string {
    const segments = key.split('.');
    let value: any = dictionary;

    for (const segment of segments) {
      value = value?.[segment];
      if (value === undefined) {
        return fallback ?? key;
      }
    }

    return typeof value === 'string' ? value : fallback ?? key;
  };
}

export function translateArray(key: string, locale: string): string[] {
  const t = getTranslator(locale);
  const dictionary = getDictionary(locale);
  const segments = key.split('.');
  let value: any = dictionary;

  for (const segment of segments) {
    value = value?.[segment];
    if (value === undefined) {
      return [];
    }
  }

  if (Array.isArray(value)) {
    return value.map((entry) => (typeof entry === 'string' ? entry : JSON.stringify(entry)));
  }

  return [];
}
