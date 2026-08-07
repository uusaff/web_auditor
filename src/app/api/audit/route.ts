import { NextRequest, NextResponse } from 'next/server';
import { chromium, Browser } from 'playwright';
import { URL } from 'url';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import OpenAI from 'openai';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import * as cheerio from 'cheerio';

export const maxDuration = 60; // Max execution time for Vercel

// --- RATE LIMITER SETUP ---
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'http://localhost',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'dummy',
});
const rateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  analytics: true,
});

// --- SSRF VALIDATOR ---
function validateTargetUrl(rawUrl: string): { valid: boolean; reason?: string } {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { valid: false, reason: 'Only HTTP and HTTPS protocols are supported.' };
    }
    const hostname = parsed.hostname.toLowerCase();
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1' || hostname === '0.0.0.0') {
      return { valid: false, reason: 'Access to local resources is strictly prohibited.' };
    }
    const privateIpRegex = /^(10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.|169\.254\.)/;
    if (privateIpRegex.test(hostname)) {
      return { valid: false, reason: 'Access to internal IP ranges is prohibited.' };
    }
    return { valid: true };
  } catch {
    return { valid: false, reason: 'Malformed URL provided.' };
  }
}

// --- 1. STRICT ZOD SCHEMA ---
const AuditReportSchema = z.object({
  url: z.string(),
  overall_health: z.number().describe("Audit score from 0 to 100"),
  scores: z.array(z.object({
    label: z.enum(["Performance", "Accessibility", "Best Practices", "SEO"]),
    score: z.number().describe("Score from 0 to 100"),
    color: z.enum(["text-white", "text-[#ccb999]"])
  })),
  suggestions: z.array(z.object({
    title: z.string(),
    description: z.string().describe("Specific description relating to the audited website"),
    severity: z.enum(["crucial", "normal", "optional"]),
    fix_code: z.string().describe("Exact code snippet to fix the issue")
  }))
});

// We'll create the OpenAI client dynamically per request if a custom key is provided
const getDefaultOpenAI = () => new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000", 
    "X-Title": "AI Website Auditor",
  }
});

export async function POST(req: NextRequest) {
  try {
    const { url, deepCrawl, userId, openRouterKey, scrapingDepth, domSanitization } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }
    
    // --- RATE LIMIT CHECK ---
    if (process.env.UPSTASH_REDIS_REST_URL) {
      const ip = (req as any).ip ?? req.headers?.get?.('x-forwarded-for') ?? 'anonymous';
      const identifier = userId ? `audit_user_${userId}` : `audit_ip_${ip}`;
      const { success, limit, reset, remaining } = await rateLimit.limit(identifier);
      if (!success) {
        console.warn(`Rate limit exceeded for ${identifier}`);
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please wait a minute before requesting another audit.' },
          { status: 429, headers: { 'X-RateLimit-Limit': limit.toString(), 'X-RateLimit-Remaining': remaining.toString(), 'X-RateLimit-Reset': reset.toString() } }
        );
      }
    }

    const openai = openRouterKey ? new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: openRouterKey,
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000", 
        "X-Title": "AI Website Auditor",
      }
    }) : getDefaultOpenAI();

    let targetUrl = url;
    if (!targetUrl.startsWith('http')) {
      targetUrl = `https://${targetUrl}`;
    }

    // --- SSRF CHECK ---
    const urlCheck = validateTargetUrl(targetUrl);
    if (!urlCheck.valid) {
      return NextResponse.json({ error: urlCheck.reason }, { status: 400 });
    }

    console.log(`[Audit API] Starting ${deepCrawl ? 'DEEP' : 'STANDARD'} audit for: ${targetUrl}`);
    
    // --- DATABASE CACHE CHECK ---
    let docRef: any = null;
    let docId = '';
    
    // Only attempt database cache if project ID is defined
    if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      // Append _deep to the cache key if it's a deep crawl so they don't overwrite each other
      docId = targetUrl.replace(/[^a-zA-Z0-9]/g, '_') + (deepCrawl ? '_deep' : '');
      docRef = doc(db, 'audits', docId);
      
      try {
        console.log(`[Audit API] Checking cache for ${docId}...`);
        // Wrap getDoc in a 5-second timeout so it never hangs infinitely
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Firebase timeout")), 5000));
        const docSnap = await Promise.race([getDoc(docRef), timeoutPromise]) as any;
        
        if (docSnap && docSnap.exists()) {
          const data = docSnap.data();
          const ageInHours = (Date.now() - (data.createdAt || 0)) / (1000 * 60 * 60);
          
          if (ageInHours < 24) {
            console.log(`[Audit API] Cache HIT for ${targetUrl}. Returning saved audit.`);
            return NextResponse.json(data);
          }
        }
      } catch (dbError) {
        console.log(`[Audit API] Firestore cache check failed or timed out. Proceeding to live audit.`, dbError);
      }
    }


    // --- USER TIER FETCH ---
    let userTier = 'free';
    if (userId && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      try {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          userTier = userDocSnap.data().userTier || 'free';
        }
      } catch (e) {
        console.error("Failed to fetch user tier, defaulting to free", e);
      }
    }

    let aggregatedData = {
      pagesAnalyzed: 0,
      titles: [] as string[],
      metaDescriptions: [] as string[],
      totalImagesWithoutAlt: 0,
      totalH1Count: 0,
      bodyTextSnippet: "",
      lighthouse: null as any
    };
    let screenshotBase64 = null;
    const startTime = Date.now();

    // --- LIGHTHOUSE API FETCH ---
    console.log(`[Audit API] Fetching Google PageSpeed Insights for ${targetUrl}...`);
    try {
      const lhUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&category=performance&category=accessibility&category=best-practices&category=seo`;
      const lhRes = await fetch(lhUrl);
      if (lhRes.ok) {
        const lhData = await lhRes.json();
        const categories = lhData?.lighthouseResult?.categories;
        if (categories) {
          aggregatedData.lighthouse = {
            Performance: Math.round((categories.performance?.score || 0) * 100),
            Accessibility: Math.round((categories.accessibility?.score || 0) * 100),
            BestPractices: Math.round((categories['best-practices']?.score || 0) * 100),
            SEO: Math.round((categories.seo?.score || 0) * 100)
          };
        }
      }
    } catch (e) {
      console.log(`[Audit API] Lighthouse fetch failed.`, e);
    }

    // --- TWO TIER ROUTING ---
    if (userTier !== 'pro') {
      console.log(`[Audit API] FREE TIER - Launching lightweight static scraper for ${targetUrl}...`);
      try {
        const res = await fetch(targetUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });
        const html = await res.text();
        const $ = cheerio.load(html);
        
        aggregatedData.pagesAnalyzed = 1;
        const title = $('title').text() || 'Unknown Title';
        aggregatedData.titles.push(title);
        
        const metaDesc = $('meta[name="description"]').attr('content');
        if (metaDesc) aggregatedData.metaDescriptions.push(metaDesc);
        
        aggregatedData.totalH1Count = $('h1').length;
        aggregatedData.totalImagesWithoutAlt = $('img:not([alt])').length;
        
        if (domSanitization !== false) {
          $('script, style, svg, noscript, iframe').remove();
        }
        aggregatedData.bodyTextSnippet = `\n--- Page: ${targetUrl} ---\n` + $('body').text().substring(0, 3000).replace(/\s+/g, ' ');
      } catch (e) {
        console.log(`[Audit API] Static scraper failed:`, e);
      }
    } else {
      console.log(`[Audit API] PRO TIER - Launching headless browser...`);
      let browser: Browser | null = null;
      const urlsToScrape = [targetUrl];
      const scrapedUrls = new Set<string>();
      const MAX_PAGES = deepCrawl ? 3 : 1;

      try {
        if (process.env.BROWSERLESS_API_KEY) {
          browser = await chromium.connectOverCDP(`wss://chrome.browserless.io?token=${process.env.BROWSERLESS_API_KEY}`);
        } else {
          browser = await chromium.launch({ headless: true });
        }
      
        const context = await browser.newContext({
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          viewport: { width: 1920, height: 1080 },
          extraHTTPHeaders: {
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Upgrade-Insecure-Requests': '1'
          }
        });
      
        while (urlsToScrape.length > 0 && aggregatedData.pagesAnalyzed < MAX_PAGES) {
          const currentUrl = urlsToScrape.shift()!;
          const urlWithoutHash = currentUrl.split('#')[0];
          if (scrapedUrls.has(urlWithoutHash)) continue;
          
          console.log(`[Audit API] Crawling [${aggregatedData.pagesAnalyzed + 1}/${MAX_PAGES}]: ${currentUrl}`);
          const page = await context.newPage();
          try {
            await page.goto(currentUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
            
            if (aggregatedData.pagesAnalyzed === 0) {
              console.log(`[Audit API] Capturing screenshot of home page...`);
              const isFullPage = scrapingDepth !== 'viewport';
              const screenshotBuffer = await page.screenshot({ type: 'jpeg', quality: 50, fullPage: isFullPage, scale: 'css' }).catch(() => null);
              screenshotBase64 = screenshotBuffer ? screenshotBuffer.toString('base64') : null;
            }

            const title = await page.title().catch(() => 'Unknown Title');
            const metaDescription = await page.evaluate(() => {
              const meta = document.querySelector('meta[name="description"]');
              return meta ? meta.getAttribute('content') : null;
            }).catch(() => null);

            const imagesWithoutAlt = await page.evaluate(() => document.querySelectorAll('img:not([alt])').length).catch(() => 0);
            const h1Count = await page.evaluate(() => document.querySelectorAll('h1').length).catch(() => 0);
            
            if (domSanitization !== false) {
              await page.evaluate(() => {
                document.querySelectorAll('script, style, svg, noscript, iframe').forEach(el => el.remove());
              }).catch(() => {});
            }
            const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 3000)).catch(() => '');

            aggregatedData.pagesAnalyzed++;
            aggregatedData.titles.push(title);
            if (metaDescription) aggregatedData.metaDescriptions.push(metaDescription);
            aggregatedData.totalImagesWithoutAlt += imagesWithoutAlt;
            aggregatedData.totalH1Count += h1Count;
            aggregatedData.bodyTextSnippet += `\n--- Page: ${currentUrl} ---\n${bodyText}`;

            if (deepCrawl && aggregatedData.pagesAnalyzed < MAX_PAGES) {
              const links = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('a[href]'))
                  .map(a => (a as HTMLAnchorElement).href)
                  .filter(href => href.startsWith(window.location.origin) && !href.includes('#'));
              }).catch(() => []);
              
              for (const link of links) {
                if (!scrapedUrls.has(link) && !urlsToScrape.includes(link)) {
                  urlsToScrape.push(link);
                }
              }
            }
          } catch (e) {
            console.log(`[Audit API] Error crawling ${currentUrl}:`, e);
          } finally {
            scrapedUrls.add(urlWithoutHash);
            await page.close();
          }
        }
      } finally {
        if (browser) {
          await browser.close();
        }
      }
    }

    const loadTimeSeconds = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`[Audit API] Scraping complete in ${loadTimeSeconds}s. Analyzed ${aggregatedData.pagesAnalyzed} pages. Triggering AI Analysis...`);

    // --- STEP 2: Analyze with OpenRouter ---
    const prompt = `
    You are an expert AI Website Auditor. Analyze the following scraped website data and generate an audit report.
    This was a ${deepCrawl ? 'Deep Crawl (multiple pages)' : 'Single Page Crawl'}.
    
    Website Origin: ${targetUrl}
    Pages Analyzed: ${aggregatedData.pagesAnalyzed}
    Titles found: ${JSON.stringify(aggregatedData.titles)}
    Meta Descriptions found: ${JSON.stringify(aggregatedData.metaDescriptions)}
    Total Crawl Time: ${loadTimeSeconds} seconds
    Total Images missing alt tags across all pages: ${aggregatedData.totalImagesWithoutAlt}
    Total H1 tags across all pages: ${aggregatedData.totalH1Count}\n    Google Lighthouse Metrics (Hard Data): ${JSON.stringify(aggregatedData.lighthouse || 'Unavailable')}
    
    Aggregated Content Snippets:
    ${aggregatedData.bodyTextSnippet.substring(0, 3000)}
    
    Based on this data (including the deterministic Google Lighthouse Metrics if available) AND the provided screenshot (which shows the visual layout), provide:
    1. An overall health score (0-100). Calculate this realistically based on UX, design contrast, load time, missing alts, multi-page consistency, etc.
    2. 4 specific scores (Performance, Accessibility, Best Practices, SEO) out of 100.
    3. A list of exactly 4 specific, actionable suggestions for improvement derived directly from the scraped data and the screenshot above. DO NOT give generic advice. Mention specific visual layout issues if you see them.
    `;

    // Multimodal payload setup
    const userMessageContent: any[] = [{ type: "text", text: prompt }];
    if (screenshotBase64) {
      userMessageContent.push({
        type: "image_url",
        image_url: {
          url: `data:image/jpeg;base64,${screenshotBase64}`,
          detail: "low" // Keep it low detail to save tokens
        }
      });
    }

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: "You are an expert technical SEO, UX designer, and performance auditor." },
        { role: "user", content: userMessageContent }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "AuditReport",
          strict: true,
          schema: zodToJsonSchema(AuditReportSchema as any) as any
        }
      },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const resultText = completion.choices[0].message.content;
    console.log(`[Audit API] Analysis complete!`);
    
    let parsedResult;
    try {
      const sanitizedResult = (resultText || "{}").replace(/```json/g, "").replace(/```/g, "").trim();
      parsedResult = JSON.parse(sanitizedResult);
      parsedResult.url = targetUrl; 
      parsedResult.screenshotBase64 = screenshotBase64; 
      parsedResult.createdAt = Date.now();
      parsedResult.isDeepCrawl = !!deepCrawl;
    } catch (e) {
      console.error("Failed to parse OpenRouter JSON output", resultText);
      throw new Error("Invalid JSON from LLM");
    }

    // --- DATABASE CACHE SAVE ---
    if (docRef) {
      try {
        console.log(`[Audit API] Attempting to save new audit to database...`);
        const saveTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Firebase write timeout")), 3000));
        await Promise.race([setDoc(docRef, parsedResult), saveTimeout]);
        console.log(`[Audit API] Saved new audit for ${targetUrl} to database.`);
        
        // Also save a lightweight reference to user's history if logged in
        if (userId) {
          const historyId = Date.now().toString();
          const userHistoryRef = doc(db, 'users', userId, 'history', historyId);
          const lightweightDoc = {
            url: targetUrl,
            createdAt: parsedResult.createdAt,
            overall_health: parsedResult.overall_health,
            reportRef: docId
          };
          await Promise.race([setDoc(userHistoryRef, lightweightDoc), saveTimeout]);
        }
      } catch (dbError) {
        console.log(`[Audit API] Failed to save to Firestore (bypassing so UI doesn't freeze):`, dbError);
      }
    }

    return NextResponse.json(parsedResult);

  } catch (error: any) {
    console.error("[Audit API] Error:", error);
    return NextResponse.json(
      { error: "Failed to audit website", details: error.message },
      { status: 500 }
    );
  }
}
