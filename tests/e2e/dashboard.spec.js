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
  await expect(page.locator('a[href="https://www.eba.europa.eu/activities/direct-supervision-and-oversight/digital-operational-resilience-act/dora-oversight"]').first()).toHaveAttribute('href', /dora-oversight/);

  await page.getByRole('button', { name: 'Mark as reviewed' }).click();
  await expect(page.getByRole('button', { name: 'Marked as reviewed' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Review history' })).toBeVisible();
});

test('upcoming actions expose delivery impact and open the matching detail', async ({ page }) => {
  await page.goto('/');

  const firstAction = page.locator('.action-row').first();
  await expect(firstAction).toContainText('确认重大 ICT 事件分类与升级路径是否留痕。');
  await expect(firstAction).toContainText('影响事件分级、通知时限和客户沟通证据。');
  await firstAction.click();

  await expect(page.getByRole('heading', { name: '重大 ICT 事件报告' })).toBeVisible();
  await expect(page.locator('.detail-panel').getByText('确认重大 ICT 事件分类与升级路径是否留痕。', { exact: true })).toBeVisible();
});

test('english upcoming actions keep localized delivery copy and detail', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'EN' }).click();

  const firstAction = page.locator('.action-row').first();
  await expect(firstAction).toContainText('Confirm that major ICT incident classification and escalation paths are evidenced.');
  await expect(firstAction).toContainText('Affects incident severity, notification timelines, and customer-communication evidence.');
  await firstAction.click();

  await expect(page.getByRole('heading', { name: 'Major ICT-related incident reporting' })).toBeVisible();
  await expect(page.locator('.detail-panel').getByText('Confirm that major ICT incident classification and escalation paths are evidenced.', { exact: true })).toBeVisible();
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
