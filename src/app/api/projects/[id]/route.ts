import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

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
