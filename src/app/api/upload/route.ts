export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { put } from '@vercel/blob';

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
  const session = await getServerSession(authOptions);
  if (!session || (session as Session).user?.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return new NextResponse('No file provided', { status: 400 });
    }

    // Validate type (best-effort; some browsers may omit)
    if (file.type && !ALLOWED_TYPES.has(file.type)) {
      return new NextResponse('Unsupported file type', { status: 415 });
    }

    // Limit max size to ~10MB
    const MAX_BYTES = 10 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      return new NextResponse('File too large (max 10MB)', { status: 413 });
    }

    // Generate filename
    const baseName = file.name ? String(file.name) : 'upload';
    const extFromName = baseName.includes('.') ? baseName.substring(baseName.lastIndexOf('.')) : '';
    const ext = extFromName || getExtensionFromType(file.type);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    });

    return NextResponse.json({ success: true, url: blob.url });
  } catch (err) {
    console.error('Upload failed:', err);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}