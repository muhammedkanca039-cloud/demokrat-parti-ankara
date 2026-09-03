/**
 * next.config.mjs
 *
 * Next.js uygulama yapılandırma dosyası.
 *
 * Yapılandırma açıklamaları:
 * - `images.remotePatterns` : Unsplash'ten uzak görsellerin yüklenmesine izin verir.
 * - `serverComponentsExternalPackages` : Prisma istemcisini sunucu bileşeni dışı paket
 *   olarak işaretler; Prisma'nın doğal (native) ikili dosyaları doğru yüklenir.
 * - `outputFileTracingIncludes` : Vercel deploy'u sırasında API route'larının SQLite
 *   veritabanı dosyası ve Prisma ikili dosyalarını pakete dahil etmesini sağlar.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // Aday fotoğrafları için Unsplash CDN'ine izin ver
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  experimental: {
    // Prisma Client'ın sunucu tarafında doğru çalışması için dışsal paket olarak işaretle
    serverComponentsExternalPackages: ['@prisma/client'],
    outputFileTracingIncludes: {
      // Tüm API route'ları için veritabanı ve Prisma dosyalarını deploy paketine ekle
      '/api/**/*': [
        './prisma/dev.db',
        './node_modules/.prisma/client/**/*',
        './node_modules/@prisma/client/**/*',
      ],
    },
  },
};

export default nextConfig;

