import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const candidate = await db.candidate.findUnique({ where: { id } });

    if (!candidate) {
      return NextResponse.json({ error: 'Aday bulunamadı.' }, { status: 404 });
    }

    return NextResponse.json(candidate);
  } catch (error) {
    return NextResponse.json({ error: 'Aday getirilemedi.' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    const updatedCandidate = await db.candidate.update({
      where: { id },
      data: {
        name: body.name,
        title: body.title,
        region: body.region,
        photoUrl: body.photoUrl,
        bio: body.bio,
        profession: body.profession,
        expertise: body.expertise,
        isFeatured: Boolean(body.isFeatured),
        order: Number(body.order) || 0,
        twitter: body.twitter,
        instagram: body.instagram,
        facebook: body.facebook,
        linkedin: body.linkedin,
      },
    });

    return NextResponse.json(updatedCandidate);
  } catch (error) {
    console.error('Error updating candidate:', error);
    return NextResponse.json({ error: 'Aday güncellenemedi.' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await db.candidate.delete({ where: { id } });
    return NextResponse.json({ message: 'Aday silindi.' });
  } catch (error) {
    return NextResponse.json({ error: 'Aday silinirken hata oluştu.' }, { status: 500 });
  }
}
