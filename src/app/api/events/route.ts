/**
 * src/app/api/events/route.ts
 *
 * Saha etkinlikleri koleksiyonu için RESTful API endpoint'leri.
 *
 * GET  /api/events  — Tüm etkinlikleri listeler; ilçe ve tür filtrelemesi desteklenir.
 * POST /api/events  — Yeni bir etkinlik kaydı oluşturur.
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * GET /api/events
 *
 * Sorgu parametreleri:
 * - `district` : İlçeye göre filtrele (örn. "Çankaya", "Keçiören", "Tümü")
 * - `type`     : Etkinlik türüne göre filtrele ("Miting", "Esnaf Ziyareti", vb.)
 *
 * Sonuçlar tarihe göre artan sırada döndürülür (yaklaşan etkinlikler önce).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const district = searchParams.get('district');
    const type = searchParams.get('type');

    // Dinamik filtre nesnesi — yalnızca belirtilen parametreler eklenir
    const where: any = {};
    if (district && district !== 'Tümü') {
      where.district = district;
    }
    if (type && type !== 'Tümü') {
      where.type = type;
    }

    const events = await db.event.findMany({
      where,
      orderBy: { date: 'asc' }, // En yakın etkinlik en üstte
    });

    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Etkinlikler getirilemedi.' }, { status: 500 });
  }
}

/**
 * POST /api/events
 *
 * Yeni bir saha etkinliği oluşturur.
 * Zorunlu alanlar: `title`, `district`, `location`, `date`, `time`
 * İsteğe bağlı: `description`, `speaker`, `type`
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, district, location, date, time, description, speaker, type } = body;

    // Zorunlu alan doğrulaması
    if (!title || !district || !location || !date || !time) {
      return NextResponse.json({ error: 'Zorunlu alanlar doldurulmalıdır.' }, { status: 400 });
    }

    const newEvent = await db.event.create({
      data: {
        title,
        district,
        location,
        date: new Date(date), // ISO string'i Date nesnesine dönüştür
        time,
        description: description || '',
        speaker: speaker || null,
        type: type || 'Miting', // Varsayılan etkinlik türü
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Etkinlik eklenemedi.' }, { status: 500 });
  }
}
