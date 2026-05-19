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
  
  let query = supabase.from('reviews').select('*').order('created_at', { ascending: false });
  if (!(searchParams.get('all') === 'true' && admin)) {
    query = query.eq('approved', true);
  }
  
  const { data: reviews } = await query;
  const mappedReviews = (reviews || []).map(r => ({ ...r, _id: r.id, createdAt: r.created_at }));
  return NextResponse.json(mappedReviews);
}

export async function POST(request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const { data: review } = await supabase.from('reviews').insert([body]).select().single();
  return NextResponse.json({ ...review, _id: review.id, createdAt: review.created_at }, { status: 201 });
}
