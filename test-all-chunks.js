const http = require('http');
const fs = require('fs');
const path = require('path');

async function testChunkUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', () => {
      resolve({ url, status: 'ERROR' });
    });
  });
}

async function testModuleChunks(moduleName) {
  console.log(`\n=== Testing ${moduleName.toUpperCase()} ===`);

  const modulePath = path.join('/home/mverde/src/taal/portaal-full/portaal-fe-full/dist', moduleName);

  if (!fs.existsSync(modulePath)) {
    console.log(`Module directory ${moduleName} does not exist`);
    return;
  }

  // Trova tutti i file .js nel modulo (escludi remoteEntry e main)
  const jsFiles = fs.readdirSync(modulePath)
    .filter(f => f.endsWith('.js') && !f.includes('remoteEntry') && !f.includes('main'));

  console.log(`Found ${jsFiles.length} chunk files: ${jsFiles.join(', ')}`);

  const results = {
    module: moduleName,
    chunks: [],
    workingPaths: [],
    failedPaths: []
  };

  // Per ogni chunk, testa entrambi i percorsi possibili
  for (const chunk of jsFiles) {
    console.log(`\nTesting ${chunk}:`);

    // Test 1: Percorso root (quello che webpack sta usando con i.p="/")
    const rootUrl = `http://localhost:8080/${chunk}`;
    const rootResult = await testChunkUrl(rootUrl);
    const rootStatus = rootResult.status === 200 ? '✓ SUCCESS' : `✗ FAIL (${rootResult.status})`;
    console.log(`  From root /: ${rootStatus}`);

    // Test 2: Percorso nel modulo (dove i file esistono fisicamente)
    const moduleUrl = `http://localhost:8080/${moduleName}/${chunk}`;
    const moduleResult = await testChunkUrl(moduleUrl);
    const moduleStatus = moduleResult.status === 200 ? '✓ SUCCESS' : `✗ FAIL (${moduleResult.status})`;
    console.log(`  From /${moduleName}/: ${moduleStatus}`);

    // Analisi del problema
    if (rootResult.status !== 200 && moduleResult.status === 200) {
      console.log(`  ⚠️  PROBLEM: Chunk exists at /${moduleName}/${chunk} but webpack tries to load from /${chunk}`);
      results.failedPaths.push(chunk);
    } else if (rootResult.status === 200) {
      results.workingPaths.push(chunk);
    }

    results.chunks.push({
      file: chunk,
      rootPath: { url: rootUrl, status: rootResult.status },
      modulePath: { url: moduleUrl, status: moduleResult.status }
    });
  }

  return results;
}

async function main() {
  console.log('Testing all module chunks to identify which ones work and which don\'t...\n');
  console.log('Server: http://localhost:8080');
  console.log('========================================');

  const modules = ['auth', 'hr', 'sales', 'common', 'lookups', 'stock'];
  const allResults = [];

  for (const module of modules) {
    const result = await testModuleChunks(module);
    if (result) {
      allResults.push(result);
    }
  }

  console.log('\n\n========================================');
  console.log('SUMMARY OF PROBLEMS:');
  console.log('========================================\n');

  let hasProblems = false;

  for (const result of allResults) {
    if (result.failedPaths.length > 0) {
      hasProblems = true;
      console.log(`${result.module.toUpperCase()} has problems:`);
      console.log(`  - ${result.failedPaths.length} chunks fail to load from root`);
      console.log(`  - Failed chunks: ${result.failedPaths.join(', ')}`);
      console.log(`  - These files exist at /${result.module}/ but webpack tries /`);
      console.log('');
    }
  }

  if (!hasProblems) {
    console.log('No problems found! All chunks are loading correctly.');
  } else {
    console.log('\nCONCLUSION:');
    console.log('The problem is that ALL modules have i.p="/" in their remoteEntry.js');
    console.log('This causes webpack to load chunks from root (/) instead of their module directory');
    console.log('The publicPath is NOT being set correctly at build time for ANY module!');

    // Verifica se c'è un pattern nei chunk che funzionano
    const workingModules = allResults.filter(r => r.failedPaths.length === 0);
    if (workingModules.length > 0) {
      console.log('\nModules that work correctly:');
      workingModules.forEach(m => console.log(`  - ${m.module}`));
      console.log('\nThis suggests these modules might have their chunks copied to root or have a different configuration.');
    }
  }
}

main().catch(console.error);