import { chromium } from 'playwright';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testBrowserless() {
  const apiKey = process.env.BROWSERLESS_API_KEY;
  if (!apiKey) {
    console.error('❌ Error: BROWSERLESS_API_KEY is not set in .env.local');
    process.exit(1);
  }

  console.log('🔌 Connecting to Browserless.io cloud browser via CDP...');
  
  try {
    const browser = await chromium.connectOverCDP(
      `wss://chrome.browserless.io?token=${apiKey}`
    );
    console.log('✅ Connected successfully!');

    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('🌐 Navigating to https://example.com...');
    await page.goto('https://example.com', { waitUntil: 'networkidle' });

    const title = await page.title();
    console.log(`📄 Page Title retrieved: "${title}"`);

    const screenshot = await page.screenshot({ type: 'jpeg', quality: 50 });
    console.log(`📸 Screenshot captured successfully! Buffer size: ${(screenshot.length / 1024).toFixed(2)} KB`);

    await browser.close();
    console.log('🔒 Remote browser connection closed cleanly.');
  } catch (error) {
    console.error('❌ Browserless Connection Failed:', error);
  }
}

testBrowserless();
