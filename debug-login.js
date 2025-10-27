const { chromium } = require('playwright');

async function testLogin(baseUrl, label) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing ${label} (${baseUrl})`);
  console.log('='.repeat(60) + '\n');

  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  const networkCalls = [];
  const responses = [];

  // Cattura errori console
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const error = msg.text();
      errors.push(error);
      console.log(`[Console Error] ${error}`);
    }
  });

  // Cattura page errors
  page.on('pageerror', error => {
    errors.push(`Page Error: ${error.message}`);
    console.log(`[Page Error] ${error.message}`);
  });

  // Cattura richieste network
  page.on('request', request => {
    const url = request.url();
    if (url.includes('getMyPermissions') || url.includes('/auth/') || url.includes('basic')) {
      const call = {
        url: url,
        method: request.method(),
        headers: request.headers()
      };
      networkCalls.push(call);
      console.log(`[Request] ${call.method} ${url}`);
      if (url.includes('getMyPermissions')) {
        console.log(`  Headers:`, JSON.stringify(call.headers, null, 2));
      }
    }
  });

  // Cattura risposte
  page.on('response', async response => {
    const url = response.url();
    if (url.includes('getMyPermissions') || url.includes('/auth/basic')) {
      console.log(`[Response] ${response.status()} ${url}`);
      try {
        const contentType = response.headers()['content-type'];
        if (contentType && contentType.includes('json')) {
          const body = await response.json();
          const bodyStr = JSON.stringify(body);
          console.log(`  Body: ${bodyStr.substring(0, 300)}${bodyStr.length > 300 ? '...' : ''}`);
          responses.push({ url, status: response.status(), body });
        }
      } catch(e) {
        console.log(`  Error parsing response: ${e.message}`);
      }
    }
  });

  try {
    // Vai alla pagina di login
    console.log('\n[Action] Navigating to login page...');
    await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Compila form e fai login
    console.log('[Action] Filling login form...');
    await page.fill('input[name="email"]', 'gvallo@nexadata.it');
    await page.fill('input[name="password"]', 'My$3cr3tP@ss');

    console.log('[Action] Clicking login button...');
    await page.click('button[type="submit"]', { timeout: 5000 }).catch(() => {
      console.log('[Info] Button disappeared (probably successful redirect)');
    });

    // Aspetta navigazione o timeout
    console.log('[Action] Waiting for post-login navigation...');
    await page.waitForTimeout(7000);

    const finalUrl = page.url();
    const pageTitle = await page.title();

    console.log(`\n[Result] Final URL: ${finalUrl}`);
    console.log(`[Result] Page Title: ${pageTitle}`);
    console.log(`[Result] Console Errors: ${errors.length}`);
    console.log(`[Result] Network Calls (auth-related): ${networkCalls.length}`);

    // Screenshot finale
    const screenshotPath = `/tmp/${label.toLowerCase().replace(' ', '-')}-final.png`;
    await page.screenshot({ path: screenshotPath });
    console.log(`[Screenshot] Saved to ${screenshotPath}`);

    await page.waitForTimeout(2000);
    await browser.close();

    return { finalUrl, errors, networkCalls, responses, pageTitle };
  } catch (error) {
    console.error(`[Fatal Error] ${error.message}`);
    await browser.close();
    throw error;
  }
}

(async () => {
  try {
    console.log('\n' + '='.repeat(60));
    console.log('COMPARATIVE LOGIN TEST: Production vs Local');
    console.log('='.repeat(60));

    const prod = await testLogin('https://portaljs.nexadata.it', 'PRODUCTION');
    const local = await testLogin('http://localhost:3000', 'LOCAL');

    console.log('\n\n' + '='.repeat(60));
    console.log('COMPARISON RESULTS');
    console.log('='.repeat(60));

    console.log('\n--- Final URLs ---');
    console.log(`Production: ${prod.finalUrl}`);
    console.log(`Local:      ${local.finalUrl}`);

    console.log('\n--- Errors ---');
    console.log(`Production: ${prod.errors.length} errors`);
    if (prod.errors.length > 0) {
      prod.errors.forEach((e, i) => console.log(`  ${i+1}. ${e}`));
    }
    console.log(`Local:      ${local.errors.length} errors`);
    if (local.errors.length > 0) {
      local.errors.forEach((e, i) => console.log(`  ${i+1}. ${e}`));
    }

    console.log('\n--- getMyPermissions Calls ---');
    const prodGetPerm = prod.networkCalls.filter(c => c.url.includes('getMyPermissions'));
    const localGetPerm = local.networkCalls.filter(c => c.url.includes('getMyPermissions'));

    console.log(`Production: ${prodGetPerm.length} call(s)`);
    if (prodGetPerm.length > 0) {
      console.log(`  Auth header: ${prodGetPerm[0].headers['authorization'] || 'MISSING'}`);
      console.log(`  x-tenant header: ${prodGetPerm[0].headers['x-tenant'] || 'MISSING'}`);
    }

    console.log(`Local:      ${localGetPerm.length} call(s)`);
    if (localGetPerm.length > 0) {
      console.log(`  Auth header: ${localGetPerm[0].headers['authorization'] || 'MISSING'}`);
      console.log(`  x-tenant header: ${localGetPerm[0].headers['x-tenant'] || 'MISSING'}`);
    }

    console.log('\n--- getMyPermissions Responses ---');
    const prodResp = prod.responses.filter(r => r.url.includes('getMyPermissions'));
    const localResp = local.responses.filter(r => r.url.includes('getMyPermissions'));

    console.log(`Production: ${prodResp.length > 0 ? `Status ${prodResp[0].status}` : 'No response'}`);
    console.log(`Local:      ${localResp.length > 0 ? `Status ${localResp[0].status}` : 'No response'}`);

    console.log('\n' + '='.repeat(60));
    console.log('TEST COMPLETE');
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('\n[Fatal Error in main]', error);
    process.exit(1);
  }
})();
