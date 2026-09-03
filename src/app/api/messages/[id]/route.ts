/**
 * src/app/api/messages/[id]/route.ts
 *
 * Tekil iletişim mesajı için RESTful API endpoint'leri.
 *
 * PATCH  /api/messages/:id  — Mesajı "okundu" olarak işaretler.
 * DELETE /api/messages/:id  — Mesajı veritabanından kalıcı olarak siler.
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * PATCH /api/messages/:id
 *
 * Mesajın `isRead` alanını `true` olarak günceller.
 * Yönetim panelinde "Okundu" işareti için kullanılır.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const updated = await db.message.update({
      where: { id },
      data: { isRead: true }, // Mesajı okunmuş olarak işaretle
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Mesaj güncellenemedi.' }, { status: 500 });
  }
}

/**
 * DELETE /api/messages/:id
 *
 * Mesajı veritabanından kalıcı olarak siler.
 * Başarılı olduğunda onay mesajı döndürür.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await db.message.delete({ where: { id } });
    return NextResponse.json({ message: 'Mesaj silindi.' });
  } catch (error) {
    return NextResponse.json({ error: 'Mesaj silinemedi.' }, { status: 500 });
  }
}
