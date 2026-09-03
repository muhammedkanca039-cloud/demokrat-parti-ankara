/**
 * src/app/api/volunteers/[id]/route.ts
 *
 * Tekil gönüllü kaydı için RESTful API endpoint'leri.
 *
 * PATCH  /api/volunteers/:id  — Gönüllünün durumunu günceller.
 * DELETE /api/volunteers/:id  — Gönüllü kaydını veritabanından kalıcı olarak siler.
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * PATCH /api/volunteers/:id
 *
 * Gönüllünün `status` alanını günceller.
 * Geçerli durum değerleri: "Yeni" | "İletişime Geçildi" | "Aktif Gönüllü"
 * Yönetim panelinin gönüllü yönetim tablosundan tetiklenir.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    const updated = await db.volunteer.update({
      where: { id },
      data: { status: body.status }, // Yalnızca durum alanı güncellenir
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Durum güncellenemedi.' }, { status: 500 });
  }
}

/**
 * DELETE /api/volunteers/:id
 *
 * Gönüllü kaydını veritabanından kalıcı olarak siler.
 * Başarılı olduğunda onay mesajı döndürür.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await db.volunteer.delete({ where: { id } });
    return NextResponse.json({ message: 'Gönüllü kaydı silindi.' });
  } catch (error) {
    return NextResponse.json({ error: 'Gönüllü silinemedi.' }, { status: 500 });
  }
}
