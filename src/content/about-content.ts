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
  title: 'About Capital Gains Navigator',
  lastUpdated: 'Last updated: February 2025',
  intro: {
    heading: 'A planning desk for every capital gains decision',
    paragraphs: [
      'Capital Gains Navigator helps investors, homeowners, and crypto traders model the real tax impact of each transaction before they commit.',
      'We combine rigorously maintained tax data with expert-reviewed calculators so you can see the downstream effects of timing, filing status, and income shifts in minutes.'
    ]
  },
  mission: {
    heading: 'Built by tax professionals, engineered for clarity',
    paragraphs: [
      'Our CPA partners review every calculation engine update against current IRS guidance and state-level rulings.',
      'We believe transparent, source-linked tax math is essential. Every assumption is documented, and every output is designed to help you explain decisions to clients, partners, or your future self.'
    ]
  },
  features: {
    title: 'What you will find',
    items: [
      {
        icon: '🧮',
        title: 'Capital gains calculators',
        description: 'Model federal and state capital gains taxes with detailed breakdowns for short-term and long-term scenarios.'
      },
      {
        icon: '🏠',
        title: 'Real estate insights',
        description: 'Run primary residence exclusion tests, depreciation recapture calculations, and home improvement adjustments.'
      },
      {
        icon: '📊',
        title: 'Strategy playbooks',
        description: 'Follow evidence-based guides covering tax-loss harvesting, relocation planning, and sale timing comparisons.'
      }
    ]
  },
  contact: {
    title: 'Connect with the team',
    description: 'Share feedback, ask tax logic questions, or request new calculators—your input shapes our roadmap.',
    github: { label: 'View the repo on GitHub', href: 'https://github.com/capitalgainsnavigator' },
    emailLabel: 'support@capitalgainsnavigator.com'
  }
};

export function getAboutContent(): AboutContent {
  return aboutContent;
}
