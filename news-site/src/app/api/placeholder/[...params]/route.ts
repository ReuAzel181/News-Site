import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ params: string[] }> }
) {
  const resolvedParams = await params;
  const [width = '400', height = '300'] = resolvedParams.params || [];
  
  // Create a simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <rect x="20" y="20" width="${parseInt(width) - 40}" height="${parseInt(height) - 40}" fill="#e5e7eb" rx="8"/>
      <circle cx="${parseInt(width) / 2}" cy="${parseInt(height) / 2 - 20}" r="30" fill="#d1d5db"/>
      <rect x="${parseInt(width) / 2 - 40}" y="${parseInt(height) / 2 + 20}" width="80" height="8" fill="#d1d5db" rx="4"/>
      <rect x="${parseInt(width) / 2 - 30}" y="${parseInt(height) / 2 + 35}" width="60" height="6" fill="#e5e7eb" rx="3"/>
      <text x="${parseInt(width) / 2}" y="${parseInt(height) - 15}" text-anchor="middle" fill="#9ca3af" font-family="Arial, sans-serif" font-size="12">
        ${width} × ${height}
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}