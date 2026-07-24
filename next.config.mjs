/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60
  },
  async redirects() {
    return [
      {
        source: '/privacy-policy',
        destination: '/privacy',
        permanent: true
      },
      {
        source: '/terms-of-service',
        destination: '/terms',
        permanent: true
      },
      {
        source: '/blog/2025-federal-capital-gains-update',
        destination: '/blog/2026-federal-capital-gains-update',
        permanent: true
      },
      {
        source: '/calculator/capital-gains-estimate',
        destination: '/calculator/capital-gains',
        permanent: true
      },
      {
        source: '/blog/category/:category*',
        destination: '/blog',
        permanent: false
      },
      {
        source: '/blog/tag/:tag*',
        destination: '/',
        permanent: true
      },
      {
        source: '/blog',
        has: [{ type: 'query', key: 'tag' }],
        destination: '/blog',
        permanent: true
      }
    ];
  }
};

export default nextConfig;
