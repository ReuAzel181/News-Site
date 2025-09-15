import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/layout - Fetch current layout
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('layouts')
      .select('*')
      .eq('id', 1)
      .single()

    if (error) throw error
    return NextResponse.json({ layout: data })
  } catch (error: any) {
    console.error('Error fetching layout:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch layout' }, { status: 500 })
  }
}

// POST /api/layout - Save/update layout
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession({ req: request, ...authOptions })
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { template, itemCount } = await request.json()

    if (!template || typeof template !== 'string' || typeof itemCount !== 'number') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('layouts')
      .upsert({ id: 1, template, itemCount, updatedAt: new Date() })

    if (error) throw error
    return NextResponse.json({ layout: data })
  } catch (error: any) {
    console.error('Error saving layout:', error)
    return NextResponse.json({ error: error.message || 'Failed to save layout' }, { status: 500 })
  }
}
