import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const volunteers = await db.volunteer.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(volunteers);
  } catch (error) {
    return NextResponse.json({ error: 'Gönüllüler getirilemedi.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, district, interests, note } = body;

    if (!fullName || !email || !phone || !district) {
      return NextResponse.json({ error: 'Lütfen zorunlu alanları doldurunuz.' }, { status: 400 });
    }

    const volunteer = await db.volunteer.create({
      data: {
        fullName,
        email,
        phone,
        district,
        interests: interests || 'Genel Destek',
        note: note || null,
        status: 'Yeni',
      },
    });

    return NextResponse.json(volunteer, { status: 201 });
  } catch (error) {
    console.error('VOLUNTEER POST ERROR:', error);
    return NextResponse.json({ error: 'Gönüllü kaydı oluşturulamadı.', details: String(error) }, { status: 500 });
  }
}
