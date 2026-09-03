/**
 * src/app/api/messages/route.ts
 *
 * İletişim formu mesajları koleksiyonu için RESTful API endpoint'leri.
 *
 * GET  /api/messages  — Tüm mesajları en yeniden en eskiye listeler (yönetim paneli için).
 * POST /api/messages  — Ziyaretçiden gelen yeni bir mesaj kaydeder.
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * GET /api/messages
 *
 * Tüm iletişim mesajlarını oluşturulma tarihine göre azalan sırada döndürür.
 * Yönetim panelinin "Gelen Mesajlar" sekmesi tarafından kullanılır.
 */
export async function GET() {
  try {
    const messages = await db.message.findMany({
      orderBy: { createdAt: 'desc' }, // En yeni mesaj en üstte
    });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Mesajlar getirilemedi.' }, { status: 500 });
  }
}

/**
 * POST /api/messages
 *
 * Anasayfadaki iletişim formundan gönderilen mesajı kaydeder.
 * Zorunlu alanlar: `fullName`, `email`, `subject`, `content`
 * İsteğe bağlı: `district` (gönderenin ilçesi)
 *
 * Yeni mesajlar otomatik olarak `isRead: false` olarak işaretlenir.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, subject, content, district } = body;

    // Zorunlu alan doğrulaması
    if (!fullName || !email || !subject || !content) {
      return NextResponse.json({ error: 'Lütfen tüm alanları doldurunuz.' }, { status: 400 });
    }

    const message = await db.message.create({
      data: {
        fullName,
        email,
        subject,
        content,
        district: district || null,
        isRead: false, // Yeni mesajlar okunmamış olarak başlar
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Mesaj gönderilemedi.' }, { status: 500 });
  }
}
