import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const updated = await db.message.update({
      where: { id },
      data: { isRead: true },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Mesaj güncellenemedi.' }, { status: 500 });
  }
}

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
