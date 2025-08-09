#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// All services
const services = [
  'core',
  'common',
  'auth',
  'chatbot',
  'hr',
  'lookUps',
  'notifications',
  'personalarea',
  'recruiting',
  'reports',
  'sales',
  'stock',
  'dashboard'
];

services.forEach(service => {
  const webpackPath = path.join(__dirname, `portaal-fe-${service}`, 'webpack.config.js');
  
  if (!fs.existsSync(webpackPath)) {
    console.log(`❌ ${service}: webpack.config.js not found`);
    return;
  }
  
  let content = fs.readFileSync(webpackPath, 'utf8');
  
  // Check if already has client overlay disabled
  if (content.includes('overlay: false') || content.includes('overlay: {')) {
    console.log(`✅ ${service}: Already has overlay configuration`);
    return;
  }
  
  // Find devServer configuration and add client overlay settings
  const devServerRegex = /devServer:\s*{([^}]*)}/;
  const match = content.match(devServerRegex);
  
  if (match) {
    const devServerContent = match[1];
    const newDevServerContent = devServerContent + ',\n    client: {\n      overlay: false\n    }';
    const newDevServer = `devServer: {${newDevServerContent}}`;
    content = content.replace(match[0], newDevServer);
    
    fs.writeFileSync(webpackPath, content);
    console.log(`✅ ${service}: Error overlay disabled`);
  } else {
    console.log(`⚠️ ${service}: Could not find devServer configuration`);
  }
});

console.log('\n✅ Error overlay disabled for all services');