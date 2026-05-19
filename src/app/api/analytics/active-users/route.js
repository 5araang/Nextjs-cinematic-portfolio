import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'active_sessions')
      .single();

    let sessions = data?.value || {};
    let count = 0;
    const now = Date.now();
    
    // Only count sessions seen in the last 15 seconds
    for (const key in sessions) {
      if (now - sessions[key].lastSeen <= 15000) {
        count++;
      }
    }

    return NextResponse.json({ count, success: true });
  } catch (e) {
    return NextResponse.json({ count: 0, success: false }, { status: 500 });
  }
}
