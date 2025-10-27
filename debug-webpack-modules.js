// Script per analizzare i moduli webpack e capire perché HR non funziona
const http = require('http');
const fs = require('fs');
const path = require('path');

async function fetchResource(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function analyzeRemoteEntry(moduleName, baseUrl) {
  console.log(`\n=== Analyzing ${moduleName.toUpperCase()} ===`);

  const remoteUrl = `${baseUrl}/${moduleName}/remoteEntry.js`;
  console.log(`Fetching: ${remoteUrl}`);

  const response = await fetchResource(remoteUrl);

  if (response.status !== 200) {
    console.log(`Failed to fetch ${moduleName}: ${response.status}`);
    return;
  }

  // Analizza il contenuto
  const content = response.data;

  // Cerca il publicPath
  const publicPathMatch = content.match(/i\.p\s*=\s*"([^"]*)"/);
  if (publicPathMatch) {
    console.log(`  publicPath (i.p): "${publicPathMatch[1]}"`);
  }

  // Cerca i chunk definiti (i.u pattern)
  const chunkPattern = /i\.u\s*=\s*[^=]*=>\s*[^+]*\+\s*"\.js"/;
  const hasChunkFunction = chunkPattern.test(content);
  console.log(`  Has chunk loading function (i.u): ${hasChunkFunction}`);

  // Cerca riferimenti a chunk specifici
  const chunkRefs = content.match(/\b\d{1,4}\.js/g);
  if (chunkRefs) {
    console.log(`  Referenced chunks: ${[...new Set(chunkRefs)].join(', ')}`);
  }

  // Cerca la definizione del container
  const containerPattern = new RegExp(`var ${moduleName};`);
  const hasContainer = containerPattern.test(content);
  console.log(`  Has container definition: ${hasContainer}`);

  // Cerca exposes
  const exposesPattern = /exposes.*?:.*?\{([^}]*)\}/s;
  const exposesMatch = content.match(exposesPattern);
  if (exposesMatch) {
    const exposes = exposesMatch[1].match(/"\.\/[^"]+"/g);
    if (exposes) {
      console.log(`  Exposes: ${exposes.join(', ')}`);
    }
  }

  // Verifica se ci sono chunk nella directory
  const modulePath = path.join('/home/mverde/src/taal/portaal-full/portaal-fe-full/dist', moduleName);
  if (fs.existsSync(modulePath)) {
    const files = fs.readdirSync(modulePath).filter(f => f.endsWith('.js'));
    console.log(`  Files in dist/${moduleName}: ${files.join(', ')}`);

    // Per HR, verifica specificamente 28.js e 337.js
    if (moduleName === 'hr') {
      const has28 = files.includes('28.js');
      const has337 = files.includes('337.js');
      console.log(`  Has 28.js: ${has28}`);
      console.log(`  Has 337.js: ${has337}`);

      // Verifica il contenuto di questi file
      if (has28) {
        const chunk28Path = path.join(modulePath, '28.js');
        const chunk28Content = fs.readFileSync(chunk28Path, 'utf8').substring(0, 200);
        console.log(`  28.js starts with: ${chunk28Content.substring(0, 100)}...`);
      }
    }
  }

  return content;
}

async function compareModules() {
  const baseUrl = 'http://localhost:8080';

  // Analizza i moduli principali
  const authContent = await analyzeRemoteEntry('auth', baseUrl);
  const hrContent = await analyzeRemoteEntry('hr', baseUrl);
  const salesContent = await analyzeRemoteEntry('sales', baseUrl);

  console.log('\n=== COMPARISON ===');

  // Confronta le strutture
  if (authContent && hrContent) {
    // Cerca pattern specifici che potrebbero differire
    const authHasPublicPathSetter = authContent.includes('__webpack_public_path__');
    const hrHasPublicPathSetter = hrContent.includes('__webpack_public_path__');

    console.log(`Auth has __webpack_public_path__ setter: ${authHasPublicPathSetter}`);
    console.log(`HR has __webpack_public_path__ setter: ${hrHasPublicPathSetter}`);

    // Cerca il pattern di caricamento chunk
    const authChunkLoader = authContent.match(/i\.l\([^,]+,[^)]+\)/);
    const hrChunkLoader = hrContent.match(/i\.l\([^,]+,[^)]+\)/);

    if (authChunkLoader && hrChunkLoader) {
      console.log('\nChunk loader patterns:');
      console.log(`  Auth: ${authChunkLoader[0].substring(0, 100)}`);
      console.log(`  HR: ${hrChunkLoader[0].substring(0, 100)}`);
    }
  }

  // Analizza come vengono costruite le URL dei chunk
  console.log('\n=== CHUNK URL CONSTRUCTION ===');

  if (hrContent) {
    // Cerca il pattern che costruisce l'URL del chunk
    const urlPattern = /i\.p\s*\+\s*i\.u\(/;
    if (urlPattern.test(hrContent)) {
      console.log('HR uses pattern: i.p + i.u(chunkId)');
      console.log('This means: publicPath + chunkFileName');
      console.log('Since i.p="/" for HR, chunks will be loaded from root!');
    }
  }
}

async function testChunkLoading() {
  console.log('\n=== TESTING CHUNK LOADING ===');

  // Testa il caricamento diretto dei chunk
  const tests = [
    { url: 'http://localhost:8080/28.js', expected: 'fail', desc: 'HR chunk at root' },
    { url: 'http://localhost:8080/hr/28.js', expected: 'success', desc: 'HR chunk in hr/' },
    { url: 'http://localhost:8080/337.js', expected: 'fail', desc: 'HR chunk at root' },
    { url: 'http://localhost:8080/hr/337.js', expected: 'success', desc: 'HR chunk in hr/' }
  ];

  for (const test of tests) {
    try {
      const response = await fetchResource(test.url);
      const result = response.status === 200 ? 'SUCCESS' : `FAIL (${response.status})`;
      const matches = result.includes('SUCCESS') === (test.expected === 'success');
      console.log(`  ${test.desc}: ${result} ${matches ? '✓' : '✗ UNEXPECTED'}`);
    } catch (err) {
      console.log(`  ${test.desc}: ERROR - ${err.message}`);
    }
  }
}

// Esegui l'analisi
(async () => {
  try {
    await compareModules();
    await testChunkLoading();

    console.log('\n=== PROBLEM IDENTIFIED ===');
    console.log('HR module has i.p="/" in its remoteEntry.js');
    console.log('When HR tries to load chunks (28.js, 337.js), it uses:');
    console.log('  URL = i.p + chunkName = "/" + "28.js" = "/28.js"');
    console.log('But the actual files are at "/hr/28.js"');
    console.log('\nThe issue is that HR\'s publicPath is not being set correctly at build time.');

  } catch (error) {
    console.error('Error:', error);
  }
})();