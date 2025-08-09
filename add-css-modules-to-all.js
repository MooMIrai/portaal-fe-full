#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Services that need CSS modules configuration
const services = [
  'auth',
  'chatbot', 
  'hr',
  'lookups',
  'notifications',
  'personal-area',
  'recruiting',
  'reports',
  'sales',
  'stock'
];

services.forEach(service => {
  const webpackPath = path.join(__dirname, `portaal-fe-${service}`, 'webpack.config.js');
  
  if (!fs.existsSync(webpackPath)) {
    console.log(`❌ ${service}: webpack.config.js not found`);
    return;
  }
  
  let content = fs.readFileSync(webpackPath, 'utf8');
  
  // Check if already has CSS modules
  if (content.includes('.module.')) {
    console.log(`✅ ${service}: Already has CSS modules`);
    return;
  }
  
  // Add MiniCssExtractPlugin import if not present
  if (!content.includes('MiniCssExtractPlugin')) {
    const dotenvIndex = content.indexOf('const Dotenv');
    if (dotenvIndex !== -1) {
      content = content.slice(0, dotenvIndex) + 
        'const MiniCssExtractPlugin = require("mini-css-extract-plugin");\n' +
        content.slice(dotenvIndex);
    }
  }
  
  // Find the CSS rule and replace it with CSS modules configuration
  const cssRuleRegex = /{\s*test:\s*\/\\.\(css\|s\[ac\]ss\)\$\/i,[\s\S]*?},/g;
  
  const newCssRules = `// CSS Modules for component-specific styles
        {
          test: /\\.module\\.(css|scss)$/,
          use: [
            mode === 'development' ? "style-loader" : MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: mode === 'development' 
                    ? "[name]__[local]__${service}_[hash:base64:5]"
                    : "[hash:base64:8]",
                  exportLocalsConvention: "camelCase",
                },
                importLoaders: 2,
                sourceMap: mode === 'development',
              },
            },
            "postcss-loader",
          ],
        },
        // Global styles (index.scss and others)
        {
          test: /(?<!\\.module)\\.(css|scss)$/,
          use: [
            mode === 'development' ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader",
          ],
        },`;
  
  // Replace the old CSS rule with new ones
  let replacementDone = false;
  content = content.replace(cssRuleRegex, (match) => {
    if (!replacementDone) {
      replacementDone = true;
      return newCssRules;
    }
    return match;
  });
  
  // Add MiniCssExtractPlugin to plugins array if not present
  if (!content.includes('new MiniCssExtractPlugin')) {
    // Find plugins array
    const pluginsMatch = content.match(/plugins:\s*\[([^]*?)\],/);
    if (pluginsMatch) {
      const pluginsContent = pluginsMatch[1];
      const newPluginsContent = pluginsContent + ',\n      mode === \'production\' && new MiniCssExtractPlugin({\n        filename: mode === \'production\' ? "[name].[contenthash].css" : "[name].css",\n        chunkFilename: mode === \'production\' ? "[id].[contenthash].css" : "[id].css",\n      })';
      content = content.replace(pluginsMatch[0], `plugins: [${newPluginsContent}].filter(Boolean),`);
    }
  }
  
  // Ensure mode variable is properly set
  if (!content.includes('const mode = argv.mode')) {
    content = content.replace(
      'module.exports = (_, argv) => {',
      'module.exports = (_, argv) => {\n  const mode = argv.mode || \'development\';'
    );
    
    // Replace all argv.mode with mode
    content = content.replace(/argv\.mode/g, 'mode');
  }
  
  // Add clsx to shared dependencies if not present
  if (!content.includes('clsx:')) {
    const sharedMatch = content.match(/shared:\s*{([^}]*)}/);
    if (sharedMatch) {
      const sharedContent = sharedMatch[1];
      const newSharedContent = sharedContent + ',\n    clsx: {\n      singleton: true,\n      requiredVersion: deps["clsx"] || false,\n    }';
      content = content.replace(sharedMatch[0], `shared: {${newSharedContent}}`);
    }
  }
  
  fs.writeFileSync(webpackPath, content);
  console.log(`✅ ${service}: CSS modules configuration added`);
});

console.log('\n✅ CSS modules configuration complete for all services');