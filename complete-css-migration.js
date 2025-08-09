#!/usr/bin/env node

/**
 * Complete CSS Modules Migration Script
 * Automates configuration updates for all remaining microservices
 */

const fs = require('fs');
const path = require('path');

// Service configurations
const services = [
  { dir: 'portaal-fe-reporteditor', port: 3021, prefix: 'reporteditor', id: 'mfe-reporteditor' },
  { dir: 'portaal-fe-lookUps', port: 3005, prefix: 'lookups', id: 'mfe-lookups' },
  { dir: 'portaal-fe-sales', port: 3008, prefix: 'sales', id: 'mfe-sales' },
  { dir: 'portaal-fe-hr', port: 3009, prefix: 'hr', id: 'mfe-hr' },
  { dir: 'portaal-fe-recruiting', port: 3011, prefix: 'recruiting', id: 'mfe-recruiting' },
  { dir: 'portaal-fe-stock', port: 3012, prefix: 'stock', id: 'mfe-stock' },
  { dir: 'portaal-fe-notifications', port: 3013, prefix: 'notifications', id: 'mfe-notifications' },
  { dir: 'portaal-fe-reports', port: 3015, prefix: 'reports', id: 'mfe-reports' },
  { dir: 'portaal-fe-chatbot', port: 3018, prefix: 'chatbot', id: 'mfe-chatbot' },
  { dir: 'portaal-fe-personalarea', port: 3099, prefix: 'personalarea', id: 'mfe-personalarea' }
];

// CSS Modules TypeScript definitions
const cssModulesDefinitions = `// CSS Modules type definitions
declare module '*.module.css' {
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
}`;

// PostCSS config generator
function generatePostCSSConfig(serviceId) {
  return `/**
 * PostCSS Configuration for ${serviceId} Microservice  
 * Service Prefix: #${serviceId}
 */

const autoprefixer = require("autoprefixer");
const tailwindcss = require("tailwindcss");

module.exports = {
  plugins: [
    tailwindcss, 
    autoprefixer,
    require('postcss-prefix-selector')({
      prefix: '#${serviceId}',
      exclude: [
        // Preserve Tailwind classes
        /^\\.(?:bg|text|flex|grid|p|m|w|h|border|rounded|shadow|opacity|transition|transform|scale|rotate|translate|skew|origin|cursor|select|resize|space|divide|overflow|z|order|col|row|gap|auto|min|max|inline|block|table|hidden|visible|static|fixed|absolute|relative|sticky|inset|top|right|bottom|left)-/,
        /^\\.(?:hover|focus|active|disabled|visited|first|last|odd|even|focus-within|focus-visible):/,
        /^\\.(?:sm|md|lg|xl|2xl):/,
        /^\\.(?:dark):/,
        
        // Preserve Kendo UI classes
        /^\\.k-/,
        
        // Preserve global resets
        /^:root/,
        /^html/,
        /^body/,
        /^\\*/,
        /^::/,
      ],
      transform: (prefix, selector, prefixedSelector) => {
        // Don't prefix if it's already prefixed or is a special selector
        if (selector.includes('#mfe-') || 
            selector.includes('html') || 
            selector.includes('body') ||
            selector.startsWith(':root')) {
          return selector;
        }
        return prefixedSelector;
      },
    }),
  ],
};`;
}

// Process each service
services.forEach(service => {
  const servicePath = path.join(__dirname, service.dir);
  
  if (!fs.existsSync(servicePath)) {
    console.log(`⚠️  Skipping ${service.dir} - directory not found`);
    return;
  }
  
  console.log(`\n📦 Processing ${service.dir}...`);
  
  // 1. Update/Create postcss.config.js
  const postcssPath = path.join(servicePath, 'postcss.config.js');
  fs.writeFileSync(postcssPath, generatePostCSSConfig(service.id));
  console.log(`  ✅ Updated postcss.config.js`);
  
  // 2. Create css-modules.d.ts
  const cssModulesPath = path.join(servicePath, 'src', 'css-modules.d.ts');
  fs.writeFileSync(cssModulesPath, cssModulesDefinitions);
  console.log(`  ✅ Created src/css-modules.d.ts`);
  
  // 3. Update tsconfig.json
  const tsconfigPath = path.join(servicePath, 'tsconfig.json');
  if (fs.existsSync(tsconfigPath)) {
    try {
      let tsconfig = fs.readFileSync(tsconfigPath, 'utf8');
      
      // Check if css-modules.d.ts is already included
      if (!tsconfig.includes('css-modules.d.ts')) {
        // Update include array
        tsconfig = tsconfig.replace(
          /"include":\s*\[([^\]]*)\]/,
          (match, content) => {
            const items = content.trim();
            if (items) {
              return `"include": [${items}, "src/css-modules.d.ts"]`;
            } else {
              return `"include": ["src", "src/css-modules.d.ts"]`;
            }
          }
        );
        
        fs.writeFileSync(tsconfigPath, tsconfig);
        console.log(`  ✅ Updated tsconfig.json`);
      } else {
        console.log(`  ℹ️  tsconfig.json already includes css-modules.d.ts`);
      }
    } catch (error) {
      console.log(`  ⚠️  Could not update tsconfig.json: ${error.message}`);
    }
  }
  
  // 4. Note about webpack.config.js and App.tsx
  console.log(`  ⚠️  Manual updates needed:`);
  console.log(`     - webpack.config.js: Add CSS Modules configuration`);
  console.log(`     - src/App.tsx: Add wrapper div with id="${service.id}"`);
});

console.log('\n' + '='.repeat(50));
console.log('🎉 CSS Modules migration configuration completed!');
console.log('='.repeat(50));
console.log('\nNext steps:');
console.log('1. Manually update webpack.config.js for each service');
console.log('2. Add wrapper divs to App.tsx files');
console.log('3. Test each microservice');
console.log('4. Run validation script to ensure isolation');