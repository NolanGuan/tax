export interface LinkTarget {
  label: string;
  href: string;
  external?: boolean;
}

export interface HeroSectionConfig {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  alignment?: 'left' | 'center';
  supportText?: string;
  primaryCta?: LinkTarget;
  secondaryCta?: LinkTarget;
  image?: {
    src: string;
    alt: string;
  };
  badges?: string[];
}

export interface FeatureItem {
  title: string;
  description: string;
  icon?: string;
}

export interface FeatureGridConfig {
  title: string;
  description?: string;
  items: FeatureItem[];
  columns?: 2 | 3;
}

export interface LinkListConfig {
  title: string;
  description?: string;
  links: LinkTarget[];
  variant?: 'pill' | 'simple';
}

export interface CtaBannerConfig {
  title: string;
  description?: string;
  primaryCta: LinkTarget;
  secondaryCta?: LinkTarget;
  background?: 'light' | 'dark';
}
