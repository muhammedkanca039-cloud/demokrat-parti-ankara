/**
 * src/app/api/projects/route.ts
 *
 * Seçim projeleri ve vaatleri koleksiyonu için RESTful API endpoint'leri.
 *
 * GET  /api/projects  — Tüm projeleri listeler; kategori ve ana vaat filtrelemesi desteklenir.
 * POST /api/projects  — Yeni bir proje/vaat kaydı oluşturur.
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * GET /api/projects
 *
 * Sorgu parametreleri:
 * - `category` : Kategoriye göre filtrele ("Ekonomi" | "Gençlik" | "Tarım" | vb. | "Tümü")
 * - `keyOnly`  : "true" ise yalnızca ana seçim vaatlerini (isKeyPromise=true) döndürür
 *
 * Sonuçlar önce ana vaatlere, sonra ID'ye göre artan sırada döndürülür.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const keyOnly = searchParams.get('keyOnly');

    // Dinamik filtre nesnesi — yalnızca belirtilen parametreler eklenir
    const where: any = {};
    if (category && category !== 'Tümü') {
      where.category = category;
    }
    if (keyOnly === 'true') {
      where.isKeyPromise = true; // Yalnızca ana seçim vaatlerini getir
    }

    const projects = await db.project.findMany({
      where,
      orderBy: [{ isKeyPromise: 'desc' }, { id: 'asc' }],
    });

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Projeler getirilemedi.' }, { status: 500 });
  }
}

/**
 * POST /api/projects
 *
 * Yeni bir seçim projesi/vaadi oluşturur.
 * Zorunlu alanlar: `title`, `category`, `summary`, `description`
 * İsteğe bağlı: `targetAudience`, `icon`, `isKeyPromise`
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, summary, description, targetAudience, icon, isKeyPromise } = body;

    // Zorunlu alan doğrulaması
    if (!title || !category || !summary || !description) {
      return NextResponse.json({ error: 'Zorunlu alanlar eksik.' }, { status: 400 });
    }

    const project = await db.project.create({
      data: {
        title,
        category,
        summary,
        description,
        targetAudience: targetAudience || null,
        icon: icon || 'TrendingUp', // Varsayılan Lucide ikon
        isKeyPromise: Boolean(isKeyPromise),
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Proje eklenemedi.' }, { status: 500 });
  }
}
