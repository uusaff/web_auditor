import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import OpenAI from 'openai';
import * as cheerio from 'cheerio';
export async function GET() { return NextResponse.json({ ok: true, hasDb: !!adminDb, hasOpenAI: !!OpenAI, hasCheerio: !!cheerio }); }
