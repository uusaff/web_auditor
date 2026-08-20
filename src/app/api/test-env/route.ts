import { NextResponse } from 'next/server';

export async function GET() {
  const checks: Record<string, string> = {};

  checks.FIREBASE_SERVICE_ACCOUNT_KEY = process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? `SET (length: ${process.env.FIREBASE_SERVICE_ACCOUNT_KEY.length})` : 'MISSING';
  checks.OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ? 'SET' : 'MISSING';
  checks.BROWSERLESS_API_KEY = process.env.BROWSERLESS_API_KEY ? 'SET' : 'MISSING';
  checks.UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL ? 'SET' : 'MISSING';

  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      checks.SERVICE_ACCOUNT_PROJECT = parsed.project_id || 'NOT FOUND';
      checks.SERVICE_ACCOUNT_CLIENT_EMAIL = parsed.client_email || 'NOT FOUND';
    } catch (e: any) {
      checks.SERVICE_ACCOUNT_PARSE = `FAILED: ${e.message}`;
    }
  }

  try {
    const firebaseApp = await import('firebase-admin/app');
    if (!firebaseApp.getApps().length) {
      const sa = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
      if (sa) {
        firebaseApp.initializeApp({ credential: firebaseApp.cert(JSON.parse(sa)) });
        checks.FIREBASE_INIT = 'SUCCESS (just initialized)';
      } else {
        checks.FIREBASE_INIT = 'FAILED: no env var';
      }
    } else {
      checks.FIREBASE_INIT = 'SUCCESS (already initialized)';
    }
  } catch (e: any) {
    checks.FIREBASE_INIT = `FAILED: ${e.message}`;
  }

  return NextResponse.json(checks, { status: 200 });
}
