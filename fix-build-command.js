const fs = require('fs');
const path = require('path');

const services = [
  'dashboard', 
  'lookUps',  // Note: directory is lookUps, not lookups
  'sales', 
  'hr', 
  'recruiting',
  'stock', 
  'notifications', 
  'reports', 
  'chatbot', 
  'personalarea'
];

console.log('🔧 Fixing build commands for all services...\n');

services.forEach(service => {
  const dir = `portaal-fe-${service}`;
  const packagePath = path.join(dir, 'package.json');
  
  if (!fs.existsSync(packagePath)) {
    console.log(`⚠️  ${dir}/package.json not found, skipping...`);
    return;
  }
  
  try {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Backup original build command if not already backed up
    if (pkg.scripts && pkg.scripts.build && !pkg.scripts['build:original']) {
      pkg.scripts['build:original'] = pkg.scripts.build;
    }
    
    // Create new build command that directly calls webpack
    if (pkg.scripts) {
      // Remove any trailing characters or spaces
      pkg.scripts.build = 'webpack --mode production';
      
      // Also add a safe build alternative
      pkg.scripts['build:safe'] = './node_modules/.bin/webpack --mode production';
    }
    
    // Write back the package.json with proper formatting
    fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`✅ Fixed ${dir}/package.json`);
    
  } catch (error) {
    console.error(`❌ Error processing ${dir}: ${error.message}`);
  }
});

console.log('\n✨ Build commands fixed! Now try: yarn build');