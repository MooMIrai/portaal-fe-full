#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const services = [
  { dir: 'portaal-fe-lookUps', id: 'mfe-lookups', name: 'Lookups' },
  { dir: 'portaal-fe-sales', id: 'mfe-sales', name: 'Sales' },
  { dir: 'portaal-fe-hr', id: 'mfe-hr', name: 'HR' },
  { dir: 'portaal-fe-recruiting', id: 'mfe-recruiting', name: 'Recruiting' },
  { dir: 'portaal-fe-stock', id: 'mfe-stock', name: 'Stock' },
  { dir: 'portaal-fe-notifications', id: 'mfe-notifications', name: 'Notifications' },
  { dir: 'portaal-fe-reports', id: 'mfe-reports', name: 'Reports' },
  { dir: 'portaal-fe-chatbot', id: 'mfe-chatbot', name: 'Chatbot' },
  { dir: 'portaal-fe-personalarea', id: 'mfe-personalarea', name: 'PersonalArea' }
];

console.log('🎨 Adding wrapper DIVs for CSS isolation...\n');

let successCount = 0;
let failCount = 0;

services.forEach(({ dir, id, name }) => {
  const appPath = path.join(dir, 'src', 'App.tsx');
  
  if (!fs.existsSync(appPath)) {
    console.log(`⚠️  ${dir}/src/App.tsx not found, skipping...`);
    failCount++;
    return;
  }
  
  try {
    let content = fs.readFileSync(appPath, 'utf8');
    
    // Check if wrapper already exists
    if (content.includes(`id="${id}"`) || content.includes(`id='${id}'`)) {
      console.log(`⏭️  ${name} already has wrapper div with id="${id}"`);
      successCount++;
      return;
    }
    
    // Backup original file
    const backupPath = appPath + '.backup';
    if (!fs.existsSync(backupPath)) {
      fs.writeFileSync(backupPath, content);
    }
    
    // Find the main return statement and wrap it
    // Look for patterns like:
    // return (
    //   <something>
    // );
    
    // Try to find the main component function
    const componentPatterns = [
      /export\s+(?:default\s+)?(?:const|function)\s+App[^{]*\{[\s\S]*?return\s*\(/,
      /const\s+App[^{]*\{[\s\S]*?return\s*\(/,
      /function\s+App[^{]*\{[\s\S]*?return\s*\(/
    ];
    
    let modified = false;
    
    for (const pattern of componentPatterns) {
      if (pattern.test(content)) {
        // Find the return statement and add wrapper
        content = content.replace(
          /(return\s*\(\s*)([\s\S]*?)(\s*\);?\s*};?\s*$)/m,
          (match, returnStart, innerContent, returnEnd) => {
            // Check if there's already a single root element
            const trimmedInner = innerContent.trim();
            
            // If it starts with <> or <React.Fragment, we need to replace it
            if (trimmedInner.startsWith('<>') || trimmedInner.startsWith('<React.Fragment')) {
              // Replace fragment with div wrapper
              const newInner = trimmedInner
                .replace(/^<>/, `<div id="${id}" className="mfe-container">`)
                .replace(/^<React\.Fragment>/, `<div id="${id}" className="mfe-container">`)
                .replace(/<\/>$/, '</div>')
                .replace(/<\/React\.Fragment>$/, '</div>');
              
              return returnStart + '\n    ' + newInner + '\n  ' + returnEnd;
            } 
            // If it's already a div or other element, wrap it
            else {
              return returnStart + `
    <div id="${id}" className="mfe-container">
      ${innerContent}
    </div>` + returnEnd;
            }
          }
        );
        modified = true;
        break;
      }
    }
    
    if (!modified) {
      // If no pattern matched, try a more aggressive approach
      // Look for any return statement with JSX
      const returnPattern = /return\s*\(\s*([\s\S]*?)\s*\);/g;
      const matches = [...content.matchAll(returnPattern)];
      
      if (matches.length > 0) {
        // Use the last match (usually the main component return)
        const lastMatch = matches[matches.length - 1];
        const [fullMatch, innerContent] = lastMatch;
        
        const wrappedContent = `return (
    <div id="${id}" className="mfe-container">
      ${innerContent.trim()}
    </div>
  );`;
        
        content = content.replace(fullMatch, wrappedContent);
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(appPath, content);
      console.log(`✅ Added wrapper div to ${name} (id="${id}")`);
      successCount++;
    } else {
      console.log(`❌ Could not modify ${name} - manual intervention may be needed`);
      failCount++;
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${dir}: ${error.message}`);
    failCount++;
  }
});

console.log(`\n📊 Summary:`);
console.log(`   ✅ Successfully processed: ${successCount} services`);
if (failCount > 0) {
  console.log(`   ❌ Failed or skipped: ${failCount} services`);
}
console.log('\n💡 Note: Review the changes and test each service to ensure proper rendering');