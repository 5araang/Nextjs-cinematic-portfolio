import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { query } = await request.json();
    if (!query || query.trim().length < 2) {
      return NextResponse.json({ error: 'Query too short' }, { status: 400 });
    }

    const q = query.toLowerCase().trim();
    const { data } = await supabase.from('searches').select('count').eq('query', q).single();

    if (data) {
      await supabase.from('searches').update({ count: data.count + 1, last_searched: new Date().toISOString() }).eq('query', q);
    } else {
      await supabase.from('searches').insert([{ query: q, count: 1, last_searched: new Date().toISOString() }]);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
