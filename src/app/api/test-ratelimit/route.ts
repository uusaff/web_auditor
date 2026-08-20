import { NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
export async function GET() { return NextResponse.json({ ok: true }); }
