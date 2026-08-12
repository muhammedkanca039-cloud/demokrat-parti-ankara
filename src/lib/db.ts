import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

function resolveDatabaseUrl(): string {
  const isVercel = process.env.VERCEL === '1';

  if (!isVercel) {
    return process.env.DATABASE_URL ?? 'file:./dev.db';
  }

  const tmpDbPath = '/tmp/dev.db';

  if (!fs.existsSync(tmpDbPath)) {
    const candidateSources = [
      path.join(process.cwd(), 'prisma', 'dev.db'),
      path.join('/var/task', 'prisma', 'dev.db'),
    ];

    const sourcePath = candidateSources.find((candidate) => fs.existsSync(candidate));

    if (!sourcePath) {
      throw new Error(
        `SQLite veritabani dosyasi bulunamadi. Denenen yollar: ${candidateSources.join(', ')}`,
      );
    }

    fs.copyFileSync(sourcePath, tmpDbPath);
  }

  return `file:${tmpDbPath}`;
}

process.env.DATABASE_URL = resolveDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: { url: process.env.DATABASE_URL },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

globalForPrisma.prisma = db;
