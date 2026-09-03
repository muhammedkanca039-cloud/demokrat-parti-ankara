/**
 * src/app/api/projects/[id]/route.ts
 *
 * Tekil seçim projesi/vaadi için RESTful API endpoint'leri.
 *
 * PUT    /api/projects/:id  — Projenin tüm alanlarını günceller.
 * DELETE /api/projects/:id  — Projeyi veritabanından kalıcı olarak siler.
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * PUT /api/projects/:id
 *
 * İstek gövdesindeki tüm proje alanlarını günceller.
 * `isKeyPromise` boolean'a dönüştürülür.
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    const updated = await db.project.update({
      where: { id },
      data: {
        title: body.title,
        category: body.category,
        summary: body.summary,
        description: body.description,
        targetAudience: body.targetAudience,
        icon: body.icon,
        isKeyPromise: Boolean(body.isKeyPromise),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Proje güncellenemedi.' }, { status: 500 });
  }
}

/**
 * DELETE /api/projects/:id
 *
 * Projeyi veritabanından kalıcı olarak siler.
 * Başarılı olduğunda onay mesajı döndürür.
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await db.project.delete({ where: { id } });
    return NextResponse.json({ message: 'Proje silindi.' });
  } catch (error) {
    return NextResponse.json({ error: 'Proje silinemedi.' }, { status: 500 });
  }
}
