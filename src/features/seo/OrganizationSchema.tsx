import { siteConfig } from '@/config/site';
import { StructuredData } from './StructuredData';

export function OrganizationSchema() {
  const orgData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: `https://${siteConfig.domain}`,
    email: siteConfig.contactEmail,
    sameAs: [siteConfig.social.github, siteConfig.social.twitter].filter(Boolean),
    logo: siteConfig.defaultOgImage.startsWith('http')
      ? siteConfig.defaultOgImage
      : `https://${siteConfig.domain}${siteConfig.defaultOgImage}`
  };

  return <StructuredData data={orgData} id="organization-schema" />;
}
