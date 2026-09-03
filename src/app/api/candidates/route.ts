/**
 * src/app/api/candidates/route.ts
 *
 * Milletvekili adayları koleksiyonu için RESTful API endpoint'leri.
 *
 * GET  /api/candidates  — Tüm adayları listeler; bölge, öne çıkarılma ve
 *                         arama metnine göre filtreleme desteklenir.
 * POST /api/candidates  — Yeni bir aday kaydı oluşturur.
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * GET /api/candidates
 *
 * Sorgu parametreleri:
 * - `region`   : Bölgeye göre filtrele ("1. Bölge" | "2. Bölge" | "3. Bölge" | "Tümü")
 * - `featured` : "true" ise yalnızca öne çıkarılan adayları döndürür
 * - `search`   : Ad, meslek veya uzmanlık alanında metin araması yapar
 *
 * Sonuçlar önce öne çıkarılanlara, sonra sıralama değerine, ardından ID'ye göre sıralanır.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    // Dinamik filtre nesnesi — yalnızca belirtilen parametreler eklenir
    const where: any = {};

    if (region && region !== 'Tümü') {
      where.region = region;
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    // Ad, meslek veya uzmanlık alanında kısmi eşleşme araması
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { profession: { contains: search } },
        { expertise: { contains: search } },
      ];
    }

    const candidates = await db.candidate.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { order: 'asc' }, { id: 'asc' }],
    });

    return NextResponse.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json({ error: 'Adaylar yüklenirken bir hata oluştu.' }, { status: 500 });
  }
}

/**
 * POST /api/candidates
 *
 * Yeni bir milletvekili adayı oluşturur.
 * Zorunlu alanlar: `name`, `title`, `region`, `profession`
 * İsteğe bağlı: `photoUrl`, `bio`, `expertise`, `isFeatured`, `order`,
 *               `twitter`, `instagram`, `facebook`, `linkedin`
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      title,
      region,
      photoUrl,
      bio,
      profession,
      expertise,
      isFeatured,
      order,
      twitter,
      instagram,
      facebook,
      linkedin,
    } = body;

    // Zorunlu alan doğrulaması
    if (!name || !title || !region || !profession) {
      return NextResponse.json({ error: 'Lütfen zorunlu alanları doldurunuz.' }, { status: 400 });
    }

    const candidate = await db.candidate.create({
      data: {
        name,
        title,
        region,
        // Fotoğraf URL'si sağlanmamışsa varsayılan stok görsel kullanılır
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
        bio: bio || '',
        profession,
        expertise: expertise || '',
        isFeatured: Boolean(isFeatured),
        order: Number(order) || 0,
        twitter: twitter || null,
        instagram: instagram || null,
        facebook: facebook || null,
        linkedin: linkedin || null,
      },
    });

    // 201 Created — yeni kayıt başarıyla oluşturuldu
    return NextResponse.json(candidate, { status: 201 });
  } catch (error) {
    console.error('Error creating candidate:', error);
    return NextResponse.json({ error: 'Aday eklenirken hata oluştu.' }, { status: 500 });
  }
}
