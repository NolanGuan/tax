export interface AboutFeature {
  icon: string;
  title: string;
  description: string;
}

export interface AboutContent {
  title: string;
  lastUpdated: string;
  intro: {
    heading: string;
    paragraphs: string[];
  };
  mission: {
    heading: string;
    paragraphs: string[];
  };
  features: {
    title: string;
    items: AboutFeature[];
  };
  contact: {
    title: string;
    description: string;
    github: { label: string; href: string };
    emailLabel: string;
  };
}

export const aboutContent: AboutContent = {
  title: 'About Gain Tax Calculator',
  lastUpdated: 'Last updated: February 2025',
  intro: {
    heading: 'Why we built Gain Tax Calculator',
    paragraphs: [
      'Gain Tax Calculator exists to make capital gains planning clear long before it becomes a filing problem. Investors, homeowners, and crypto traders deserve instant answers about how a sale, swap, or relocation will change what they owe.',
      'Every module in Gain Tax Calculator uses the same verified tax engine, so the quick estimate you run today connects seamlessly with deeper scenario planning tomorrow.'
    ]
  },
  mission: {
    heading: 'Accurate capital gains math, explained in plain language',
    paragraphs: [
      'Our tax research team monitors IRS guidance, revenue procedures, and state bulletins to keep the calculator logic current. CPAs review each release before it ships.',
      'We pair that accuracy with context. Each result is accompanied by “why” explanations, documentation links, and planning prompts so you can make confident decisions—or brief a client in minutes.'
    ]
  },
  features: {
    title: 'How Gain Tax Calculator helps you plan',
    items: [
      {
        icon: '🧮',
        title: 'Capital gains engine',
        description: 'Project federal, state, and NIIT exposure across short-term and long-term holding periods with side-by-side filing status comparisons.'
      },
      {
        icon: '🏠',
        title: 'Real estate workflows',
        description: 'Track primary residence exclusions, capital improvements, depreciation recapture, and partial-year residency moves in one report.'
      },
      {
        icon: '🧭',
        title: 'Scenario planning guidance',
        description: 'Layer in timing shifts, relocation plans, and loss harvesting to uncover the combination that lowers your total capital gain tax rate.'
      }
    ]
  },
  contact: {
    title: 'Stay in touch with the Gain Tax Calculator team',
    description: 'We roadmap new calculators and features based on user feedback. Tell us what you need next, flag data sources, or request a walkthrough of the platform.',
    github: { label: 'View the Gain Tax Calculator repo', href: 'https://github.com/gaintaxcalculator' },
    emailLabel: 'support@gaintaxcalculator.com'
  }
};

export function getAboutContent(): AboutContent {
  return aboutContent;
}
