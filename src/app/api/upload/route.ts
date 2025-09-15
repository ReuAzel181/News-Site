export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadToSupabase } from '@/lib/supabase-upload';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
  'image/svg+xml',
]);

function getExtensionFromType(type?: string): string {
  switch (type) {
    case 'image/jpeg': return '.jpg';
    case 'image/png': return '.png';
    case 'image/webp': return '.webp';
    case 'image/avif': return '.avif';
    case 'image/gif': return '.gif';
    case 'image/svg+xml': return '.svg';
    default: return '';
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  console.log('[Update Article API] Starting request');

  const session = await getServerSession(authOptions);
  if (!session || (session as Session).user?.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;
    const title = formData.get('title') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;

    let newImageUrl: string | undefined;

    if (file) {
      if (file.type && !ALLOWED_TYPES.has(file.type)) {
        return new NextResponse('Unsupported file type', { status: 415 });
      }
      if (file.size > 10 * 1024 * 1024) {
        return new NextResponse('File too large (max 10MB)', { status: 413 });
      }

      const ext = getExtensionFromType(file.type);
      const filename = `${params.id}-${Date.now()}${ext}`;

      const result = await uploadToSupabase(file, filename, session.user?.id as string);
      newImageUrl = result.publicUrl;
    }

    const { error: dbError } = await supabase
      .from('Article')
      .update({
        title,
        excerpt,
        content,
        ...(newImageUrl ? { featuredImage: newImageUrl } : {}),
      })
      .eq('id', params.id);

    if (dbError) {
      console.error('[Update Article API] DB error:', dbError.message);
      return NextResponse.json({ success: false, error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, imageUrl: newImageUrl });
  } catch (err) {
    console.error('[Update Article API] Error:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
