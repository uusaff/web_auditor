import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue } from 'firebase-admin/firestore';
import crypto from 'crypto';

const ACTIVATION_CODE_HASH = '901e76398a6badfaa7d8f497e45f4eee859081725dba6e1b4349038675962090';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    let userId: string;
    try {
      const decoded = await getAuth().verifyIdToken(token);
      userId = decoded.uid;
    } catch {
      return NextResponse.json({ error: 'Invalid authentication token' }, { status: 401 });
    }

    const { code } = await req.json();
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Activation code is required' }, { status: 400 });
    }

    const inputHash = crypto.createHash('sha256').update(code.trim()).digest('hex');
    if (inputHash !== ACTIVATION_CODE_HASH) {
      return NextResponse.json({ error: 'Invalid activation code' }, { status: 403 });
    }

    const { adminDb } = await import('@/lib/firebase-admin');
    if (!adminDb) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 });
    }

    const userRef = adminDb.collection('users').doc(userId);
    await userRef.set({
      userTier: 'pro',
      credits: FieldValue.increment(10),
      proActivatedAt: Date.now(),
    }, { merge: true });

    return NextResponse.json({ success: true, message: 'Pro activated! You now have 10 credits.' });
  } catch (error: any) {
    console.error('[Activate API] Error:', error);
    return NextResponse.json({ error: 'Failed to activate' }, { status: 500 });
  }
}
