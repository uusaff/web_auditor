import { NextResponse } from 'next/server';
import dns from 'dns/promises';
export async function GET() { return NextResponse.json({ ok: true }); }
