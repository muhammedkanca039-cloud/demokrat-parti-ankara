import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    const updated = await db.event.update({
      where: { id },
      data: {
        title: body.title,
        district: body.district,
        location: body.location,
        date: new Date(body.date),
        time: body.time,
        description: body.description,
        speaker: body.speaker,
        type: body.type,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Etkinlik güncellenemedi.' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await db.event.delete({ where: { id } });
    return NextResponse.json({ message: 'Etkinlik silindi.' });
  } catch (error) {
    return NextResponse.json({ error: 'Etkinlik silinemedi.' }, { status: 500 });
  }
}
