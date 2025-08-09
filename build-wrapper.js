#!/usr/bin/env node

/**
 * Build wrapper to bypass shell environment issues
 * This script directly executes webpack without going through the shell
 */

const { spawn } = require('child_process');
const path = require('path');

// Get the service name from command line args or use 'dashboard' as default
const service = process.argv[2] || 'dashboard';
const serviceDir = service === 'lookups' ? 'portaal-fe-lookUps' : `portaal-fe-${service}`;

// Change to service directory
process.chdir(path.join(__dirname, serviceDir));

console.log(`🔨 Building ${service}...`);
console.log(`📁 Working directory: ${process.cwd()}`);

// Try to find webpack - first in local node_modules, then in root
const fs = require('fs');
let webpackPath = path.join(process.cwd(), 'node_modules', '.bin', 'webpack');

// If webpack doesn't exist locally, try the root node_modules (yarn workspaces)
if (!fs.existsSync(webpackPath)) {
  webpackPath = path.join(__dirname, 'node_modules', '.bin', 'webpack');
  console.log('📦 Using webpack from root workspace');
}

// Spawn webpack directly
const webpack = spawn(webpackPath, ['--mode', 'production'], {
  stdio: 'inherit',
  shell: false  // Important: don't use shell
});

webpack.on('close', (code) => {
  if (code === 0) {
    console.log(`✅ ${service} built successfully!`);
  } else {
    console.error(`❌ ${service} build failed with code ${code}`);
    process.exit(code);
  }
});

webpack.on('error', (err) => {
  console.error(`❌ Failed to start webpack: ${err.message}`);
  process.exit(1);
});