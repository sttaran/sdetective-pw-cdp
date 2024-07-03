import { test, expect } from '@playwright/test';
import {NETWORK_PRESETS} from "../src/data/networkPresets";
const DELAY_MS = 5_000;

test.describe('Network Throttle with delay', () => {
  test('defer particular requests with predefined time', async ({ page }) => {
    await page.route('todomvc/js/*.js', async route => {
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
      await route.continue();
    });

    await page.goto('/todomvc');
    await page.waitForLoadState('domcontentloaded');
  });
})


test.describe.only('Network Throttle emulation', () => {
    for (const [name, value] of Object.entries(NETWORK_PRESETS)) {
    test(`emulate network throttle "${name}"`, async ({ context, page }) => {
      const cdpSession = await context.newCDPSession(page)
      await cdpSession.send('Network.emulateNetworkConditions', value);

      await page.goto('/todomvc');
      await page.waitForLoadState('domcontentloaded');

      await page.locator('.new-todo').fill("Network Throttle");
      await page.keyboard.press('Enter');
    });
    }

    test(`No throttle"`, async ({page }) => {
        await page.goto('/todomvc');
        await page.waitForLoadState('domcontentloaded');

        await page.locator('.new-todo').fill("Network Throttle");
        await page.keyboard.press('Enter');
    });
})
