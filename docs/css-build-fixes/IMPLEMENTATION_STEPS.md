# Implementation Steps - CSS Build Fixes

**Data**: 2025-08-08  
**Obiettivo**: Step-by-step guide per risolvere tutti i problemi  
**Tempo Stimato**: 2-3 ore totali

## 🚀 Quick Start

```bash
# Posizione di partenza
cd /home/mverde/src/taal/portaal-fe-full

# Backup prima di iniziare (se non già fatto)
git stash push -m "BACKUP_BEFORE_CSS_FIXES_$(date +%Y%m%d_%H%M%S)"
```

## 📋 Step-by-Step Implementation

### STEP 1: Fix Errore "Module '2' not found" [🔴 CRITICO]
**Tempo**: 30-60 minuti  
**Priorità**: MASSIMA - Blocca tutto il resto

#### Opzione A: Test Diretto Webpack (Quick Test)
```bash
# Test 1: Esegui webpack direttamente
cd portaal-fe-dashboard
./node_modules/.bin/webpack --mode production

# Se funziona, il problema è in npm/yarn
# Se NON funziona, il problema è in webpack config
```

#### Opzione B: Crea Script Workaround
```bash
# Per ogni servizio, crea build-fix.sh
for service in dashboard lookups sales hr recruiting stock notifications reports chatbot personalarea; do
  cat > portaal-fe-$service/build-fix.sh << 'EOF'
#!/bin/bash
./node_modules/.bin/webpack --mode production
EOF
  chmod +x portaal-fe-$service/build-fix.sh
done
```

#### Opzione C: Fix Package.json (Recommended)
```bash
# Script per fixare tutti i package.json
cat > fix-build-scripts.js << 'EOF'
const fs = require('fs');
const path = require('path');

const services = [
  'dashboard', 'lookups', 'sales', 'hr', 'recruiting',
  'stock', 'notifications', 'reports', 'chatbot', 'personalarea'
];

services.forEach(service => {
  const dir = service === 'lookups' ? 'portaal-fe-lookUps' : `portaal-fe-${service}`;
  const packagePath = path.join(dir, 'package.json');
  
  if (fs.existsSync(packagePath)) {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Backup old build command
    if (pkg.scripts.build && !pkg.scripts['build:backup']) {
      pkg.scripts['build:backup'] = pkg.scripts.build;
    }
    
    // Fix build command
    pkg.scripts.build = './node_modules/.bin/webpack --mode production';
    
    fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`✅ Fixed ${dir}/package.json`);
  }
});
EOF

node fix-build-scripts.js
```

#### Test Fix
```bash
# Test su un servizio
cd portaal-fe-dashboard
yarn build
```

### STEP 2: Aggiungere Wrapper DIVs [🟡 IMPORTANTE]
**Tempo**: 45 minuti  
**Servizi**: 9 microservizi

#### Metodo Automatico (Script)
```bash
# Crea script per aggiungere wrapper divs
cat > add-wrapper-divs.js << 'EOF'
const fs = require('fs');
const path = require('path');

const services = [
  { dir: 'portaal-fe-lookUps', id: 'mfe-lookups' },
  { dir: 'portaal-fe-sales', id: 'mfe-sales' },
  { dir: 'portaal-fe-hr', id: 'mfe-hr' },
  { dir: 'portaal-fe-recruiting', id: 'mfe-recruiting' },
  { dir: 'portaal-fe-stock', id: 'mfe-stock' },
  { dir: 'portaal-fe-notifications', id: 'mfe-notifications' },
  { dir: 'portaal-fe-reports', id: 'mfe-reports' },
  { dir: 'portaal-fe-chatbot', id: 'mfe-chatbot' },
  { dir: 'portaal-fe-personalarea', id: 'mfe-personalarea' }
];

services.forEach(({ dir, id }) => {
  const appPath = path.join(dir, 'src', 'App.tsx');
  
  if (fs.existsSync(appPath)) {
    let content = fs.readFileSync(appPath, 'utf8');
    
    // Check if wrapper already exists
    if (content.includes(`id="${id}"`)) {
      console.log(`⏭️  ${dir} already has wrapper`);
      return;
    }
    
    // Add wrapper div
    content = content.replace(
      /return\s*\(\s*(<>|<React\.Fragment>|<div)/,
      `return (
    <div id="${id}" className="mfe-container">
      $1`
    );
    
    content = content.replace(
      /(<\/React\.Fragment>|<\/>|<\/div>)\s*\);\s*};?\s*$/,
      `$1
    </div>
  );
};`
    );
    
    fs.writeFileSync(appPath, content);
    console.log(`✅ Added wrapper to ${dir}/src/App.tsx`);
  }
});
EOF

node add-wrapper-divs.js
```

#### Metodo Manuale (Per ogni servizio)
```bash
# Esempio per Sales
cd portaal-fe-sales
vim src/App.tsx

# Aggiungi wrapper div all'inizio e alla fine del return
# PRIMA:
return (
  <>
    {/* content */}
  </>
);

# DOPO:
return (
  <div id="mfe-sales" className="mfe-container">
    {/* content */}
  </div>
);
```

### STEP 3: Build e Test Progressivo [🟢 VERIFICA]
**Tempo**: 30 minuti  
**Processo**: Build incrementale

#### 3.1 Test Dashboard (Più Complesso)
```bash
cd portaal-fe-dashboard

# Build
yarn build
# O se hai creato build-fix.sh
./build-fix.sh

# Verifica output
ls -la dist/

# Check per errori specifici
grep -r "ERROR" .
```

#### 3.2 Test Altri Servizi
```bash
# Script per testare tutti
cat > test-all-builds.sh << 'EOF'
#!/bin/bash

services="dashboard lookups sales hr recruiting stock notifications reports chatbot personalarea"
failed=""
succeeded=""

for service in $services; do
  echo "📦 Building $service..."
  
  if [ "$service" = "lookups" ]; then
    dir="portaal-fe-lookUps"
  else
    dir="portaal-fe-$service"
  fi
  
  cd $dir
  
  if [ -f "build-fix.sh" ]; then
    ./build-fix.sh > build.log 2>&1
  else
    yarn build > build.log 2>&1
  fi
  
  if [ $? -eq 0 ]; then
    echo "✅ $service built successfully"
    succeeded="$succeeded $service"
  else
    echo "❌ $service build failed"
    failed="$failed $service"
    tail -20 build.log
  fi
  
  cd ..
done

echo ""
echo "📊 Build Summary:"
echo "✅ Succeeded: $succeeded"
echo "❌ Failed: $failed"
EOF

chmod +x test-all-builds.sh
./test-all-builds.sh
```

### STEP 4: Fix Errori Specifici [🔧 DEBUG]
**Tempo**: 30 minuti buffer

#### Common Fixes

##### Fix 1: Missing Dependencies
```bash
# Se mancano dipendenze
cd portaal-fe-[service]
yarn install
```

##### Fix 2: TypeScript Errors
```bash
# Check TypeScript
npx tsc --noEmit

# Fix common TS issues
echo "export {};" >> src/declaration.d.ts
```

##### Fix 3: CSS Import Errors
```bash
# Verifica che tutti i CSS modules abbiano .module
find src -name "*.scss" -o -name "*.css" | grep -v ".module"

# Rinomina se necessario
mv src/styles.scss src/styles.module.scss
```

### STEP 5: Verifica Finale [✅ VALIDATION]
**Tempo**: 15 minuti

#### 5.1 Check Isolamento CSS
```bash
# Start services
yarn start:dev

# Apri browser e verifica:
# 1. Ogni microservizio ha wrapper div con ID corretto
# 2. Stili non si sovrappongono
# 3. Hot reload funziona
```

#### 5.2 Production Build Test
```bash
# Test build di produzione
for service in dashboard sales hr; do
  cd portaal-fe-$service
  NODE_ENV=production yarn build
  echo "✅ $service production build size: $(du -sh dist | cut -f1)"
  cd ..
done
```

#### 5.3 PM2 Restart
```bash
# Restart tutti i servizi
pm2 restart ecosystem.config.js

# Check status
pm2 status

# Check logs per errori
pm2 logs --lines 50
```

## 📝 Checklist Finale

- [ ] Errore "Module '2'" risolto
- [ ] Tutti i package.json hanno build command corretto
- [ ] 9 wrapper DIVs aggiunti
- [ ] Dashboard builda senza errori
- [ ] Lookups builda senza errori
- [ ] Sales builda senza errori
- [ ] HR builda senza errori
- [ ] Recruiting builda senza errori
- [ ] Stock builda senza errori
- [ ] Notifications builda senza errori
- [ ] Reports builda senza errori
- [ ] Chatbot builda senza errori
- [ ] PersonalArea builda senza errori
- [ ] CSS isolati verificati nel browser
- [ ] Hot reload funzionante
- [ ] PM2 riavviato con successo

## 🚨 Troubleshooting

### Problema: "Module '2' not found" persiste
```bash
# Soluzione drastica: reinstalla node_modules
rm -rf node_modules yarn.lock package-lock.json
yarn install
```

### Problema: Wrapper DIV non funziona
```bash
# Verifica che il formato sia corretto
grep -n "id=\"mfe-" src/App.tsx

# Assicurati che sia il primo elemento del return
```

### Problema: CSS non isolati
```bash
# Verifica postcss.config.js
cat postcss.config.js

# Verifica che il prefix sia applicato
yarn build
grep "#mfe-" dist/*.css
```

### Problema: Build lento
```bash
# Usa build parallelo
cat > parallel-build.sh << 'EOF'
#!/bin/bash
for service in dashboard lookups sales hr recruiting stock notifications reports chatbot personalarea; do
  (cd portaal-fe-$service && yarn build) &
done
wait
echo "All builds completed"
EOF
chmod +x parallel-build.sh
```

## 📊 Report Finale

Dopo aver completato tutti gli step:

```bash
# Genera report
cat > generate-report.sh << 'EOF'
#!/bin/bash
echo "# Build Fix Report - $(date)"
echo ""
echo "## Services Status"
for service in dashboard lookups sales hr recruiting stock notifications reports chatbot personalarea; do
  dir="portaal-fe-$service"
  [ "$service" = "lookups" ] && dir="portaal-fe-lookUps"
  
  if [ -f "$dir/dist/main.js" ]; then
    size=$(du -sh $dir/dist | cut -f1)
    echo "✅ $service - Built successfully ($size)"
  else
    echo "❌ $service - Build failed or not run"
  fi
done
EOF
chmod +x generate-report.sh
./generate-report.sh > docs/css-build-fixes/COMPLETION_REPORT.md
```

---

*Guida creata da Claude AI - 2025-08-08*  
*Per supporto: consultare la documentazione in docs/css-build-fixes/*