import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

const resend = new Resend(process.env.RESEND_API_KEY);

const DAILY_LIMIT = 3;

function getIP(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '0.0.0.0'
  );
}

export async function POST(request) {
  const { name, email, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  // ── Rate limit: max 3 per IP per day ──────────────────────────
  const ip = getIP(request);
  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('ip', ip)
    .gte('created_at', dayStart.toISOString());

  if (count >= DAILY_LIMIT) {
    return NextResponse.json(
      { error: `Too many messages. You can send up to ${DAILY_LIMIT} messages per day.` },
      { status: 429 }
    );
  }

  try {
    // Save to Supabase (include ip for rate limiting)
    const { error: dbError } = await supabase.from('inquiries').insert([{ name, email, message, ip }]);
    if (dbError) {
      console.error('Supabase insert error:', dbError);
    }

    // Send email
    const { data, error: emailError } = await resend.emails.send({
      from: 'Portfolio Contact <support@sarang-space.site>',
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: `New message from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#fff;padding:32px;border-radius:12px">
          <h2 style="color:#ff6b1a;margin:0 0 24px">New Contact Form Submission</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#999;width:80px">From</td><td style="padding:8px 0;color:#fff">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#999">Email</td><td style="padding:8px 0;color:#ff6b1a"><a href="mailto:${email}" style="color:#ff6b1a">${email}</a></td></tr>
          </table>
          <hr style="border:1px solid #222;margin:20px 0"/>
          <p style="color:#ccc;line-height:1.7;white-space:pre-wrap">${message}</p>
        </div>
      `,
    });

    if (emailError) {
      console.error('Resend error:', emailError);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
