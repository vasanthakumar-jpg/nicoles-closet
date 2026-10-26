import { test, expect } from '@playwright/test';
const sections = [
  { id: 'it-division', name: 'IT Division', marker: [29, 11] },
  { id: 'design-section', name: 'Design Section', marker: [72, 10] },
  { id: 'jack-duke', name: 'Jack Duke', marker: [10, 40] },
  { id: 'cl-california', name: 'CL California', marker: [28, 47] },
  { id: 'nicoles-closet', name: 'Nicole’s Closet', marker: [49, 47] },
  { id: 'nicole-duke', name: 'Nicole Duke', marker: [63, 47] },
  { id: 'just-nikki', name: 'Just Nikki', marker: [77, 47] },
  { id: 'nicoles-place', name: 'Nicole’s Place', marker: [92, 47] },
];

test('intro video autoplays without a loading screen and reveals the atrium on end', async ({ page }) => {
  test.setTimeout(60000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('.loading-scene')).toHaveCount(0);
  const video = page.locator('.intro-video');
  await expect(video).toBeVisible();
  await expect(video).toHaveAttribute('src', '/media/Woman_and_girl_opening_door_20261024114408.mp4');
  await expect(video).toHaveJSProperty('muted', true);
  await expect(video).toHaveJSProperty('paused', false);
  await expect.poll(() => video.evaluate(element => (element as HTMLVideoElement).currentTime)).toBeGreaterThan(0);
  await expect(page.getByRole('button')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Skip intro' })).toBeVisible();
  await expect(page).toHaveURL(/#home$/, { timeout: 45000 });
  await expect(page.locator('.atrium-source')).toBeVisible();
  await expect(page.locator('.atrium-source')).toHaveAttribute('src', '/media/Nicole’s Fashion Empire Atrium.png');
  await expect(page.locator('header,footer,h1,h2,p,nav,video')).toHaveCount(0);
  await expect(page.locator('main')).toHaveText('');
  expect(errors).toEqual([]);
});

test('all eight correct sections open visual chapters and return', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('/#home');
  await expect(page.locator('.image-hotspot')).toHaveCount(8, { timeout: 6000 });
  for (const section of sections) {
    await page.getByRole('button', { name: `Open ${section.name}`, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`#section/${section.id}$`));
    await expect(page.getByRole('region', { name: `${section.name} visual chapter` })).toBeVisible();
    if (section.id === 'just-nikki') await expect(page.getByLabel('Just Nikki video', { exact: true })).toBeVisible();
    else await expect(page.getByRole('img', { name: section.name, exact: true })).toBeVisible();
    await expect(page.locator('.chapter-image-scene')).toHaveText('Back');
    await expect(page.getByRole('button')).toHaveCount(1);
    await expect(page.locator('header,footer,h1,h2,p,ul,nav')).toHaveCount(0);
    await page.getByRole('button', { name: 'Back to atrium' }).click();
    await expect(page).toHaveURL(/#home$/);
    await expect(page.locator('.image-hotspot')).toHaveCount(8);
  }
});

test('markers align with visible signs and remain within the actual image', async ({ page }) => {
  await page.goto('/#home');
  await expect(page.locator('.atrium-source')).toBeVisible({ timeout: 6000 });
  const image = await page.locator('.atrium-source').boundingBox();
  expect(image).toBeTruthy();
  for (const section of sections) {
    const target = page.getByRole('button', { name: `Open ${section.name}`, exact: true });
    const marker = await target.locator('.hotspot-indicator').boundingBox();
    expect(marker).toBeTruthy();
    expect(Math.abs((marker!.x + marker!.width / 2 - image!.x) / image!.width * 100 - section.marker[0])).toBeLessThan(.15);
    expect(Math.abs((marker!.y + marker!.height / 2 - image!.y) / image!.height * 100 - section.marker[1])).toBeLessThan(.15);
    const box = await target.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(image!.x - 1);
    expect(box!.x + box!.width).toBeLessThanOrEqual(image!.x + image!.width + 1);
  }
});

test('skip, escape, keyboard focus, browser Back and Forward work', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Skip intro' }).click({ timeout: 6000 });
  const target = page.getByRole('button', { name: 'Open CL California', exact: true });
  await target.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('img', { name: 'CL California', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/#home$/);
  await expect(target).toBeFocused();
  await page.getByRole('button', { name: 'Open Just Nikki', exact: true }).click();
  await expect(page.getByLabel('Just Nikki video', { exact: true })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/#home$/);
  await expect(page.locator('.image-hotspot')).toHaveCount(8);
  await page.goForward();
  await expect(page.getByLabel('Just Nikki video', { exact: true })).toBeVisible();
});

test('reduced motion, repeated clicks, and responsive frames have no page overflow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Skip intro' }).click();
  await expect(page).toHaveURL(/#home$/, { timeout: 8000 });
  await expect(page.locator('.image-hotspot')).toHaveCount(8);
  await page.getByRole('button', { name: 'Open Nicole Duke', exact: true }).dblclick();
  await expect(page.getByRole('img', { name: 'Nicole Duke', exact: true })).toBeVisible();
  for (const viewport of [{ width: 320, height: 640 }, { width: 768, height: 1024 }, { width: 1440, height: 900 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(viewport);
    const dimensions = await page.evaluate(() => ({ width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.width);
    expect(dimensions.scrollHeight).toBeLessThanOrEqual(dimensions.height);
  }
});


test('Just Nikki hotspot transitions into autoplay video and Back allows replay', async ({ page }) => {
  await page.goto('/#home');
  await page.getByRole('button', { name: 'Open Just Nikki', exact: true }).click();
  await expect(page).toHaveURL(/#section\/just-nikki$/);
  const video = page.getByLabel('Just Nikki video', { exact: true });
  await expect(video).toBeVisible();
  await expect(video).toHaveAttribute('src', '/media/JustNikki.mp4');
  await expect(video).toHaveAttribute('controls', '');
  await expect(video).toHaveJSProperty('muted', true);
  await expect(video).toHaveJSProperty('paused', false);
  await expect.poll(() => video.evaluate(element => (element as HTMLVideoElement).currentTime)).toBeGreaterThan(0);
  await expect(page.locator('.chapter-image-scene')).toHaveText('Back');
  await page.getByRole('button', { name: 'Back to atrium' }).click();
  await expect(page.locator('.chapter-video')).toHaveCount(0);
  await page.getByRole('button', { name: 'Open Just Nikki', exact: true }).click();
  await expect(video).toHaveJSProperty('paused', false);
  await expect.poll(() => video.evaluate(element => (element as HTMLVideoElement).currentTime)).toBeGreaterThan(0);
  await page.keyboard.press('Escape');
  await expect(page.locator('.chapter-video')).toHaveCount(0);
  await expect(page.locator('.image-hotspot')).toHaveCount(8);
});
