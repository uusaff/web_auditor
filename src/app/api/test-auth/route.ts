import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
export async function GET() { return NextResponse.json({ ok: true }); }
