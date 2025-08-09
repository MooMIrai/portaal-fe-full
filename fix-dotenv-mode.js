const fs = require('fs');
const path = require('path');

// Lista dei servizi da aggiornare
const services = [
  'portaal-fe-auth',
  'portaal-fe-chatbot',
  'portaal-fe-common',
  'portaal-fe-core',
  'portaal-fe-dashboard',
  'portaal-fe-hr',
  'portaal-fe-lookUps',
  'portaal-fe-notifications',
  'portaal-fe-personalarea',
  'portaal-fe-recruiting',
  'portaal-fe-reports',
  'portaal-fe-sales',
  'portaal-fe-stock'
];

services.forEach(service => {
  const webpackPath = path.join(service, 'webpack.config.js');
  
  if (!fs.existsSync(webpackPath)) {
    console.log(`⚠️  ${service}: webpack.config.js non trovato`);
    return;
  }
  
  let content = fs.readFileSync(webpackPath, 'utf8');
  
  // Fix the dotenv config line to have a fallback
  content = content.replace(
    /require\("dotenv"\)\.config\(\{ path: "\.\/\.env\." \+ argv\.mode \}\);/g,
    'const mode = argv.mode || "development";\n  require("dotenv").config({ path: "./.env." + mode });'
  );
  
  // Also fix the Dotenv plugin if it uses argv.mode directly
  content = content.replace(
    /new Dotenv\(\{ path: "\.\/\.env\." \+ argv\.mode \}\)/g,
    'new Dotenv({ path: "./.env." + mode })'
  );
  
  fs.writeFileSync(webpackPath, content);
  console.log(`✅ ${service}: webpack.config.js aggiornato con fallback mode`);
});

console.log('\n✅ Tutti i webpack.config.js sono stati aggiornati con fallback per mode');