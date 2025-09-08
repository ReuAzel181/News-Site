export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadToSupabase } from '@/lib/supabase';

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
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/webp':
      return '.webp';
    case 'image/avif':
      return '.avif';
    case 'image/gif':
      return '.gif';
    case 'image/svg+xml':
      return '.svg';
    default:
      return '';
  }
}

export async function POST(req: NextRequest) {
  console.log('[Upload API] Starting upload request');
  
  const session = await getServerSession(authOptions);
  console.log('[Upload API] Session check:', !!session, session?.user?.role);
  
  if (!session || (session as Session).user?.role !== 'ADMIN') {
    console.log('[Upload API] Unauthorized access attempt');
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    console.log('[Upload API] Parsing form data...');
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    console.log('[Upload API] File received:', !!file, file?.name, file?.size, file?.type);

    if (!file) {
      console.log('[Upload API] No file provided');
      return new NextResponse('No file provided', { status: 400 });
    }

    // Validate type (best-effort; some browsers may omit)
    if (file.type && !ALLOWED_TYPES.has(file.type)) {
      console.log('[Upload API] Unsupported file type:', file.type);
      return new NextResponse('Unsupported file type', { status: 415 });
    }

    // Limit max size to ~10MB
    const MAX_BYTES = 10 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      console.log('[Upload API] File too large:', file.size);
      return new NextResponse('File too large (max 10MB)', { status: 413 });
    }

    // Generate filename
    const baseName = file.name ? String(file.name) : 'upload';
    const extFromName = baseName.includes('.') ? baseName.substring(baseName.lastIndexOf('.')) : '';
    const ext = extFromName || getExtensionFromType(file.type);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    console.log('[Upload API] Generated filename:', filename);

    // Check Supabase environment variables
    console.log('[Upload API] SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('[Upload API] SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    // Upload to Supabase Storage
    console.log('[Upload API] Attempting Supabase Storage upload...');
    const { url, error } = await uploadToSupabase(file, filename);
    
    if (error) {
      console.error('[Upload API] Supabase upload failed:', error);
      return new NextResponse(`Upload failed: ${error}`, { status: 500 });
    }
    
    console.log('[Upload API] Upload successful:', url);
    return NextResponse.json({ success: true, url });
  } catch (err) {
    console.error('[Upload API] Upload failed with error:', err);
    console.error('[Upload API] Error details:', {
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : 'No stack trace',
      name: err instanceof Error ? err.name : 'Unknown error type'
    });
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}