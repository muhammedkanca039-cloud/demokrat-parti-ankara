/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
    outputFileTracingIncludes: {
      '/api/**/*': [
        './prisma/dev.db',
        './node_modules/.prisma/client/**/*',
        './node_modules/@prisma/client/**/*',
      ],
    },
  },
};

export default nextConfig;
