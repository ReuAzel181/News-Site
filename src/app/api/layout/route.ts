import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/layout - Fetch current layout
export async function GET() {
  try {
    const layout = await prisma.layout.findUnique({
      where: { id: 1 }
    });

    return NextResponse.json({ layout });
  } catch (error) {
    console.error('Error fetching layout:', error);
    return NextResponse.json(
      { error: 'Failed to fetch layout' },
      { status: 500 }
    );
  }
}

// POST /api/layout - Save/update layout
export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { template, itemCount } = await request.json();

    if (!template || typeof itemCount !== 'number') {
      return NextResponse.json(
        { error: 'Invalid data: template and itemCount are required' },
        { status: 400 }
      );
    }

    // Upsert layout (create or update with id = 1)
    const layout = await prisma.layout.upsert({
      where: { id: 1 },
      update: {
        template,
        itemCount,
        updatedAt: new Date()
      },
      create: {
        id: 1,
        template,
        itemCount,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ layout });
  } catch (error) {
    console.error('Error saving layout:', error);
    return NextResponse.json(
      { error: 'Failed to save layout' },
      { status: 500 }
    );
  }
}