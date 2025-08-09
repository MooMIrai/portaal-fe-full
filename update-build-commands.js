#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const services = [
  'dashboard',
  'lookUps',  
  'sales',
  'hr',
  'recruiting',
  'stock',
  'notifications',
  'reports',
  'chatbot',
  'personalarea'
];

console.log('🔧 Updating build commands for all services...\n');

services.forEach(service => {
  const dir = `portaal-fe-${service}`;
  const packagePath = path.join(dir, 'package.json');
  
  if (!fs.existsSync(packagePath)) {
    console.log(`⚠️  ${dir}/package.json not found, skipping...`);
    return;
  }
  
  try {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Keep the original build command as backup if not already done
    if (pkg.scripts && pkg.scripts.build && !pkg.scripts['build:broken']) {
      pkg.scripts['build:broken'] = pkg.scripts.build;
    }
    
    // Update build command to use the wrapper
    if (pkg.scripts) {
      const serviceName = service === 'lookUps' ? 'lookups' : service;
      pkg.scripts.build = `node ../build-wrapper.js ${serviceName}`;
      
      // Also add a direct webpack command as alternative
      pkg.scripts['build:direct'] = './node_modules/.bin/webpack --mode production';
    }
    
    // Write back the package.json with proper formatting
    fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`✅ Updated ${dir}/package.json`);
    
  } catch (error) {
    console.error(`❌ Error processing ${dir}: ${error.message}`);
  }
});

console.log('\n✨ Build commands updated! Now use: yarn build');