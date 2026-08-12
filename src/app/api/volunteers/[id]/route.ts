import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    const updated = await db.volunteer.update({
      where: { id },
      data: { status: body.status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Durum güncellenemedi.' }, { status: 500 });
  }
}

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
