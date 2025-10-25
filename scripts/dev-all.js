#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../portaal-fe-core/.env.development') });

// Get enabled modules from environment variable
const enabledMfesEnv = process.env.ENABLED_MFES;
let enabledModules = [];

if (enabledMfesEnv && enabledMfesEnv.trim() !== '') {
  enabledModules = enabledMfesEnv.split(',').map(m => m.trim());
  console.log('📋 ENABLED_MFES:', enabledModules.join(', '));
} else {
  console.log('📋 ENABLED_MFES is empty - starting ALL modules');
}

// Always start common and core
const requiredModules = ['portaal-fe-common', 'portaal-fe-core'];

// Map of all available modules
const moduleMap = {
  'auth': 'portaal-fe-auth',
  'chatbot': 'portaal-fe-chatbot',
  'dashboard': 'portaal-fe-dashboard',
  'hr': 'portaal-fe-hr',
  'lookups': 'portaal-fe-lookUps',
  'notification': 'portaal-fe-notifications',
  'personalarea': 'portaal-fe-personalarea',
  'recruiting': 'portaal-fe-recruiting',
  'reports': 'portaal-fe-reports',
  'sales': 'portaal-fe-sales',
  'stock': 'portaal-fe-stock'
};

// Port mapping for each module (from webpack configs)
const modulePorts = {
  'portaal-fe-common': 3003,
  'portaal-fe-core': 3000,
  'portaal-fe-auth': 3006,
  'portaal-fe-chatbot': 3018,
  'portaal-fe-hr': 3009,
  'portaal-fe-lookUps': 3005,
  'portaal-fe-notifications': 3013,
  'portaal-fe-recruiting': 3011,
  'portaal-fe-reports': 3015,
  'portaal-fe-sales': 3008,
  'portaal-fe-stock': 3012
};

// Build list of modules to start
let modulesToStart = [...requiredModules];

if (enabledModules.length === 0) {
  // Start all modules
  modulesToStart = [...requiredModules, ...Object.values(moduleMap)];
} else {
  // Start only enabled modules
  enabledModules.forEach(key => {
    const moduleName = moduleMap[key];
    if (moduleName && !modulesToStart.includes(moduleName)) {
      modulesToStart.push(moduleName);
    }
  });
}

// Filter out modules that don't exist
modulesToStart = modulesToStart.filter(module => {
  const modulePath = path.join(__dirname, '..', module);
  return fs.existsSync(modulePath);
});

console.log('\n🚀 Starting development servers...\n');
console.log('📦 Modules to start:', modulesToStart.join(', '));
console.log('');

const processes = [];

// Start each module in its own process
modulesToStart.forEach((module, index) => {
  const port = modulePorts[module] || 'unknown';
  console.log(`[${index + 1}/${modulesToStart.length}] 🌐 Starting ${module} on port ${port}...`);

  const modulePath = path.join(__dirname, '..', module);

  const child = spawn('yarn', ['start'], {
    cwd: modulePath,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true,
    env: { ...process.env }
  });

  child.stdout.on('data', (data) => {
    const output = data.toString().trim();
    if (output) {
      console.log(`[${module}] ${output}`);
    }
  });

  child.stderr.on('data', (data) => {
    const output = data.toString().trim();
    if (output && !output.includes('webpack.Progress')) {
      console.error(`[${module}] ${output}`);
    }
  });

  child.on('close', (code) => {
    console.log(`[${module}] ❌ Process exited with code ${code}`);
  });

  processes.push({ module, child, port });
});

console.log('\n' + '='.repeat(60));
console.log('🎉 All dev servers started!');
console.log('='.repeat(60));
console.log('\nAccess points:');
modulesToStart.forEach(module => {
  const port = modulePorts[module];
  if (port) {
    console.log(`  • ${module.padEnd(30)} → http://localhost:${port}`);
  }
});
console.log('\n📝 Core application: http://localhost:3000');
console.log('='.repeat(60));
console.log('\n💡 Press Ctrl+C to stop all servers\n');

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down all dev servers...\n');

  processes.forEach(({ module, child }) => {
    console.log(`   Stopping ${module}...`);
    child.kill('SIGTERM');
  });

  setTimeout(() => {
    console.log('\n✅ All servers stopped\n');
    process.exit(0);
  }, 2000);
});

// Keep the process running
process.stdin.resume();
