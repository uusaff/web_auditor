import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
export async function GET() { return NextResponse.json({ ok: true }); }
