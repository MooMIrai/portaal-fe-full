#!/usr/bin/env node

/**
 * Playwright Browser Inspector
 *
 * This script launches a Chromium browser to inspect the application running on localhost:3000.
 * It captures console logs, network errors, and JavaScript errors for debugging.
 *
 * Usage: yarn debug:browser
 */

const { chromium } = require('@playwright/test');

async function inspectBrowser() {
  console.log('🚀 Launching Chromium browser...\n');

  // Launch browser in headed mode (with UI)
  const browser = await chromium.launch({
    headless: false,
    slowMo: 100, // Slow down actions by 100ms for better visibility
    args: [
      '--start-maximized',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  const context = await browser.newContext({
    viewport: null, // Use full browser window
    ignoreHTTPSErrors: true
  });

  const page = await context.newPage();

  // Capture console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();

    const emoji = {
      'error': '❌',
      'warning': '⚠️',
      'info': 'ℹ️',
      'log': '📝'
    }[type] || '📝';

    console.log(`${emoji} [Console ${type}] ${text}`);
  });

  // Capture page errors
  page.on('pageerror', error => {
    console.error('💥 [Page Error]', error.message);
  });

  // Capture request failures
  page.on('requestfailed', request => {
    console.error('🌐 [Request Failed]', request.url(), request.failure().errorText);
  });

  // Capture responses (specifically 404s)
  page.on('response', response => {
    const status = response.status();
    if (status === 404) {
      console.error(`🔴 [404 Not Found] ${response.url()}`);
    } else if (status >= 400) {
      console.error(`🔴 [HTTP ${status}] ${response.url()}`);
    }
  });

  console.log('📍 Navigating to http://localhost:3000...\n');

  try {
    await page.goto('http://localhost:3000', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    console.log('✅ Page loaded successfully!');
    console.log('🔍 Inspect the browser window. Press Ctrl+C to exit.\n');

    // Keep the script running (browser stays open)
    await new Promise(() => {});

  } catch (error) {
    console.error('\n❌ Error loading page:', error.message);
    await browser.close();
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Closing browser...');
  process.exit(0);
});

// Run the inspector
inspectBrowser().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
