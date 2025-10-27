const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const htmlInsteadOfJs = [];
  const failedChunks = [];

  // Monitor all responses
  page.on('response', async (response) => {
    const url = response.url();
    const status = response.status();
    const contentType = response.headers()['content-type'] || '';

    // Check for JS files
    if (url.endsWith('.js')) {
      try {
        const text = await response.text();

        // If it's supposed to be JS but contains HTML
        if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
          htmlInsteadOfJs.push({
            url,
            status,
            contentType,
            sizeKb: (text.length / 1024).toFixed(2)
          });
          console.log(`❌ HTML served instead of JS: ${url} (${status})`);
        } else if (status >= 400) {
          console.log(`⚠️  Failed JS: ${url} (${status})`);
        } else {
          // Check if it's a webpack chunk
          const filename = url.split('/').pop();
          if (/^\d+\.js$/.test(filename)) {
            console.log(`✅ Chunk loaded: ${url} (${(text.length / 1024).toFixed(1)}KB)`);
          }
        }
      } catch (err) {
        console.log(`⚠️  Could not read response: ${url}`);
      }
    }
  });

  // Capture page errors with details
  page.on('pageerror', error => {
    const msg = error.message;
    if (msg.includes('Loading chunk') && msg.includes('failed')) {
      const match = msg.match(/chunk (\d+) failed.*http:\/\/localhost:3000\/(.*?)(?:\)|$)/);
      if (match) {
        failedChunks.push({
          chunkId: match[1],
          path: match[2] || match[1] + '.js'
        });
      }
    }
    console.log(`💥 ${msg}`);
  });

  console.log('🚀 Navigating to http://localhost:3000...\n');

  try {
    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    await page.waitForTimeout(5000);

  } catch (error) {
    console.log(`⚠️  Navigation error: ${error.message}`);
  }

  console.log('\n📊 SUMMARY\n');
  console.log(`HTML served instead of JS: ${htmlInsteadOfJs.length}`);
  console.log(`Failed chunks: ${failedChunks.length}\n`);

  if (htmlInsteadOfJs.length > 0) {
    console.log('📋 Files that received HTML instead of JavaScript:');
    htmlInsteadOfJs.forEach(item => {
      console.log(`  ${item.url}`);
      console.log(`    Status: ${item.status}, Size: ${item.sizeKb}KB\n`);
    });
  }

  if (failedChunks.length > 0) {
    console.log('📋 Webpack chunks that failed to load:');
    failedChunks.forEach(chunk => {
      console.log(`  Chunk ${chunk.chunkId}: ${chunk.path}`);

      // Check if file exists in dist
      const possiblePaths = [
        `dist/${chunk.path}`,
        `dist/common/${chunk.chunkId}.js`,
        `dist/hr/${chunk.chunkId}.js`,
        `dist/sales/${chunk.chunkId}.js`
      ];
      console.log(`    Possible locations: ${possiblePaths.join(', ')}`);
    });
  }

  await browser.close();
})();
