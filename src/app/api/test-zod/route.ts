import { NextResponse } from 'next/server';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
export async function GET() { return NextResponse.json({ ok: true }); }
