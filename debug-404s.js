const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const failed404s = [];
  const allFailedRequests = [];
  const consoleErrors = [];

  // Capture all failed network requests
  page.on('response', async (response) => {
    const status = response.status();
    const url = response.url();

    if (status === 404) {
      failed404s.push({
        url,
        status,
        method: response.request().method(),
        resourceType: response.request().resourceType()
      });
      console.log(`❌ 404: ${url}`);
    } else if (status >= 400) {
      allFailedRequests.push({
        url,
        status,
        method: response.request().method(),
        resourceType: response.request().resourceType()
      });
      console.log(`⚠️  ${status}: ${url}`);
    }
  });

  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      consoleErrors.push(text);
      console.log(`💥 [Console Error] ${text}`);
    }
  });

  // Capture page errors
  page.on('pageerror', error => {
    consoleErrors.push(error.message);
    console.log(`💥 [Page Error] ${error.message}`);
  });

  console.log('🚀 Navigating to http://localhost:3000...');

  try {
    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait a bit more to ensure all lazy-loaded chunks are attempted
    await page.waitForTimeout(5000);

  } catch (error) {
    console.log(`⚠️  Navigation error: ${error.message}`);
  }

  // Analyze the results
  console.log('\n📊 ANALYSIS REPORT\n');
  console.log(`Total 404 errors: ${failed404s.length}`);
  console.log(`Total failed requests: ${allFailedRequests.length}`);
  console.log(`Total console errors: ${consoleErrors.length}`);

  if (failed404s.length > 0) {
    console.log('\n🔍 404 ERRORS BY PATH PATTERN:\n');

    const pathPatterns = {
      rootCommon: [],
      rootHr: [],
      correctCommon: [],
      correctHr: [],
      other: []
    };

    failed404s.forEach(req => {
      const url = req.url;
      if (url.match(/^http:\/\/localhost:3000\/[0-9]+\.js$/)) {
        pathPatterns.rootCommon.push(url);
      } else if (url.includes('/hr/') && !url.includes('//')) {
        pathPatterns.correctHr.push(url);
      } else if (url.includes('/common/') && !url.includes('//')) {
        pathPatterns.correctCommon.push(url);
      } else {
        pathPatterns.other.push(url);
      }
    });

    console.log('Files requested from ROOT (should be in /common/ or /hr/):');
    pathPatterns.rootCommon.forEach(url => console.log(`  - ${url}`));

    console.log('\nFiles requested from /hr/ (but not found):');
    pathPatterns.correctHr.forEach(url => console.log(`  - ${url}`));

    console.log('\nFiles requested from /common/ (but not found):');
    pathPatterns.correctCommon.forEach(url => console.log(`  - ${url}`));

    console.log('\nOther failed requests:');
    pathPatterns.other.forEach(url => console.log(`  - ${url}`));
  }

  // Save detailed report to file
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total404s: failed404s.length,
      totalFailed: allFailedRequests.length,
      totalConsoleErrors: consoleErrors.length
    },
    failed404s,
    allFailedRequests,
    consoleErrors: [...new Set(consoleErrors)] // unique errors only
  };

  fs.writeFileSync('404-report.json', JSON.stringify(report, null, 2));
  console.log('\n💾 Detailed report saved to 404-report.json');

  await browser.close();
})();
