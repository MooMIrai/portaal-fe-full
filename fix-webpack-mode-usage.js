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
  
  // Replace all occurrences of argv.mode with mode within the module.exports function
  // but only after the const mode = line
  
  // Split the content to handle the replacement properly
  const lines = content.split('\n');
  let inModuleExports = false;
  let modeDeclareLine = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('module.exports = (_, argv) => {')) {
      inModuleExports = true;
    }
    
    if (inModuleExports && lines[i].includes('const mode = argv.mode ||')) {
      modeDeclareLine = i;
    }
    
    // Replace argv.mode with mode after the mode declaration line
    if (inModuleExports && modeDeclareLine > -1 && i > modeDeclareLine) {
      // Replace argv.mode with mode in conditions and string concatenations
      lines[i] = lines[i].replace(/argv\.mode/g, 'mode');
    }
  }
  
  content = lines.join('\n');
  
  fs.writeFileSync(webpackPath, content);
  console.log(`✅ ${service}: webpack.config.js aggiornato - argv.mode sostituito con mode`);
});

console.log('\n✅ Tutti i webpack.config.js sono stati aggiornati per usare la variabile mode');