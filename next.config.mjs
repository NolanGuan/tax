/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
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
