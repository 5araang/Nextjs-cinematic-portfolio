import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { supabase } from '@/lib/supabase';
import sharp from 'sharp';

const BUCKET = 'project-photos';

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

export async function POST(request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
  if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
    return NextResponse.json({ error: 'Only images and videos allowed' }, { status: 400 });
  }
  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: 'Max 50 MB' }, { status: 400 });
  }

  // Create bucket if it doesn't exist
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find((b) => b.name === BUCKET)) {
    await supabase.storage.createBucket(BUCKET, { public: true });
  }

  let buffer;
  let contentType;
  let filename;

  if (file.type.startsWith('image/')) {
    // Convert to WebP and crop to 4:5 aspect ratio
    const raw = Buffer.from(await file.arrayBuffer());

    // Get image metadata first to calculate crop dimensions
    const meta = await sharp(raw).metadata();
    const srcW = meta.width;
    const srcH = meta.height;

    // Target 4:5 ratio — portrait optimised for project covers
    const TARGET_RATIO = 4 / 5;
    let cropW, cropH;

    if (srcW / srcH > TARGET_RATIO) {
      // Image is wider than 4:5 — crop width
      cropH = srcH;
      cropW = Math.round(srcH * TARGET_RATIO);
    } else {
      // Image is taller than 4:5 — crop height
      cropW = srcW;
      cropH = Math.round(srcW / TARGET_RATIO);
    }

    buffer = await sharp(raw)
      .resize(cropW, cropH, {
        fit: 'cover',
        position: 'center',
      })
      // Resize to a max width of 1200px while keeping 4:5
      .resize({ width: Math.min(cropW, 1200), height: Math.min(cropH, 1500), fit: 'cover' })
      .webp({ quality: 85 })
      .toBuffer();

    contentType = 'image/webp';
    filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
  } else {
    // Video — upload as-is
    buffer = Buffer.from(await file.arrayBuffer());
    contentType = file.type;
    const ext = file.name.split('.').pop().toLowerCase();
    filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  }

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, buffer, { contentType, upsert: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  return NextResponse.json({ url: publicUrl });
}
