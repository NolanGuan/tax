import { siteConfig } from '@/config/site';
import { StructuredData } from './StructuredData';

export function OrganizationSchema() {
  const sameAs = [siteConfig.social.github, siteConfig.social.twitter].filter(Boolean);
  const orgData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: `https://${siteConfig.domain}`,
    email: siteConfig.contactEmail,
    ...(sameAs.length ? { sameAs } : {}),
    logo: siteConfig.logoImage.startsWith('http')
      ? siteConfig.logoImage
      : `https://${siteConfig.domain}${siteConfig.logoImage}`
  };

  return <StructuredData data={orgData} id="organization-schema" />;
}
