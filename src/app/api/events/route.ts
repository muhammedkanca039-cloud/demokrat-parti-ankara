import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const district = searchParams.get('district');
    const type = searchParams.get('type');

    const where: any = {};
    if (district && district !== 'Tümü') {
      where.district = district;
    }
    if (type && type !== 'Tümü') {
      where.type = type;
    }

    const events = await db.event.findMany({
      where,
      orderBy: { date: 'asc' },
    });

    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Etkinlikler getirilemedi.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, district, location, date, time, description, speaker, type } = body;

    if (!title || !district || !location || !date || !time) {
      return NextResponse.json({ error: 'Zorunlu alanlar doldurulmalıdır.' }, { status: 400 });
    }

    const newEvent = await db.event.create({
      data: {
        title,
        district,
        location,
        date: new Date(date),
        time,
        description: description || '',
        speaker: speaker || null,
        type: type || 'Miting',
      },
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Etkinlik eklenemedi.' }, { status: 500 });
  }
}
