# Guida Troubleshooting Completa - Portaal Frontend

## 🔍 Diagnosi Step-by-Step

### STEP 1: Identificare il Problema

#### A. L'applicazione non si apre affatto
- **Sintomo**: Schermo bianco su http://localhost:3000
- **Vai a**: [Sezione 1](#1-schermo-bianco)

#### B. L'applicazione si apre ma mancano moduli
- **Sintomo**: Menu incompleto o moduli non cliccabili
- **Vai a**: [Sezione 2](#2-moduli-mancanti)

#### C. Errori in console browser
- **Sintomo**: Errori rossi in F12 > Console
- **Vai a**: [Sezione 3](#3-errori-console)

#### D. Build fallisce
- **Sintomo**: `yarn build` da errore
- **Vai a**: [Sezione 4](#4-build-errors)

#### E. PM2 mostra servizi in errore
- **Sintomo**: `pm2 status` mostra "errored" o "stopped"
- **Vai a**: [Sezione 5](#5-pm2-issues)

---

## 1. Schermo Bianco

### Diagnosi
```bash
# 1. Verifica Core
curl http://localhost:3000
# Deve ritornare HTML con "core-root"

# 2. Verifica Common
curl http://localhost:3003/remoteEntry.js | head -1
# Deve contenere "var common"

# 3. Check logs
pm2 logs core --lines 100 | grep -i error
pm2 logs common --lines 100 | grep -i error
```

### Soluzioni

#### Fix 1.1: Restart Core e Common
```bash
pm2 restart core common
# Aspetta 10 secondi
curl http://localhost:3000
```

#### Fix 1.2: Verifica dipendenze
```bash
cd portaal-fe-core
yarn install
cd ../portaal-fe-common
yarn install
cd ..
pm2 restart core common
```

#### Fix 1.3: Pulizia cache webpack
```bash
# Stop servizi
pm2 stop core common

# Pulisci cache
rm -rf portaal-fe-core/node_modules/.cache
rm -rf portaal-fe-common/node_modules/.cache

# Riavvia
pm2 start core common
```

---

## 2. Moduli Mancanti

### Diagnosi
```bash
# Verifica quali moduli sono abilitati
cat portaal-fe-core/.env.development | grep ENABLED_MFES

# Verifica se i servizi sono online
pm2 status | grep portaal-fe

# Test remoteEntry di ogni modulo
for service in dashboard lookups sales hr recruiting stock notifications reports chatbot; do
  port=$(pm2 describe $service | grep -A1 "│ port" | tail -1 | awk '{print $4}')
  echo -n "$service: "
  curl -s -o /dev/null -w "%{http_code}" http://localhost:$port/remoteEntry.js
  echo ""
done
```

### Soluzioni

#### Fix 2.1: Abilita tutti i moduli
```bash
# Modifica il file
echo "ENABLED_MFES=" > portaal-fe-core/.env.development
# Riavvia core
pm2 restart core
```

#### Fix 2.2: Riavvia modulo specifico
```bash
# Per esempio, per Dashboard
pm2 restart dashboard
pm2 logs dashboard --lines 50
```

#### Fix 2.3: Verifica configurazione webpack
```bash
# Controlla che il modulo sia nel mfeConfig
grep -A5 "dashboard" portaal-fe-core/src/mfeConfig.ts
```

---

## 3. Errori Console

### Errori Comuni e Soluzioni

#### Error: "Loading script failed (missing: http://localhost:XXXX/remoteEntry.js)"
```bash
# Il servizio sulla porta XXXX non risponde
# Identifica il servizio dalla porta
pm2 list

# Riavvia il servizio
pm2 restart [nome-servizio]

# Verifica logs
pm2 logs [nome-servizio] --lines 100
```

#### Error: "Route is not defined"
```bash
# Problema con react-router in un modulo
# Soluzione: Verificare imports in App.tsx del modulo problematico
cd portaal-fe-[modulo]/src
grep -n "Route" App.tsx

# Il modulo dovrebbe usare il componente Routes da common, non Route direttamente
# Corretto: import Routes from 'common/Routes';
# Sbagliato: import { Route } from 'react-router-dom';
```

#### Error: "Cannot resolve module '2'"
```bash
# Problema shell environment (vecchio problema)
# Usa il build wrapper
cd portaal-fe-[modulo]
node ../build-wrapper.js [modulo]
```

#### Error: "Module not found: Error: Can't resolve 'common/...'"
```bash
# Common non è accessibile
# 1. Verifica che common sia online
pm2 status common

# 2. Verifica REMOTE_PATH nel modulo
cat portaal-fe-[modulo]/.env.development | grep REMOTE_PATH
# Deve essere: REMOTE_PATH=http://localhost:3003

# 3. Riavvia common e il modulo
pm2 restart common [modulo]
```

---

## 4. Build Errors

### Diagnosi
```bash
# Identifica quale servizio non builda
cd portaal-fe-[servizio]
yarn build
```

### Errori Comuni

#### Error: "Cannot find module 'webpack'"
```bash
# Webpack non installato localmente
yarn add -D webpack webpack-cli
```

#### Error: "PostCSS plugin postcss-prefix-selector requires PostCSS 8"
```bash
# Versione PostCSS incompatibile
yarn add -D postcss@8 postcss-loader@6
```

#### Error: CSS Module type errors
```bash
# Aggiungi type definitions
echo "declare module '*.module.scss';" > src/css-modules.d.ts
```

---

## 5. PM2 Issues

### Servizio in "errored" state
```bash
# 1. Check error log
pm2 logs [servizio] --err --lines 100

# 2. Reset servizio
pm2 delete [servizio]
pm2 start ecosystem.config.js --only [servizio]

# 3. Se persiste, debug manuale
cd portaal-fe-[servizio]
yarn start
# Osserva errori diretti
```

### Servizio in "stopped" state
```bash
# Riavvia
pm2 restart [servizio]

# Se non parte, verifica porta
lsof -i :[porta]
# Se occupata, killa processo
kill -9 [PID]
```

### PM2 non mostra servizi
```bash
# Reload ecosystem
pm2 delete all
pm2 start ecosystem.config.js
```

---

## 6. Debug Avanzato

### Abilitare verbose logging
```bash
# In ogni servizio .env.development
echo "DEBUG=*" >> portaal-fe-[servizio]/.env.development
pm2 restart [servizio]
```

### Analisi Network
```bash
# Monitora richieste HTTP
# Terminal 1
sudo tcpdump -i lo -n port 3000

# Terminal 2 - apri browser
# Osserva traffico
```

### Webpack Bundle Analyzer
```bash
# Aggiungi al webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

plugins: [
  new BundleAnalyzerPlugin()
]

# Build e analizza
yarn build
# Si apre browser con analisi bundle
```

---

## 7. Recovery Procedure

### Recovery Parziale (5 min)
```bash
# 1. Stop problematic services
pm2 stop [servizi-problematici]

# 2. Clear logs
pm2 flush

# 3. Restart uno alla volta
pm2 restart core
sleep 5
pm2 restart common
sleep 5
pm2 restart auth
# etc...
```

### Recovery Totale (15 min)
```bash
# 1. Backup .env files
find . -name ".env*" -exec cp {} {}.backup \;

# 2. Stop tutto
pm2 delete all

# 3. Clear tutto
find . -name "node_modules" -type d -prune -exec rm -rf {} +
find . -name "dist" -type d -prune -exec rm -rf {} +
rm -rf ~/.pm2/logs/*

# 4. Reinstalla
yarn install

# 5. Ripristina .env se necessario
find . -name "*.env*.backup" -exec bash -c 'mv "$1" "${1%.backup}"' _ {} \;

# 6. Riavvia
pm2 start ecosystem.config.js

# 7. Test
sleep 30
curl http://localhost:3000
```

---

## 8. Prevenzione

### Best Practices
1. **MAI usare npm**, sempre yarn
2. **Commit .env.example** files, non .env
3. **Test dopo ogni modifica** importante
4. **Mantieni logs puliti**: `pm2 flush` settimanale
5. **Documenta modifiche** in CHANGELOG.md

### Monitoring Setup
```bash
# Crea script monitoring
cat > monitor.sh << 'EOF'
#!/bin/bash
while true; do
  clear
  echo "=== PORTAAL MONITOR ==="
  date
  echo ""
  pm2 list
  echo ""
  echo "Failed services:"
  pm2 list | grep -E "(stopped|errored)"
  echo ""
  echo "Recent errors:"
  pm2 logs --nostream --lines 5 | grep -i error | tail -5
  sleep 10
done
EOF

chmod +x monitor.sh
./monitor.sh
```

---

## 9. Contatti e Risorse

### Log Locations
- PM2 logs: `~/.pm2/logs/`
- Yarn cache: `~/.cache/yarn/`
- Webpack cache: `node_modules/.cache/`

### Comandi Utili
```bash
# Version check
node -v && yarn -v && pm2 -v

# Port check
netstat -tulpn | grep LISTEN | grep -E "(3000|3003|3005|3006|3008|3009|3011|3012|3013|3015|3018|3020)"

# Process check
ps aux | grep webpack

# Memory check
free -h

# Disk check
df -h
```

### Emergency Commands
```bash
# Kill tutto webpack
pkill -f webpack

# Kill tutto node
pkill -f node

# Reset PM2
pm2 kill
pm2 resurrect
```

---

*Troubleshooting Guide v1.0*
*Ultimo aggiornamento: 2025-08-08*
*Per problemi non documentati, salvare logs e creare issue*