/**
 * src/lib/db.ts
 *
 * Prisma veritabanı bağlantısını yöneten merkezi modül.
 *
 * Görevleri:
 * - Çalışma ortamına göre (yerel geliştirme / Vercel üretim) doğru SQLite
 *   veritabanı dosya yolunu belirler.
 * - Vercel ortamında, salt-okunur `/var/task` konumundaki dev.db dosyasını
 *   yazılabilir `/tmp` dizinine kopyalar; böylece Prisma okuma/yazma yapabilir.
 * - Hot-reload sırasında birden fazla PrismaClient örneği oluşmasını önlemek
 *   için `globalThis` üzerinde tek bir istemci saklar (Next.js geliştirme modu
 *   güvenliği).
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

/**
 * Ortama uygun SQLite veritabanı URL'sini döndürür.
 * - Yerel geliştirme: proje kökündeki `prisma/dev.db` dosyasına mutlak yol.
 * - Vercel: `/tmp/dev.db` — gerekirse statik paketten kopyalanır.
 */
function resolveDatabaseUrl(): string {
  const isVercel = process.env.VERCEL === '1';

  if (!isVercel) {
    // Yerel geliştirme ortamında doğrudan prisma/dev.db'ye işaret et
    return `file:${path.join(process.cwd(), 'prisma', 'dev.db')}`;
  }

  // Vercel'de veritabanı dosyasının yazılabilir geçici dizindeki yolu
  const tmpDbPath = '/tmp/dev.db';

  // Geçici dizinde db yoksa, statik paketten kopyala
  if (!fs.existsSync(tmpDbPath)) {
    const candidateSources = [
      path.join(process.cwd(), 'prisma', 'dev.db'),
      path.join('/var/task', 'prisma', 'dev.db'),
    ];

    // Var olan ilk kaynak yolu bul
    const sourcePath = candidateSources.find((candidate) => fs.existsSync(candidate));

    if (!sourcePath) {
      throw new Error(
        `SQLite veritabani dosyasi bulunamadi. Denenen yollar: ${candidateSources.join(', ')}`,
      );
    }

    // Veritabanını yazılabilir geçici dizine kopyala
    fs.copyFileSync(sourcePath, tmpDbPath);
  }

  return `file:${tmpDbPath}`;
}

// DATABASE_URL ortam değişkenini çözülen URL ile ayarla (Prisma bunu okur)
process.env.DATABASE_URL = resolveDatabaseUrl();

/**
 * Next.js geliştirme modunda hot-reload sırasında birden fazla PrismaClient
 * örneği oluşmasını engellemek için global nesneye bağlanan tip tanımı.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Uygulama genelinde kullanılan tek Prisma istemci örneği.
 * Geliştirme modunda sorgu/hata/uyarı logları etkinleştirilir.
 */
export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: { url: process.env.DATABASE_URL },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// Hot-reload sonrasında mevcut istemciyi yeniden kullanmak için global'e kaydet
globalForPrisma.prisma = db;
