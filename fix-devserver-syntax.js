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
  
  // Fix the syntax error - remove comma before client
  content = content.replace(/,\s*,\s*client:/g, ',\n    client:');
  
  // Fix closing brackets
  content = content.replace(/}\s*}\s*},/g, '}\n    }\n  },');
  
  // Fix for core which has headers
  if (service === 'core') {
    content = content.replace(
      /"Authorization"\s*,\s*client:/g,
      '"Authorization"\n      },\n      client:'
    );
  }
  
  fs.writeFileSync(webpackPath, content);
  console.log(`✅ ${service}: Fixed devServer syntax`);
});

console.log('\n✅ DevServer syntax fixed for all services');