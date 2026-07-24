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
  lastUpdated: 'Last updated: July 24, 2026',
  intro: {
    heading: 'Why we built Gain Tax Calculator',
    paragraphs: [
      'Gain Tax Calculator exists to make capital gains planning clear long before it becomes a filing problem. Investors, homeowners, and crypto traders deserve instant answers about how a sale, swap, or relocation will change what they owe.',
      'Every module in Gain Tax Calculator uses the same published calculation engine and states the supported tax year and major assumptions.'
    ]
  },
  mission: {
    heading: 'Editorial method and calculator governance',
    paragraphs: [
      'We review IRS guidance, revenue procedures, and selected state publications when updating calculator inputs. The current federal tables cite IRS Revenue Procedure 2025-32.',
      'The Gain Tax Calculator Editorial Team maintains the calculator assumptions, source links, review dates, and correction workflow. Content is updated when a supported tax year or cited authority changes; material corrections can be reported through the Contact page.',
      'The calculators are educational estimates, not tax advice. State calculations use simplified selected rates and do not model every deduction, surcharge, local tax, residency rule, or special asset treatment.'
    ]
  },
  features: {
    title: 'How Gain Tax Calculator helps you plan',
    items: [
      {
        icon: '🧮',
        title: 'Capital gains engine',
        description: 'Estimate federal and simplified state tax across short-term and long-term holding periods with filing-status comparisons.'
      },
      {
        icon: '🏠',
        title: 'Real estate workflows',
        description: 'Model primary residence exclusions, capital improvements, and depreciation recapture with clearly stated assumptions.'
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
    github: { label: 'Read our methodology and tax-rate sources', href: '/tax-rate' },
    emailLabel: 'support@gaintaxcalculator.com'
  }
};

export function getAboutContent(): AboutContent {
  return aboutContent;
}
