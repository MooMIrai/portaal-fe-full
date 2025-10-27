const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    devtools: true
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Intercetta tutte le richieste di rete
  const networkRequests = [];
  page.on('request', request => {
    if (request.url().includes('.js')) {
      networkRequests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType()
      });
      console.log(`[REQUEST] ${request.method()} ${request.url()}`);
    }
  });

  page.on('response', async response => {
    if (response.url().includes('.js')) {
      console.log(`[RESPONSE] ${response.status()} ${response.url()}`);

      // Se è un remoteEntry.js, analizziamolo
      if (response.url().includes('remoteEntry.js')) {
        try {
          const text = await response.text();
          const publicPathMatch = text.match(/i\.p\s*=\s*"([^"]*)"/);
          if (publicPathMatch) {
            console.log(`[PUBLIC_PATH] ${response.url()} -> publicPath = "${publicPathMatch[1]}"`);
          }
        } catch (e) {
          console.error(`Failed to read response body for ${response.url()}`);
        }
      }
    }
  });

  page.on('requestfailed', request => {
    if (request.url().includes('.js')) {
      console.error(`[FAILED] ${request.url()} - ${request.failure().errorText}`);
    }
  });

  // Monitora i log della console
  page.on('console', msg => {
    if (msg.text().includes('Webpack Module') || msg.text().includes('Module Logger')) {
      console.log(`[CONSOLE] ${msg.text()}`);
    }
  });

  // Esegui codice nel browser per monitorare webpack
  await page.evaluateOnNewDocument(() => {
    // Hook webpack_require per vedere come vengono risolti i moduli
    window.__debugInfo = {
      webpackPublicPaths: {},
      moduleLoads: []
    };

    // Monitora quando viene impostato __webpack_public_path__
    let _publicPath = '/';
    Object.defineProperty(window, '__webpack_public_path__', {
      get() {
        return _publicPath;
      },
      set(value) {
        console.log(`[WEBPACK_PUBLIC_PATH] Setting to: ${value}`);
        window.__debugInfo.webpackPublicPaths[new Date().toISOString()] = value;
        _publicPath = value;
      },
      configurable: true
    });

    // Hook per monitorare il caricamento dinamico dei moduli
    const originalImport = window.import || Function.prototype.constructor('return import')();
    window.import = function(path) {
      console.log(`[DYNAMIC_IMPORT] Loading: ${path}`);
      window.__debugInfo.moduleLoads.push({
        type: 'import',
        path: path,
        timestamp: new Date().toISOString()
      });
      return originalImport.apply(this, arguments);
    };
  });

  try {
    console.log('\n=== Navigating to http://localhost:8080 ===\n');
    await page.goto('http://localhost:8080', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Aspetta un po' per vedere se ci sono caricamenti lazy
    await page.waitForTimeout(5000);

    // Ora proviamo a navigare verso HR per vedere cosa succede
    console.log('\n=== Attempting to navigate to HR module ===\n');

    // Prova a cliccare sul menu HR se esiste
    try {
      await page.click('text=HR', { timeout: 3000 });
      await page.waitForTimeout(3000);
    } catch (e) {
      console.log('Could not find HR menu item');
    }

    // Ottieni informazioni di debug dal browser
    const debugInfo = await page.evaluate(() => window.__debugInfo);
    console.log('\n=== Debug Info from Browser ===');
    console.log('Webpack Public Paths:', debugInfo.webpackPublicPaths);
    console.log('Module Loads:', debugInfo.moduleLoads);

    // Analizza i moduli caricati
    console.log('\n=== Analysis of Failed Requests ===');
    const failedRequests = networkRequests.filter(r =>
      r.url.includes('28.js') || r.url.includes('337.js')
    );

    if (failedRequests.length > 0) {
      console.log('Failed chunk requests:');
      failedRequests.forEach(req => {
        console.log(`  - ${req.url}`);
        // Determina quale dovrebbe essere il path corretto
        if (req.url.includes('/28.js') && !req.url.includes('/hr/28.js')) {
          console.log(`    ERROR: Should be http://localhost:8080/hr/28.js`);
        }
        if (req.url.includes('/337.js') && !req.url.includes('/hr/337.js')) {
          console.log(`    ERROR: Should be http://localhost:8080/hr/337.js`);
        }
      });
    }

    // Verifica i moduli webpack in memoria
    const webpackModules = await page.evaluate(() => {
      if (typeof __webpack_require__ !== 'undefined') {
        try {
          const modules = {};
          // Cerca di ottenere info sui moduli
          if (__webpack_require__.m) {
            Object.keys(__webpack_require__.m).forEach(key => {
              modules[key] = {
                loaded: __webpack_require__.m[key] ? 'present' : 'missing'
              };
            });
          }
          return {
            publicPath: __webpack_require__.p || 'undefined',
            modules: modules
          };
        } catch (e) {
          return { error: e.message };
        }
      }
      return { error: '__webpack_require__ not found' };
    });

    console.log('\n=== Webpack Runtime Info ===');
    console.log(webpackModules);

    // Controlla specificamente i container dei moduli federati
    const federationInfo = await page.evaluate(() => {
      const info = {
        containers: {},
        remotes: {}
      };

      // Controlla i container globali
      ['auth', 'hr', 'sales', 'common'].forEach(name => {
        if (window[name]) {
          info.containers[name] = {
            exists: true,
            hasGet: typeof window[name].get === 'function',
            hasInit: typeof window[name].init === 'function'
          };

          // Prova a vedere il publicPath del container
          if (window[name].__webpack_require__ && window[name].__webpack_require__.p) {
            info.containers[name].publicPath = window[name].__webpack_require__.p;
          }
        } else {
          info.containers[name] = { exists: false };
        }
      });

      return info;
    });

    console.log('\n=== Module Federation Containers ===');
    console.log(JSON.stringify(federationInfo, null, 2));

  } catch (error) {
    console.error('Error during test:', error);
  }

  // Mantieni il browser aperto per ispezionare manualmente
  console.log('\n=== Browser will stay open for manual inspection ===');
  console.log('Press Ctrl+C to close...');

  await page.waitForTimeout(600000); // 10 minuti
  await browser.close();
})();