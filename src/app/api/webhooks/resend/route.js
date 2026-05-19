import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const body = await request.json();

    // Verify it's an incoming email webhook from Resend
    if (body.type !== 'email.received') {
      return NextResponse.json({ error: 'Ignored: Not an email.received event' }, { status: 400 });
    }

    const { from, subject, text, html } = body.data;

    // Parse the sender's name and email
    // "from" usually looks like: "John Doe <john@example.com>" or just "john@example.com"
    let name = 'Unknown Sender';
    let email = from;

    const match = from.match(/(.*)<(.*)>/);
    if (match) {
      name = match[1].trim().replace(/^"|"$/g, '') || 'Unknown Sender'; // Remove quotes if any
      email = match[2].trim();
    }

    // Prepare the message text (use plain text if available, fallback to html)
    let messageBody = text || html || '[No content]';
    
    // Add the subject line to the top of the message so the admin has context
    const fullMessage = `SUBJECT: ${subject || 'No Subject'}\n\n${messageBody}`;

    // Insert the received email into the inquiries table so it appears in the Admin Panel
    const { error } = await supabase.from('inquiries').insert([{ 
      name, 
      email, 
      message: fullMessage 
    }]);

    if (error) {
      console.error('Webhook Supabase insert error:', error);
      return NextResponse.json({ error: 'Database insert failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Webhook processing error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
