#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

// Change to service directory
const servicePath = path.join(__dirname, '../portaal-fe-sales');
process.chdir(servicePath);

console.log(`Starting portaal-fe-sales in ${servicePath}`);

// Start yarn
const yarn = spawn('yarn', ['start:live'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env }
});

// Handle errors
yarn.on('error', (err) => {
  console.error('Failed to start portaal-fe-sales:', err);
  process.exit(1);
});

// Handle exit
yarn.on('exit', (code) => {
  console.log(`portaal-fe-sales exited with code ${code}`);
  process.exit(code || 0);
});

// Forward signals to yarn process
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, stopping portaal-fe-sales...');
  yarn.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, stopping portaal-fe-sales...');
  yarn.kill('SIGINT');
});