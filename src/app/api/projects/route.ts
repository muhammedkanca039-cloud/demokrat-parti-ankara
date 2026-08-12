import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const keyOnly = searchParams.get('keyOnly');

    const where: any = {};
    if (category && category !== 'Tümü') {
      where.category = category;
    }
    if (keyOnly === 'true') {
      where.isKeyPromise = true;
    }

    const projects = await db.project.findMany({
      where,
      orderBy: [{ isKeyPromise: 'desc' }, { id: 'asc' }],
    });

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Projeler getirilemedi.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, summary, description, targetAudience, icon, isKeyPromise } = body;

    if (!title || !category || !summary || !description) {
      return NextResponse.json({ error: 'Zorunlu alanlar eksik.' }, { status: 400 });
    }

    const project = await db.project.create({
      data: {
        title,
        category,
        summary,
        description,
        targetAudience: targetAudience || null,
        icon: icon || 'TrendingUp',
        isKeyPromise: Boolean(isKeyPromise),
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Proje eklenemedi.' }, { status: 500 });
  }
}
