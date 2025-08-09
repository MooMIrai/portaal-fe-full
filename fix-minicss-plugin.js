#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const services = [
  'auth', 'chatbot', 'common', 'core', 'dashboard', 'dashboard-editor',
  'hr', 'lookUps', 'notifications', 'personalarea', 'recruiting',
  'reporteditor', 'reports', 'sales', 'stock'
];

services.forEach(service => {
  const servicePath = service === 'dashboard-editor' 
    ? `portaal-fe-dashboard-editor` 
    : service === 'reporteditor'
    ? `portaal-fe-reporteditor`
    : `portaal-fe-${service}`;
  
  const webpackPath = path.join(servicePath, 'webpack.config.js');
  
  if (!fs.existsSync(webpackPath)) {
    console.log(`⚠️  ${webpackPath} non trovato`);
    return;
  }
  
  let content = fs.readFileSync(webpackPath, 'utf8');
  
  // Verifica se MiniCssExtractPlugin è già sempre presente
  if (content.includes('new MiniCssExtractPlugin') && !content.includes('argv.mode === \'production\' && new MiniCssExtractPlugin')) {
    console.log(`✓ ${servicePath} già corretto`);
    return;
  }
  
  // Sostituisci il pattern condizionale con uno sempre attivo
  content = content.replace(
    /argv\.mode === ['"]production['"] && new MiniCssExtractPlugin\({[\s\S]*?\}\),?/g,
    `new MiniCssExtractPlugin({
        filename: argv.mode === 'production' ? "[name].[contenthash].css" : "[name].css",
        chunkFilename: argv.mode === 'production' ? "[id].[contenthash].css" : "[id].css",
      }),`
  );
  
  // Se non trova il pattern condizionale, cerca solo MiniCssExtractPlugin senza condizione
  if (!content.includes('new MiniCssExtractPlugin')) {
    // Aggiungi prima di ].filter(Boolean)
    content = content.replace(
      /(\s*\]\.filter\(Boolean\))/,
      `,
      new MiniCssExtractPlugin({
        filename: argv.mode === 'production' ? "[name].[contenthash].css" : "[name].css",
        chunkFilename: argv.mode === 'production' ? "[id].[contenthash].css" : "[id].css",
      })$1`
    );
  }
  
  fs.writeFileSync(webpackPath, content);
  console.log(`✅ Corretto ${servicePath}/webpack.config.js`);
});

console.log('\n✅ Correzione MiniCssExtractPlugin completata!');