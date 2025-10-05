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
  title: 'About Umamusume Guide',
  lastUpdated: 'Last updated: January 2025',
  intro: {
    heading: 'Your complete training resource',
    paragraphs: [
      'Umamusume Guide exists to make raising champion horse girls less intimidating. Whether you are tackling your first campaign or optimising final times, we collect the best community knowledge in one place.',
      'The project started as a personal notebook, then grew into a public guide that documents proven builds, training checkpoints, and race strategies that keep working as the meta evolves.'
    ]
  },
  mission: {
    heading: 'Built by players, updated with every patch',
    paragraphs: [
      'We watch balance updates, new support cards, and event mechanics so you do not have to relearn everything from scratch.',
      'Every article is peer-reviewed by volunteer trainers before it goes live. Accuracy matters when you are investing days into perfect runs.'
    ]
  },
  features: {
    title: 'What you will find',
    items: [
      {
        icon: '📚',
        title: 'Training frameworks',
        description: 'Step-by-step seasonal playbooks that keep moods high, stats balanced, and motivation streaks intact.'
      },
      {
        icon: '🏁',
        title: 'Race breakdowns',
        description: 'Distance, pace, and skill callouts for every major cup so you line up with confidence.'
      },
      {
        icon: '💡',
        title: 'Tools & calculators',
        description: 'Lightweight helpers for skill score planning, inheritance previews, and resource budgeting.'
      }
    ]
  },
  contact: {
    title: 'Stay in touch',
    description: 'Send feedback, report mistakes, or propose new topics—everything helps the next trainer succeed.',
    github: { label: 'View the repo on GitHub', href: 'https://github.com/umamusume-guide' },
    emailLabel: 'hello@umamusume-guide.com'
  }
};

export function getAboutContent(): AboutContent {
  return aboutContent;
}
