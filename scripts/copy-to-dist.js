#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const distRoot = path.join(rootDir, 'dist');

// Mapping of module directories to their dist subdirectories
// Based on RELEASE_PATH from .env.production files
const moduleMapping = {
  'portaal-fe-core': '',                    // Core goes to root (RELEASE_PATH=/)
  'portaal-fe-common': 'common',            // RELEASE_PATH=common/
  'portaal-fe-auth': 'auth',                // RELEASE_PATH=auth/
  'portaal-fe-chatbot': 'chatbot',          // RELEASE_PATH=chatbot/
  'portaal-fe-hr': 'hr',                    // RELEASE_PATH=hr/
  'portaal-fe-lookUps': 'lookups',          // RELEASE_PATH=lookups/
  'portaal-fe-notifications': 'notification', // RELEASE_PATH=notification/
  'portaal-fe-personalarea': 'personalarea', // No .env found, assuming
  'portaal-fe-recruiting': 'recruiting',    // RELEASE_PATH=recruiting/
  'portaal-fe-reports': 'reports',          // RELEASE_PATH=reports/
  'portaal-fe-sales': 'sales',              // RELEASE_PATH=sales/
  'portaal-fe-stock': 'stock'               // RELEASE_PATH=stock/
};

console.log('📁 Copying build artifacts to dist/\n');

// Clean dist directory
if (fs.existsSync(distRoot)) {
  console.log('🗑️  Cleaning existing dist/ directory...');
  fs.emptyDirSync(distRoot);
} else {
  fs.mkdirSync(distRoot, { recursive: true });
}

let copiedCount = 0;
let skippedCount = 0;

Object.entries(moduleMapping).forEach(([moduleName, targetSubPath]) => {
  const sourcePath = path.join(rootDir, moduleName, 'dist');
  const targetPath = targetSubPath ? path.join(distRoot, targetSubPath) : distRoot;

  if (fs.existsSync(sourcePath)) {
    const stats = fs.statSync(sourcePath);
    if (stats.isDirectory()) {
      console.log(`📋 Copying ${moduleName} → ${targetSubPath || 'root'}/`);

      try {
        fs.copySync(sourcePath, targetPath, {
          overwrite: true,
          errorOnExist: false
        });
        copiedCount++;
        console.log(`   ✅ Copied successfully`);
      } catch (error) {
        console.error(`   ❌ Error copying: ${error.message}`);
      }
    }
  } else {
    console.log(`⚠️  Skipping ${moduleName} (dist/ not found)`);
    skippedCount++;
  }
});

console.log('\n' + '='.repeat(60));
console.log('📊 COPY SUMMARY');
console.log('='.repeat(60));
console.log(`✅ Copied: ${copiedCount} modules`);
if (skippedCount > 0) {
  console.log(`⚠️  Skipped: ${skippedCount} modules (not built)`);
}
console.log(`📁 Output directory: ${distRoot}`);
console.log('='.repeat(60) + '\n');

// Verify dist structure
console.log('📂 Final dist/ structure:');
const distContents = fs.readdirSync(distRoot);
distContents.forEach(item => {
  const itemPath = path.join(distRoot, item);
  const isDir = fs.statSync(itemPath).isDirectory();
  console.log(`   ${isDir ? '📁' : '📄'} ${item}`);
});

console.log('\n✅ All files copied to dist/');
console.log('💡 Run `yarn preview` to test the production build locally\n');
