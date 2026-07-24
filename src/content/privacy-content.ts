export const privacyContent = {
  title: 'Privacy policy',
  lastUpdated: 'Last updated: July 24, 2026',
  intro: {
    heading: 'We only track what keeps calculators accurate',
    paragraphs: [
      'Gain Tax Calculator does not sell personal information. Optional analytics remain off until you grant consent through the privacy choices control.',
      'Calculator inputs are processed in your browser. They are not included in analytics events or stored by our application servers.'
    ]
  },
  dataWeDoNotCollect: {
    heading: "What we don't collect",
    items: [
      'Personal profile or contact details',
      'Individual calculator inputs or uploaded files',
      'Calculator transaction details',
      'Precise geolocation data'
    ]
  },
  minimalData: {
    heading: 'What still gets logged',
    items: [
      {
        title: 'Infrastructure health metrics',
        description: 'If you accept analytics, Google Analytics and Vercel Analytics may collect aggregated usage and device information to help us improve the site.'
      },
      {
        title: 'Error diagnostics',
        description: 'Your consent selection is stored in your browser so the site can remember your choice. You can change it at any time using “Privacy choices” in the footer.'
      }
    ]
  },
  contact: {
    heading: 'Need anything removed?',
    description: 'Email support@gaintaxcalculator.com with a privacy request or question.'
  }
};
