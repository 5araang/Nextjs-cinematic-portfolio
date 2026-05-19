import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { sessionId } = await req.json();
    if (!sessionId) return NextResponse.json({ success: false }, { status: 400 });

    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'active_sessions')
      .single();

    if (data?.value && data.value[sessionId]) {
      const sessions = data.value;
      delete sessions[sessionId];
      await supabase.from('settings').upsert({ key: 'active_sessions', value: sessions });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
