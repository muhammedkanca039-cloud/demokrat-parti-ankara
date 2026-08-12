import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET all candidates
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    const where: any = {};

    if (region && region !== 'Tümü') {
      where.region = region;
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { profession: { contains: search } },
        { expertise: { contains: search } },
      ];
    }

    const candidates = await db.candidate.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { order: 'asc' }, { id: 'asc' }],
    });

    return NextResponse.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json({ error: 'Adaylar yüklenirken bir hata oluştu.' }, { status: 500 });
  }
}

// POST new candidate
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      title,
      region,
      photoUrl,
      bio,
      profession,
      expertise,
      isFeatured,
      order,
      twitter,
      instagram,
      facebook,
      linkedin,
    } = body;

    if (!name || !title || !region || !profession) {
      return NextResponse.json({ error: 'Lütfen zorunlu alanları doldurunuz.' }, { status: 400 });
    }

    const candidate = await db.candidate.create({
      data: {
        name,
        title,
        region,
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
        bio: bio || '',
        profession,
        expertise: expertise || '',
        isFeatured: Boolean(isFeatured),
        order: Number(order) || 0,
        twitter: twitter || null,
        instagram: instagram || null,
        facebook: facebook || null,
        linkedin: linkedin || null,
      },
    });

    return NextResponse.json(candidate, { status: 201 });
  } catch (error) {
    console.error('Error creating candidate:', error);
    return NextResponse.json({ error: 'Aday eklenirken hata oluştu.' }, { status: 500 });
  }
}
