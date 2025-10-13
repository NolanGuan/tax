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
  title: 'About CPMCalculation',
  lastUpdated: 'Last updated: January 2025',
  intro: {
    heading: 'Your professional CPM calculation resource',
    paragraphs: [
      'CPMCalculation exists to make digital advertising ROI analysis simple and accessible. Whether you are planning your first campaign or optimizing multi-channel ad spend, we provide the tools and insights you need in one place.',
      'The project started as a simple calculator for marketers, then grew into a comprehensive platform offering advanced CPM analysis, campaign optimization tools, and industry benchmarks that evolve with the digital advertising landscape.'
    ]
  },
  mission: {
    heading: 'Built by marketers, updated with industry trends',
    paragraphs: [
      'We monitor advertising platform changes, new targeting options, and performance metrics so you can focus on creating effective campaigns rather than recalculating everything.',
      'Every calculation method and insight is reviewed by digital marketing professionals before implementation. Accuracy matters when you are investing your advertising budget.'
    ]
  },
  features: {
    title: 'What you will find',
    items: [
      {
        icon: '🧮',
        title: 'CPM Calculator',
        description: 'Instantly calculate cost per mille, CPM, and other key advertising metrics with our professional-grade calculator tools.'
      },
      {
        icon: '📊',
        title: 'Campaign Analytics',
        description: 'Analyze your advertising performance across different platforms and optimize your spending for maximum ROI.'
      },
      {
        icon: '💡',
        title: 'Marketing Insights',
        description: 'Expert guides on digital advertising strategies, CPM optimization techniques, and industry best practices.'
      }
    ]
  },
  contact: {
    title: 'Stay in touch',
    description: 'Send feedback, report calculation issues, or suggest new features—every input helps improve the tools for the entire marketing community.',
    github: { label: 'View the repo on GitHub', href: 'https://github.com/cpmcalculation' },
    emailLabel: 'hello@cpmcalculation.com'
  }
};

export function getAboutContent(): AboutContent {
  return aboutContent;
}
