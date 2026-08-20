import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const SIGNING_SECRET = process.env.AUDIT_SIGNING_SECRET || process.env.OPENROUTER_API_KEY || 'audit-signing-fallback-key';

export async function POST(req: NextRequest) {
  try {
    const { url, deep } = await req.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const payload = JSON.stringify({ url, deep: !!deep, ts: Date.now() });
    const payloadB64 = Buffer.from(payload).toString('base64url');
    const hmac = crypto.createHmac('sha256', SIGNING_SECRET).update(payload).digest('base64url');
    const token = `${payloadB64}.${hmac}`;

    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ error: 'Failed to sign' }, { status: 500 });
  }
}
