import { NextResponse } from 'next/server';

export async function POST(request) {
  const { password } = await request.json();
  const correct = process.env.COMING_SOON_PASSWORD;

  if (!correct || password !== correct) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('cs_bypass', correct, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    sameSite: 'lax',
  });
  return res;
}
