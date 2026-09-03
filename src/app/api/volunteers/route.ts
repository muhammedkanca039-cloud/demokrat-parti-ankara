/**
 * src/app/api/volunteers/route.ts
 *
 * Gönüllü kayıtları koleksiyonu için RESTful API endpoint'leri.
 *
 * GET  /api/volunteers  — Tüm gönüllü kayıtlarını listeler (yönetim paneli için).
 * POST /api/volunteers  — Anasayfadaki gönüllü formundan yeni kayıt oluşturur.
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * GET /api/volunteers
 *
 * Tüm gönüllü kayıtlarını oluşturulma tarihine göre azalan sırada döndürür.
 * Yönetim panelinin "Gönüllüler" sekmesi tarafından kullanılır.
 */
export async function GET() {
  try {
    const volunteers = await db.volunteer.findMany({
      orderBy: { createdAt: 'desc' }, // En yeni kayıt en üstte
    });
    return NextResponse.json(volunteers);
  } catch (error) {
    return NextResponse.json({ error: 'Gönüllüler getirilemedi.' }, { status: 500 });
  }
}

/**
 * POST /api/volunteers
 *
 * Anasayfadaki "Gönüllü Ol" formundan gelen kaydı veritabanına ekler.
 * Zorunlu alanlar: `fullName`, `email`, `phone`, `district`
 * İsteğe bağlı: `interests`, `note`
 *
 * Yeni kayıtlar otomatik olarak `status: "Yeni"` ile başlar.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, district, interests, note } = body;

    // Zorunlu alan doğrulaması
    if (!fullName || !email || !phone || !district) {
      return NextResponse.json({ error: 'Lütfen zorunlu alanları doldurunuz.' }, { status: 400 });
    }

    const volunteer = await db.volunteer.create({
      data: {
        fullName,
        email,
        phone,
        district,
        interests: interests || 'Genel Destek', // Varsayılan ilgi alanı
        note: note || null,
        status: 'Yeni', // Tüm yeni kayıtlar "Yeni" statüsüyle başlar
      },
    });

    return NextResponse.json(volunteer, { status: 201 });
  } catch (error) {
    console.error('VOLUNTEER POST ERROR:', error);
    return NextResponse.json({ error: 'Gönüllü kaydı oluşturulamadı.', details: String(error) }, { status: 500 });
  }
}
