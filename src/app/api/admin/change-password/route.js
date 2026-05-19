import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function POST(request) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { currentPassword, newPassword } = await request.json();

  if (!currentPassword || currentPassword !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
  }

  if (!newPassword || newPassword.length < 8) {
    return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: `Update ADMIN_PASSWORD in your .env.local to: ${newPassword}`,
    newPassword,
  });
}
