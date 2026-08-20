import { NextResponse } from 'next/server';
import OpenAI from 'openai';
export async function GET() { return NextResponse.json({ ok: true }); }
