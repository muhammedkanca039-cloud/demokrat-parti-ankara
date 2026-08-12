import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const messages = await db.message.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Mesajlar getirilemedi.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, subject, content, district } = body;

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
        isRead: false,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Mesaj gönderilemedi.' }, { status: 500 });
  }
}
