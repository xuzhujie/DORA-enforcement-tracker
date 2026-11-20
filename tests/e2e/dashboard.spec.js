/* global document, window */

import { expect, test } from '@playwright/test';

test('desktop flow supports bilingual filtering, review, sources, and updates', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '监管执法追踪' })).toBeVisible();

  await page.getByRole('button', { name: 'EN' }).click();
  await expect(page.getByRole('heading', { name: 'Enforcement tracker' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Source registry' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Official update events' })).toBeVisible();

  await page.getByLabel('Regime', { exact: true }).selectOption('DORA');
  await expect(page.locator('tbody tr')).toHaveCount(4);
  await page.getByLabel('Relevance', { exact: true }).selectOption('data-intermediary');
  await expect(page.locator('tbody tr')).toHaveCount(0);
  await expect(page.getByText('No records match the current filters')).toBeVisible();

  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.locator('tbody tr')).toHaveCount(4);
  await page.getByLabel('Record type', { exact: true }).selectOption('guidance');
  await expect(page.locator('tbody tr')).toHaveCount(1);
  await page.getByRole('button', { name: 'Reset' }).click();
  await expect(page.locator('tbody tr')).toHaveCount(4);
  await expect(page.locator('a[href="https://www.eba.europa.eu/activities/direct-supervision-and-oversight/digital-operational-resilience-act/dora-oversight"]').first()).toHaveAttribute('href', /dora-oversight/);

  await page.getByRole('button', { name: 'Mark locally reviewed' }).click();
  await expect(page.getByRole('button', { name: 'Reviewed locally' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Review history' })).toBeVisible();
});

test('upcoming actions expose delivery impact and open the matching detail', async ({ page }) => {
  await page.goto('/');

  const firstAction = page.locator('.action-row').first();
  await expect(firstAction).toContainText('核对供应商清单、登记信息和替代方案中是否涉及指定 CTPP。');
  await expect(firstAction).toContainText('需要把 CTPP 线索与供应商登记、集中度评估和退出方案交叉核对。');
  await firstAction.click();

  await expect(page.getByRole('heading', { name: '关键 ICT 第三方服务商指定（CTPP）' })).toBeVisible();
  await expect(page.locator('.detail-panel').getByText('核对供应商清单、登记信息和替代方案中是否涉及指定 CTPP。', { exact: true })).toBeVisible();
  await expect(page.locator('.detail-panel').getByText('共享复核闸门', { exact: true })).toBeVisible();
  await expect(page.locator('.detail-panel').getByText('待业务 / 法务复核', { exact: true })).toBeVisible();
  await expect(page.locator('.detail-panel').getByText('官方来源整理已完成；仍需业务与法务复核适用性。lastUpdate 是追踪器整理/复核日期，publishedAt 是官方来源日期，内部行动日期是复核目标，不是监管期限。', { exact: true })).toBeVisible();
  await expect(page.locator('.detail-panel').getByText('等待业务与法务复核适用性。', { exact: true })).toBeVisible();
  await expect(page.locator('.detail-facts .record-type-chip').getByText('指定/名单', { exact: true })).toBeVisible();
});

test('english upcoming actions keep localized delivery copy and detail', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'EN' }).click();

  const firstAction = page.locator('.action-row').first();
  await expect(firstAction).toContainText('Check whether designated CTPPs appear in the supplier list, register, or exit alternatives.');
  await expect(firstAction).toContainText('Cross-check the CTPP lead against the supplier register, concentration assessment, and exit plans.');
  await firstAction.click();

  await expect(page.getByRole('heading', { name: 'Designation of critical ICT third-party providers (CTPPs)' })).toBeVisible();
  await expect(page.locator('.detail-panel').getByText('Check whether designated CTPPs appear in the supplier list, register, or exit alternatives.', { exact: true })).toBeVisible();
  await expect(page.locator('.detail-panel').getByText('Shared review gate', { exact: true })).toBeVisible();
  await expect(page.locator('.detail-panel').getByText('Business / Legal review pending', { exact: true })).toBeVisible();
  await expect(page.locator('.detail-panel').getByText('Official-source extraction prepared; business and legal applicability review is still required. lastUpdate is the tracker preparation/review date, publishedAt is the official source date, and internal due dates are review targets rather than regulatory deadlines.', { exact: true })).toBeVisible();
  await expect(page.locator('.detail-panel').getByText('Awaiting business and legal applicability review.', { exact: true })).toBeVisible();
  await expect(page.locator('.detail-facts .record-type-chip').getByText('Designation', { exact: true })).toBeVisible();
});

test('stale verification dates are visible without causing page overflow', async ({ page }) => {
  await page.route('**/data/records.json', async (route) => {
    const response = await route.fetch();
    const snapshot = await response.json();
    snapshot.records[0].lastVerifiedAt = '2026-10-01';
    await route.fulfill({
      response,
      body: JSON.stringify(snapshot),
      headers: { ...response.headers(), 'content-type': 'application/json' },
    });
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect(page.locator('.freshness-stale').first()).toHaveText('需重新核验');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
});

test('mobile trend chart stays within the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  const chartFits = await page.locator('.trend-chart').evaluate((chart) => chart.getBoundingClientRect().width <= chart.parentElement.getBoundingClientRect().width + 1);
  expect(overflow).toBe(false);
  expect(chartFits).toBe(true);
});

test('compact mobile header stays within a 320px viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/');

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
});
