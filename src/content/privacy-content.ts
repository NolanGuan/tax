export const privacyContent = {
  title: 'Privacy policy',
  lastUpdated: 'Last updated: February 10, 2025',
  intro: {
    heading: 'We only track what keeps calculators accurate',
    paragraphs: [
      'Capital Gains Navigator does not sell user data or embed ad-tech trackers. We run the minimum logging necessary to monitor uptime and resolve bugs.',
      'Calculator inputs are processed in-memory and never stored on our servers once you leave the page.'
    ]
  },
  dataWeDoNotCollect: {
    heading: "What we don't collect",
    items: [
      'Personal profile or contact details',
      'Individual calculator inputs or uploaded files',
      'Cross-site advertising identifiers',
      'Precise geolocation data'
    ]
  },
  minimalData: {
    heading: 'What still gets logged',
    items: [
      {
        title: 'Infrastructure health metrics',
        description: 'Aggregated performance telemetry that helps us keep response times fast on all devices.'
      },
      {
        title: 'Error diagnostics',
        description: 'Anonymous stack traces captured when a page fails, automatically purged after 30 days.'
      }
    ]
  },
  contact: {
    heading: 'Need anything removed?',
    description: 'Email support@capitalgainsnavigator.com and our team will respond within two business days.'
  }
};
