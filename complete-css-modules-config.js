#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const services = [
  { name: 'reporteditor', port: 3021, prefix: '#mfe-reporteditor' },
  { name: 'lookUps', port: 3005, prefix: '#mfe-lookups' },
  { name: 'sales', port: 3008, prefix: '#mfe-sales' },
  { name: 'hr', port: 3009, prefix: '#mfe-hr' },
  { name: 'recruiting', port: 3011, prefix: '#mfe-recruiting' },
  { name: 'stock', port: 3012, prefix: '#mfe-stock' },
  { name: 'notifications', port: 3013, prefix: '#mfe-notifications' },
  { name: 'reports', port: 3015, prefix: '#mfe-reports' },
  { name: 'chatbot', port: 3018, prefix: '#mfe-chatbot' },
  { name: 'personalarea', port: 3025, prefix: '#mfe-personalarea' }
];

// CSS Modules TypeScript declaration
const cssModulesDeclaration = `declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
`;

// App.tsx wrapper template
const appWrapperTemplate = (serviceName) => `import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OriginalApp from './OriginalApp'; // Rinomina il vecchio App.tsx

const App: React.FC = () => {
  return (
    <div id="${serviceName}">
      <OriginalApp />
    </div>
  );
};

export default App;
`;

services.forEach(service => {
  const serviceDir = `portaal-fe-${service.name}`;
  console.log(`\nConfigurando ${serviceDir}...`);
  
  // 1. Crea css-modules.d.ts se non esiste
  const cssModulesPath = path.join(serviceDir, 'src', 'css-modules.d.ts');
  if (!fs.existsSync(cssModulesPath)) {
    fs.writeFileSync(cssModulesPath, cssModulesDeclaration);
    console.log(`  ✓ Creato css-modules.d.ts`);
  } else {
    console.log(`  - css-modules.d.ts già esistente`);
  }
  
  // 2. Crea/aggiorna postcss.config.js
  const postcssConfig = `module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-prefix-selector')({
      prefix: '${service.prefix}',
      exclude: [
        '.k-', 
        '.MuiDataGrid-', 
        '[data-', 
        '.tailwind-', 
        'html', 
        'body', 
        ':root',
        '#root',
        '[class^="Mui"]',
        '[class*=" Mui"]'
      ],
      transform: function (prefix, selector, prefixedSelector) {
        if (selector.includes('.module__')) {
          return selector;
        }
        if (selector.includes(':global')) {
          return selector.replace(':global', '');
        }
        return prefixedSelector;
      }
    })
  ]
};`;
  
  const postcssPath = path.join(serviceDir, 'postcss.config.js');
  fs.writeFileSync(postcssPath, postcssConfig);
  console.log(`  ✓ Aggiornato postcss.config.js con prefix ${service.prefix}`);
  
  // 3. Aggiorna tsconfig.json per includere css-modules.d.ts
  const tsconfigPath = path.join(serviceDir, 'tsconfig.json');
  if (fs.existsSync(tsconfigPath)) {
    try {
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
      
      // Assicurati che include contenga css-modules.d.ts
      if (!tsconfig.include) {
        tsconfig.include = [];
      }
      if (!tsconfig.include.includes('src/css-modules.d.ts')) {
        tsconfig.include.push('src/css-modules.d.ts');
      }
      
      // Aggiungi opzioni per CSS Modules
      if (!tsconfig.compilerOptions) {
        tsconfig.compilerOptions = {};
      }
      tsconfig.compilerOptions.esModuleInterop = true;
      tsconfig.compilerOptions.allowSyntheticDefaultImports = true;
      
      fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
      console.log(`  ✓ Aggiornato tsconfig.json`);
    } catch (error) {
      console.log(`  ⚠ Errore nell'aggiornamento di tsconfig.json: ${error.message}`);
    }
  }
  
  // 4. Crea wrapper App.tsx se necessario
  const appPath = path.join(serviceDir, 'src', 'App.tsx');
  const originalAppPath = path.join(serviceDir, 'src', 'OriginalApp.tsx');
  
  if (fs.existsSync(appPath) && !fs.existsSync(originalAppPath)) {
    // Rinomina il vecchio App.tsx
    const appContent = fs.readFileSync(appPath, 'utf8');
    
    // Controlla se è già un wrapper
    if (!appContent.includes(`id="${service.prefix}"`) && !appContent.includes(`id="mfe-${service.name}"`)) {
      fs.renameSync(appPath, originalAppPath);
      console.log(`  ✓ Rinominato App.tsx in OriginalApp.tsx`);
      
      // Crea il nuovo wrapper
      fs.writeFileSync(appPath, appWrapperTemplate(service.prefix));
      console.log(`  ✓ Creato nuovo App.tsx wrapper`);
    } else {
      console.log(`  - App.tsx è già un wrapper`);
    }
  }
});

console.log('\n✅ Configurazione CSS Modules completata per tutti i servizi!');
console.log('\nProssimi passi:');
console.log('1. Riavvia i servizi con: pm2 restart all');
console.log('2. Verifica che tutti i servizi compilino correttamente');
console.log('3. Testa l\'isolamento CSS tra i microservizi');