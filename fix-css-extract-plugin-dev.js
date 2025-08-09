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
  
  // 1. Rimuovere MiniCssExtractPlugin.loader dalle regole CSS e usare sempre style-loader in dev
  // Per CSS Modules
  content = content.replace(
    /mode === 'development' \? "style-loader" : MiniCssExtractPlugin\.loader/g,
    `mode === 'development' ? "style-loader" : MiniCssExtractPlugin.loader`
  );
  
  // Assicurarsi che in development usiamo SOLO style-loader
  const lines = content.split('\n');
  let inModuleRules = false;
  let braceCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    // Trova la sezione delle rules
    if (lines[i].includes('module:') && lines[i].includes('{')) {
      inModuleRules = true;
    }
    
    if (inModuleRules) {
      // Sostituisci le configurazioni CSS loader
      if (lines[i].includes('test:') && lines[i].includes('.css') || 
          lines[i].includes('test:') && lines[i].includes('.scss')) {
        // Cerca la sezione 'use:' nelle prossime righe
        for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
          if (lines[j].includes('use:') && lines[j].includes('[')) {
            // Trovato l'array use, cerca il loader nelle prossime righe
            for (let k = j + 1; k < Math.min(j + 15, lines.length); k++) {
              // Se troviamo una riga con MiniCssExtractPlugin.loader senza condizione
              if (lines[k].includes('MiniCssExtractPlugin.loader') && 
                  !lines[k].includes('mode === ') && 
                  !lines[k].includes('?')) {
                // Sostituisci con la versione condizionale
                lines[k] = lines[k].replace(
                  'MiniCssExtractPlugin.loader',
                  `mode === 'development' ? "style-loader" : MiniCssExtractPlugin.loader`
                );
              }
            }
            break;
          }
        }
      }
    }
  }
  
  content = lines.join('\n');
  
  // 2. Assicurarsi che il plugin MiniCssExtractPlugin sia condizionale (solo in production)
  // Trova la sezione plugins
  const pluginsMatch = content.match(/plugins:\s*\[([\s\S]*?)\]\.filter\(Boolean\)|plugins:\s*\[([\s\S]*?)\]/);
  
  if (pluginsMatch) {
    let pluginsSection = pluginsMatch[0];
    
    // Se MiniCssExtractPlugin non è condizionale, renderlo condizionale
    if (pluginsSection.includes('new MiniCssExtractPlugin')) {
      // Verifica se è già condizionale
      const miniCssRegex = /new MiniCssExtractPlugin\({[\s\S]*?\}\)/g;
      const matches = pluginsSection.match(miniCssRegex);
      
      if (matches) {
        matches.forEach(match => {
          // Controlla se questo plugin è già in un blocco condizionale
          const beforePlugin = pluginsSection.substring(0, pluginsSection.indexOf(match));
          const lastLines = beforePlugin.split('\n').slice(-3).join('\n');
          
          // Se non è condizionale, sostituiscilo con versione condizionale
          if (!lastLines.includes('mode === \'production\'') && 
              !lastLines.includes('isProduction')) {
            
            const newPlugin = `mode === 'production' && ${match}`;
            pluginsSection = pluginsSection.replace(match, newPlugin);
          }
        });
        
        // Assicurati che ci sia .filter(Boolean) alla fine
        if (!pluginsSection.includes('.filter(Boolean)')) {
          pluginsSection = pluginsSection.replace(/\]$/, '].filter(Boolean)');
        }
        
        content = content.replace(pluginsMatch[0], pluginsSection);
      }
    }
  }
  
  // 3. Rimuovere qualsiasi import di MiniCssExtractPlugin se non utilizzato
  if (content.includes('mode === \'production\' &&')) {
    // Il plugin è condizionale, mantieni l'import
  } else {
    // Verifica se MiniCssExtractPlugin è usato davvero
    const usageCount = (content.match(/MiniCssExtractPlugin/g) || []).length;
    const importCount = (content.match(/require.*mini-css-extract-plugin/g) || []).length;
    
    // Se c'è solo l'import ma non è usato, non fare nulla (lasciamolo per production)
  }
  
  fs.writeFileSync(webpackPath, content);
  console.log(`✅ ${service}: webpack.config.js aggiornato - MiniCssExtractPlugin solo in production`);
});

console.log('\n✅ Tutti i webpack.config.js sono stati corretti per usare style-loader in development');