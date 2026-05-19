import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { supabase } from '@/lib/supabase';

async function isAdmin() {
  const store = await cookies();
  const token = store.get('admin_token')?.value;
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const admin = await isAdmin();
  const category = searchParams.get('category');

  let query = supabase
    .from('works')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (!(searchParams.get('all') === 'true' && admin)) {
    query = query.eq('visible', true);
  }

  if (category && category !== 'All') {
    query = query.eq('category', category);
  }

  const { data: works, error } = await query;
  if (error) {
    console.error('[GET /api/works]', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(works || []);
}

export async function POST(request) {
  if (!(await isAdmin())) {
    console.error('[POST /api/works] Unauthorized — no valid admin_token cookie');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  console.log('[POST /api/works] Inserting:', body.title);

  const { data: work, error } = await supabase
    .from('works')
    .insert([body])
    .select()
    .single();

  if (error) {
    console.error('[POST /api/works] Insert error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log('[POST /api/works] Success, id:', work.id);
  return NextResponse.json(work, { status: 201 });
}
