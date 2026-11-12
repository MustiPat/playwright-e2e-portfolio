import { test, expect } from '@playwright/test';

const SECTIONS = ['services', 'work', 'process', 'about', 'faq', 'contact'];

const SERVICES = [
  'Custom software and APIs',
  'AI development',
  'Integrations and automation',
  'Secure code review and testing',
  'QA and test automation',
  'Legacy modernisation',
];

test.describe('Portfolio site', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has a descriptive title and exactly one h1', async ({ page }) => {
    await expect(page).toHaveTitle(/Senior \.NET & Angular Engineer/);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText('keeps running after launch');
  });

  test('every navigation link points at an existing section', async ({ page }) => {
    for (const id of SECTIONS) {
      await expect(page.locator('nav a[href="#' + id + '"]').first()).toHaveCount(1);
      await expect(page.locator('section#' + id)).toHaveCount(1);
    }
  });

  test('clicking a navigation link scrolls to its section', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'navigation is collapsed on small screens');
    for (const id of SECTIONS) {
      await page.locator('nav a[href="#' + id + '"]').first().click();
      await expect(page).toHaveURL(new RegExp('#' + id + '$'));
      await expect(page.locator('section#' + id)).toBeInViewport({ ratio: 0.05 });
    }
  });

  test('lists the six service lines in order', async ({ page }) => {
    await expect(page.locator('#services h3')).toHaveText(SERVICES);
  });

  test('shows seven case studies', async ({ page }) => {
    await expect(page.locator('#work h3')).toHaveCount(7);
    await expect(page.locator('#work h3').last()).toHaveText('End-to-end test suite for a live website');
  });

  test('FAQ answers expand and collapse', async ({ page }) => {
    const items = page.locator('#faq details');
    await expect(items).toHaveCount(7);
    const first = items.first();
    await expect(first).not.toHaveAttribute('open', /.*/);
    await first.locator('summary').click();
    await expect(first).toHaveAttribute('open', /.*/);
    await first.locator('summary').click();
    await expect(first).not.toHaveAttribute('open', /.*/);
  });

  test('the open-source demo link is reachable', async ({ page, request }) => {
    const link = page.locator('#work a[href*="github.com/MustiPat/docqa-dotnet"]').first();
    await expect(link).toHaveCount(1);
    const href = await link.getAttribute('href');
    const response = await request.get(href!);
    expect(response.ok()).toBeTruthy();
  });

  test('contact options are valid mailto links', async ({ page }) => {
    const mails = page.locator('a[href^="mailto:"]');
    expect(await mails.count()).toBeGreaterThan(0);
    for (const href of await mails.evaluateAll(els => els.map(e => e.getAttribute('href') ?? ''))) {
      expect(href).toMatch(/^mailto:[^@\s]+@[^@\s]+\.[a-z]{2,}/i);
    }
  });

  test('images have alternative text', async ({ page }) => {
    const missing = await page.locator('img').evaluateAll(
      imgs => imgs.filter(i => !(i.getAttribute('alt') ?? '').trim()).length,
    );
    expect(missing).toBe(0);
  });

  test('page has no horizontal scrolling', async ({ page }) => {
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test('loads without uncaught script errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.reload();
    await page.waitForLoadState('networkidle');
    expect(errors).toEqual([]);
  });
});
