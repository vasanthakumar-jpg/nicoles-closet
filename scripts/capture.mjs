import { chromium, devices } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const [name, options] of [['desktop', { viewport: { width: 1440, height: 900 } }], ['mobile', devices['iPhone 13']]]) {
    const context = await browser.newContext(options);
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:5173/');
    await page.locator('.intro-video').waitFor();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `artifacts/${name}-intro.png` });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `artifacts/${name}-door-open.png` });
    await page.locator('.atrium-source').waitFor({ timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `artifacts/${name}-home.png` });
    await page.getByRole('button', { name: 'Open Just Nikki', exact: true }).click();
    await page.getByLabel('Just Nikki video', { exact: true }).waitFor();
    await page.waitForTimeout(800);
    await page.screenshot({ path: `artifacts/${name}-chapter.png` });
    await context.close();
  }
} finally { await browser.close(); }
console.log('Saved image-only desktop and mobile visual checks in artifacts/.');

