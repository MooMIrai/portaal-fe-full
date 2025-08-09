#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const services = [
  'auth',
  'chatbot', 
  'hr',
  'notifications',
  'recruiting',
  'stock'
];

services.forEach(service => {
  const webpackPath = path.join(__dirname, `portaal-fe-${service}`, 'webpack.config.js');
  
  if (!fs.existsSync(webpackPath)) {
    console.log(`❌ ${service}: webpack.config.js not found`);
    return;
  }
  
  let content = fs.readFileSync(webpackPath, 'utf8');
  
  // Fix the shared configuration syntax error
  content = content.replace(
    /singleton: true,\s*,\s*clsx:/g,
    'singleton: true,\n    },\n    clsx:'
  );
  
  // Fix the closing bracket issue
  content = content.replace(
    /\|\| false,\s*\}\}/g,
    '|| false,\n    }'
  );
  
  // Fix the plugins array syntax error
  content = content.replace(
    /new Dotenv\({ path: "\.\/\.env\." \+ mode }\),\s*,\s*mode === 'production'/g,
    'new Dotenv({ path: "./.env." + mode }),\n      mode === \'production\''
  );
  
  fs.writeFileSync(webpackPath, content);
  console.log(`✅ ${service}: Syntax errors fixed`);
});

console.log('\n✅ All syntax errors fixed');