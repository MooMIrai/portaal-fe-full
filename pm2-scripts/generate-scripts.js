const fs = require('fs');
const path = require('path');

const services = [
  { script: 'start-lookups.js', dir: 'portaal-fe-lookUps', name: 'portaal-fe-lookUps' },
  { script: 'start-sales.js', dir: 'portaal-fe-sales', name: 'portaal-fe-sales' },
  { script: 'start-hr.js', dir: 'portaal-fe-hr', name: 'portaal-fe-hr' },
  { script: 'start-recruiting.js', dir: 'portaal-fe-recruiting', name: 'portaal-fe-recruiting' },
  { script: 'start-stock.js', dir: 'portaal-fe-stock', name: 'portaal-fe-stock' },
  { script: 'start-notifications.js', dir: 'portaal-fe-notifications', name: 'portaal-fe-notifications' },
  { script: 'start-reports.js', dir: 'portaal-fe-reports', name: 'portaal-fe-reports' },
  { script: 'start-chatbot.js', dir: 'portaal-fe-chatbot', name: 'portaal-fe-chatbot' },
  { script: 'start-dashboard.js', dir: 'portaal-fe-dashboard', name: 'portaal-fe-dashboard' },
  { script: 'start-reporteditor.js', dir: 'portaal-fe-reporteditor', name: 'portaal-fe-reporteditor' },
  { script: 'start-dashboard-editor.js', dir: 'portaal-fe-dashboard-editor', name: 'portaal-fe-dashboard-editor' },
  { script: 'start-core.js', dir: 'portaal-fe-core', name: 'portaal-fe-core' }
];

const template = (dir, name) => `#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

// Change to service directory
const servicePath = path.join(__dirname, '../${dir}');
process.chdir(servicePath);

console.log(\`Starting ${name} in \${servicePath}\`);

// Start yarn
const yarn = spawn('yarn', ['start:live'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env }
});

// Handle errors
yarn.on('error', (err) => {
  console.error('Failed to start ${name}:', err);
  process.exit(1);
});

// Handle exit
yarn.on('exit', (code) => {
  console.log(\`${name} exited with code \${code}\`);
  process.exit(code || 0);
});

// Forward signals to yarn process
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, stopping ${name}...');
  yarn.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, stopping ${name}...');
  yarn.kill('SIGINT');
});`;

services.forEach(({ script, dir, name }) => {
  const content = template(dir, name);
  fs.writeFileSync(path.join(__dirname, script), content);
  console.log(`Created ${script}`);
});

console.log('All scripts created!');