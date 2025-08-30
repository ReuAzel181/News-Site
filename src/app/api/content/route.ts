export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { readContent, writeContent, updateArticleOverride, updateBreakingNews, setHeroSlides } from '@/lib/contentStore';

export async function GET() {
  const data = readContent();
  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session as any).user?.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const body = await req.json().catch(() => ({}));

  // Supported operations: setBreakingNews, setAvailableTags, setArticleOverride, setHeroSlides
  const { op } = body as { op?: string };
  if (op === 'setBreakingNews' && Array.isArray(body.items)) {
    const data = updateBreakingNews(body.items as string[]);
    return NextResponse.json({ success: true, data });
  }
  if (op === 'setAvailableTags' && Array.isArray(body.tags)) {
    const data = writeContent((current) => ({ ...current, availableTags: body.tags as string[] }));
    return NextResponse.json({ success: true, data });
  }
  if (op === 'setArticleOverride' && typeof body.articleId === 'string' && body.patch && typeof body.patch === 'object') {
    const data = updateArticleOverride(body.articleId, body.patch);
    return NextResponse.json({ success: true, data });
  }
  if (op === 'setHeroSlides' && Array.isArray(body.slides)) {
    const data = setHeroSlides(body.slides);
    return NextResponse.json({ success: true, data });
  }
  return new NextResponse('Bad Request', { status: 400 });
}