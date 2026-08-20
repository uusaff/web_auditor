import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const ACTIVATION_CODE_HASH = '901e76398a6badfaa7d8f497e45f4eee859081725dba6e1b4349038675962090';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const bearerToken = authHeader.split('Bearer ')[1];

    let userId: string;
    try {
      const firebaseAuth = await import('firebase-admin/auth');
      const firebaseApp = await import('firebase-admin/app');

      if (!firebaseApp.getApps().length) {
        const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (serviceAccountJson) {
          const serviceAccount = JSON.parse(serviceAccountJson);
          firebaseApp.initializeApp({ credential: firebaseApp.cert(serviceAccount) });
        } else {
          return NextResponse.json({ error: 'Server config error: FIREBASE_SERVICE_ACCOUNT_KEY missing' }, { status: 500 });
        }
      }

      const decoded = await firebaseAuth.getAuth().verifyIdToken(bearerToken);
      userId = decoded.uid;
    } catch (e: any) {
      console.error('[Activate] Auth error:', e.message);
      return NextResponse.json({ error: 'Invalid authentication token', details: e.message }, { status: 401 });
    }

    const { code } = await req.json();
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Activation code is required' }, { status: 400 });
    }

    const inputHash = crypto.createHash('sha256').update(code.trim()).digest('hex');
    if (inputHash !== ACTIVATION_CODE_HASH) {
      return NextResponse.json({ error: 'Invalid activation code' }, { status: 403 });
    }

    const { getFirestore, FieldValue } = await import('firebase-admin/firestore');
    const db = getFirestore();
    const userRef = db.collection('users').doc(userId);
    await userRef.set({
      userTier: 'pro',
      credits: FieldValue.increment(10),
      proActivatedAt: Date.now(),
    }, { merge: true });

    return NextResponse.json({ success: true, message: 'Pro activated! You now have 10 credits.' });
  } catch (error: any) {
    console.error('[Activate API] Error:', error);
    return NextResponse.json({ error: 'Failed to activate', details: error.message }, { status: 500 });
  }
}
