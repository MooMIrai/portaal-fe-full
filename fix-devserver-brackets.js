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
  
  // Fix the devServer closing brackets
  content = content.replace(
    /devServer:\s*{([^}]*?)client:\s*{([^}]*?)}\s*}}/g,
    'devServer: {$1client: {$2    }\n  }'
  );
  
  // Ensure comma after historyApiFallback
  content = content.replace(
    /historyApiFallback:\s*true\s*client:/g,
    'historyApiFallback: true,\n    client:'
  );
  
  fs.writeFileSync(webpackPath, content);
  console.log(`✅ ${service}: Fixed devServer brackets`);
});

console.log('\n✅ DevServer brackets fixed for all services');