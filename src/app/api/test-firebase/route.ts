import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
  return NextResponse.json({ status: 'ok', hasDb: !!adminDb });
}
