#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../portaal-fe-core/.env.production') });

// Get enabled modules from environment variable
const enabledMfesEnv = process.env.ENABLED_MFES;
let enabledModules = [];

if (enabledMfesEnv && enabledMfesEnv.trim() !== '') {
  enabledModules = enabledMfesEnv.split(',').map(m => m.trim());
  console.log('📋 ENABLED_MFES:', enabledModules.join(', '));
} else {
  console.log('📋 ENABLED_MFES is empty - building ALL modules');
}

// Always build common and core
const requiredModules = ['portaal-fe-common', 'portaal-fe-core'];

// Map of all available modules
const moduleMap = {
  'auth': 'portaal-fe-auth',
  'chatbot': 'portaal-fe-chatbot',
  'dashboard': 'portaal-fe-dashboard',
  'hr': 'portaal-fe-hr',
  'lookups': 'portaal-fe-lookUps',
  'notification': 'portaal-fe-notifications',
  'personalarea': 'portaal-fe-personalarea',
  'recruiting': 'portaal-fe-recruiting',
  'reports': 'portaal-fe-reports',
  'sales': 'portaal-fe-sales',
  'stock': 'portaal-fe-stock'
};

// Build list of modules to build
let modulesToBuild = [...requiredModules];

if (enabledModules.length === 0) {
  // Build all modules
  modulesToBuild = [...requiredModules, ...Object.values(moduleMap)];
} else {
  // Build only enabled modules
  enabledModules.forEach(key => {
    const moduleName = moduleMap[key];
    if (moduleName && !modulesToBuild.includes(moduleName)) {
      modulesToBuild.push(moduleName);
    }
  });
}

// Filter out modules that don't exist
modulesToBuild = modulesToBuild.filter(module => {
  const modulePath = path.join(__dirname, '..', module);
  return fs.existsSync(modulePath);
});

console.log('\n🚀 Building modules...\n');
console.log('📦 Modules to build:', modulesToBuild.join(', '));
console.log('');

let buildSuccess = true;
const buildResults = [];

modulesToBuild.forEach((module, index) => {
  const moduleNum = `[${index + 1}/${modulesToBuild.length}]`;
  console.log(`${moduleNum} 📦 Building ${module}...`);

  try {
    const startTime = Date.now();

    execSync('yarn build', {
      cwd: path.join(__dirname, '..', module),
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`${moduleNum} ✅ ${module} built successfully (${duration}s)\n`);
    buildResults.push({ module, success: true, duration });

  } catch (error) {
    console.error(`${moduleNum} ❌ ${module} build failed\n`);
    buildResults.push({ module, success: false });
    buildSuccess = false;
  }
});

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 BUILD SUMMARY');
console.log('='.repeat(60));

const successful = buildResults.filter(r => r.success);
const failed = buildResults.filter(r => !r.success);

console.log(`✅ Successful: ${successful.length}/${modulesToBuild.length}`);
if (failed.length > 0) {
  console.log(`❌ Failed: ${failed.length}`);
  failed.forEach(r => console.log(`   - ${r.module}`));
}

const totalTime = buildResults.reduce((sum, r) => sum + (r.duration || 0), 0);
console.log(`⏱️  Total build time: ${totalTime.toFixed(2)}s`);
console.log('='.repeat(60) + '\n');

if (!buildSuccess) {
  console.error('❌ Build failed for one or more modules');
  process.exit(1);
}

console.log('🎉 All modules built successfully!\n');
