#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const modules = [
  'portaal-fe-auth',
  'portaal-fe-chatbot',
  'portaal-fe-common',
  'portaal-fe-core',
  'portaal-fe-hr',
  'portaal-fe-lookUps',
  'portaal-fe-notifications',
  'portaal-fe-personalarea',
  'portaal-fe-recruiting',
  'portaal-fe-reports',
  'portaal-fe-sales',
  'portaal-fe-stock'
];

console.log('🧹 Cleaning build artifacts...\n');

let cleanedCount = 0;

// Clean module dist directories
modules.forEach(module => {
  const modulePath = path.join(rootDir, module);
  const distPath = path.join(modulePath, 'dist');

  if (fs.existsSync(distPath)) {
    console.log(`🗑️  Removing ${module}/dist/`);
    fs.removeSync(distPath);
    cleanedCount++;
  }
});

// Clean root dist directory
const rootDistPath = path.join(rootDir, 'dist');
if (fs.existsSync(rootDistPath)) {
  console.log('🗑️  Removing root dist/');
  fs.removeSync(rootDistPath);
  cleanedCount++;
}

console.log(`\n✅ Cleaned ${cleanedCount} directories\n`);
