import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
export async function GET() { return NextResponse.json({ ok: true }); }
