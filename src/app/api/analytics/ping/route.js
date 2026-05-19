import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { sessionId, page } = await req.json();
    if (!sessionId) return NextResponse.json({ success: false }, { status: 400 });
    
    // Fetch current sessions from settings table
    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'active_sessions')
      .single();
      
    let sessions = data?.value || {};
    
    const now = Date.now();
    let updated = false;
    
    // Clean up sessions older than 60 seconds (increased from 15s to match 30s ping)
    for (const key in sessions) {
      if (now - sessions[key].lastSeen > 60000) {
        delete sessions[key];
        updated = true;
      }
    }
    
    // Update or add the current session
    if (sessions[sessionId]) {
      sessions[sessionId].lastSeen = now;
      sessions[sessionId].page = page;
      updated = true;
    } else {
      sessions[sessionId] = { lastSeen: now, page, startedAt: now };
      updated = true;
    }
    
    // Save back to settings if there were changes
    if (updated) {
      await supabase.from('settings').upsert({ key: 'active_sessions', value: sessions });
    }
    
    return NextResponse.json({ success: true, active: Object.keys(sessions).length });
  } catch (e) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
