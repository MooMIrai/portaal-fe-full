# Guida al Debug - Portaal Frontend

Questa guida descrive tutte le modalità di debug disponibili per il progetto Portaal Frontend, un'applicazione Module Federation con 12 microfrontend.

## Indice

- [Panoramica Modalità](#panoramica-modalità)
- [Debug con VSCode (Breakpoint nell'Editor)](#debug-con-vscode-breakpoint-nelleditor)
- [Debug con Browser DevTools](#debug-con-browser-devtools)
- [Confronto Modalità](#confronto-modalità)
- [Troubleshooting](#troubleshooting)
- [Workflow Consigliati](#workflow-consigliati)

---

## Panoramica Modalità

Il progetto supporta **3 modalità di debug** principali:

### 1. 🔥 **Dev Mode** (Sviluppo con Hot Reload)
- **Comando**: `yarn dev`
- **Porte**: Ogni modulo su porta diversa (3000-3018)
- **Hot Reload**: ✅ Sì
- **Quando usare**: Sviluppo quotidiano, feature nuove, iterazioni rapide

### 2. 📦 **Preview Mode** (Produzione Locale)
- **Comando**: `yarn preview` oppure `npx serve dist -p 3000 -s`
- **Porta**: Unica porta 3000 (come produzione)
- **Hot Reload**: ❌ No (richiede rebuild)
- **Quando usare**: Test pre-deploy, debug ambiente simil-produzione

### 3. 🌐 **Remote Debug** (Produzione Railway)
- **URL**: https://portaal-fe-full-production.up.railway.app/
- **Accesso**: `railway ssh` per accesso container
- **Quando usare**: Debug problemi solo in produzione

---

## Debug con VSCode (Breakpoint nell'Editor)

### Prerequisiti

✅ **Estensione richiesta**: [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)

Tutte le configurazioni sono già impostate in `.vscode/launch.json` e `.vscode/tasks.json`.

### Configurazioni Disponibili

#### 🎬 **Debug Production Preview (with build)**
**Quando usare**: Debug completo partendo da zero, simula produzione.

1. Premi **F5** in VSCode
2. Seleziona "🎬 Debug Production Preview (with build)"
3. VSCode:
   - Builda automaticamente tutti i moduli
   - Copia in `dist/`
   - Avvia `serve` su porta 3000
   - Apre Chrome con debugger attaccato
4. **Breakpoint funzionanti** in tutti i file `.tsx`/`.ts`!

**Pro**:
- Build fresco garantito
- Setup automatico completo

**Contro**:
- Tempo di avvio: ~2-3 minuti (build completo)

---

#### ⚡ **Debug Production Preview (serve only)**
**Quando usare**: Debug rapido iterativo, quando hai già il build.

1. **Prima volta**: Esegui `yarn build:prod` manualmente
2. Premi **F5** in VSCode
3. Seleziona "⚡ Debug Production Preview (serve only)"
4. VSCode:
   - Serve dist/ esistente (NO rebuild)
   - Avvia Chrome con debugger
5. **Breakpoint funzionanti**!

**Pro**:
- **Velocissimo**: ~5 secondi
- Ideale per debug iterativo

**Contro**:
- Devi rebuilddare manualmente quando modifichi codice

**Workflow suggerito**:
```bash
# Terminal 1 - rebuilda quando modifichi
yarn build

# VSCode - usa questa config per debug rapido
# Premi F5 → "⚡ Debug Production Preview (serve only)"
```

---

#### 🌐 **Debug Core App (Chrome)**
**Quando usare**: Debug dev mode con hot reload.

1. Premi **F5** → "🌐 Debug Core App (Chrome)"
2. VSCode avvia automaticamente `yarn dev` (tutti i server)
3. Apre Chrome su http://localhost:3000
4. **Hot reload attivo**: modifiche in real-time

**Note**:
- Ogni modulo gira su porta separata
- Consuma più RAM (~12 processi webpack)

---

#### 🔗 **Attach to Chrome (All Modules)**
**Quando usare**: Attaccarsi a Chrome già aperto.

1. Avvia manualmente: `yarn dev`
2. Apri Chrome con debug: `google-chrome --remote-debugging-port=9222`
3. Premi **F5** → "🔗 Attach to Chrome (All Modules)"
4. VSCode si attacca al Chrome esistente

**Quando utile**:
- Chrome già configurato con estensioni specifiche
- Debug su profilo Chrome specifico

---

#### 🔧 **Debug Single Module** (Auth/Sales/HR/Common)
**Quando usare**: Debug di un singolo modulo isolato.

Configurazioni disponibili:
- 🔧 Debug Single Module: Auth (porta 3006)
- 🔧 Debug Single Module: Sales (porta 3008)
- 🔧 Debug Single Module: HR (porta 3009)
- 📦 Debug Common Library (porta 3003)

**Setup**:
1. Avvia manualmente il modulo:
   ```bash
   cd portaal-fe-sales
   yarn start
   ```
2. Premi **F5** → Seleziona il modulo
3. Debug solo quel modulo

**Quando utile**:
- Sviluppo isolato di un modulo
- Performance (un solo webpack-dev-server)

---

### Come Usare i Breakpoint

1. **Metti breakpoint nell'editor**:
   - Clicca sul margine sinistro nel file `.tsx`/`.ts`
   - Oppure `F9` sulla riga desiderata

2. **Esegui il debug**:
   - Premi **F5** → scegli configurazione
   - Oppure menu "Run" → "Start Debugging"

3. **Controlla il debug**:
   - **F10**: Step Over (esegui riga corrente)
   - **F11**: Step Into (entra nella funzione)
   - **Shift+F11**: Step Out (esci dalla funzione)
   - **F5**: Continue (continua esecuzione)

4. **Ispeziona variabili**:
   - Pannello "Variables" mostra variabili locali
   - Hover su variabili nel codice
   - Watch panel per espressioni custom

---

### SourceMaps - Tutti i 12 Moduli

Tutti i moduli hanno sourcemaps configurate:

```
webpack://core/*        → portaal-fe-core/src/*
webpack://common/*      → portaal-fe-common/src/*
webpack://auth/*        → portaal-fe-auth/src/*
webpack://sales/*       → portaal-fe-sales/src/*
webpack://hr/*          → portaal-fe-hr/src/*
webpack://stock/*       → portaal-fe-stock/src/*
webpack://lookups/*     → portaal-fe-lookUps/src/*
webpack://recruiting/*  → portaal-fe-recruiting/src/*
webpack://notification/* → portaal-fe-notifications/src/*
webpack://reports/*     → portaal-fe-reports/src/*
webpack://chatbot/*     → portaal-fe-chatbot/src/*
webpack://personalarea/* → portaal-fe-personalarea/src/*
```

Tutti i webpack.config.js hanno:
```javascript
devtool: "source-map"
```

Questo garantisce sourcemaps complete in **tutte le modalità** (dev e produzione).

---

## Debug con Browser DevTools

Se preferisci debuggare direttamente nel browser senza VSCode:

### Dev Mode

1. Avvia `yarn dev`
2. Apri http://localhost:3000
3. Apri Chrome DevTools (**F12**)
4. Tab **Sources** → `webpack://` → trovi i file originali
5. Metti breakpoint direttamente nel browser

### Preview Mode

1. Avvia `yarn preview`
2. Apri http://localhost:3000
3. Apri Chrome DevTools (**F12**)
4. Tab **Sources** → `webpack://` → file organizzati per modulo
5. Metti breakpoint

**Differenza con VSCode**:
- Breakpoint nel browser (non nell'editor)
- Stesse funzionalità di debug
- Nessun pre-launch task automatico

---

## Confronto Modalità

| Feature | Dev Mode (`yarn dev`) | Preview Mode (`yarn preview`) | Remote (Railway) |
|---------|----------------------|------------------------------|------------------|
| **Hot Reload** | ✅ Sì | ❌ No | ❌ No |
| **Porte** | Multi (3000-3018) | Singola (3000) | 8080 (interno) |
| **URL Modules** | http://localhost:XXXX | http://localhost:3000/module | https://URL/module |
| **Breakpoint VSCode** | ✅ Sì | ✅ Sì | ❌ No* |
| **Breakpoint Browser** | ✅ Sì | ✅ Sì | ✅ Sì (con sourcemaps) |
| **Build Time** | 10-30s iniziale | 2-3min completo | 2-3min (Railway) |
| **Sourcemaps** | ✅ Complete | ✅ Complete | ✅ Complete |
| **Minificato** | ❌ No | ✅ Sì | ✅ Sì |
| **Tree Shaking** | ❌ No | ✅ Sì | ✅ Sì |
| **Uso RAM** | ~2-3GB (12 processi) | ~500MB (1 processo serve) | - |
| **Simula Produzione** | ❌ No | ✅ Sì | ✅ È produzione |

\* Remote debug possibile con Chrome DevTools + sourcemaps pubbliche

---

## Troubleshooting

### ❌ Breakpoint non funzionano in VSCode

**Problema**: Breakpoint grigi/non attivati.

**Soluzioni**:
1. Verifica che la configurazione sia corretta in `.vscode/launch.json`
2. Controlla che `devtool: "source-map"` sia in `webpack.config.js`
3. Ribuilda: `yarn clean && yarn build:prod`
4. Riavvia VSCode debugger
5. Controlla nel browser DevTools → Sources se i file `.ts`/`.tsx` sono visibili

**Verifica sourcemaps**:
```bash
# Controlla che i file .map esistano
ls dist/**/*.map
ls dist/common/*.map
ls dist/sales/*.map
```

---

### ❌ Sourcemaps non caricano

**Problema**: Solo codice minificato visibile, niente file originali.

**Causa**: Sourcemaps non generate o path errato.

**Soluzioni**:
1. Verifica build mode:
   ```bash
   # Deve essere --mode=production per sourcemaps complete
   yarn build:prod
   ```

2. Controlla che i `.map` files esistano:
   ```bash
   find dist -name "*.map"
   ```

3. Se mancano, rebuilda:
   ```bash
   yarn clean
   yarn build:prod
   ```

---

### ❌ Port già in uso

**Problema**: `Error: listen EADDRINUSE: address already in use :::3000`

**Soluzioni**:

```bash
# Trova processo sulla porta
lsof -i :3000

# Killa processo
kill -9 <PID>

# Oppure killa tutti i node
pkill -f node
```

**Prevenzione**:
- Usa sempre `Ctrl+C` per terminare i server
- Chiudi tutti i terminali quando finisci

---

### ❌ Build fallisce

**Problema**: Errori durante `yarn build` o `yarn build:prod`.

**Cause comuni**:
1. **Dipendenze mancanti**: `yarn install`
2. **Cache corrotta**: `yarn clean && rm -rf node_modules && yarn install`
3. **Errori TypeScript**: Controlla output build per errori TS
4. **Out of memory**: Aumenta memoria Node: `NODE_OPTIONS=--max-old-space-size=4096 yarn build`

---

### ❌ Moduli remoti non caricano

**Problema**: Errore `Cannot resolve remote 'common'`.

**Causa**: Moduli remoti non buildati o URL errato.

**Soluzioni** (Dev Mode):
1. Verifica che tutti i server siano attivi:
   ```bash
   yarn dev  # Avvia TUTTI i moduli
   ```

2. Controlla che le porte siano corrette:
   - common: 3003
   - auth: 3006
   - sales: 3008
   - hr: 3009
   - ecc.

**Soluzioni** (Preview Mode):
1. Verifica che tutti i moduli siano buildati:
   ```bash
   ls dist/common/remoteEntry.js
   ls dist/sales/remoteEntry.js
   ls dist/hr/remoteEntry.js
   ```

2. Se mancano, rebuilda:
   ```bash
   yarn build:prod
   ```

---

## Workflow Consigliati

### 🚀 Sviluppo Feature Nuova

**Obiettivo**: Iterazione rapida con feedback immediato.

**Workflow**:
```bash
# 1. Avvia dev mode con hot reload
yarn dev

# 2. Debug in VSCode (opzionale)
# F5 → "🌐 Debug Core App (Chrome)"

# 3. Sviluppa con hot reload attivo
# Modifiche salvate → reload automatico
```

**Vantaggi**:
- Hot reload
- Feedback immediato
- Nessun rebuild manuale

---

### 🐛 Debug Bug Produzione

**Obiettivo**: Riprodurre bug in ambiente simil-produzione.

**Workflow**:
```bash
# 1. Build produzione
yarn build:prod

# 2. Debug preview mode in VSCode
# F5 → "⚡ Debug Production Preview (serve only)"

# 3. Ripeti:
#    - Identifica problema
#    - Modifica codice
#    - Rebuilda: yarn build
#    - Refresh browser (breakpoint rimangono!)
```

**Vantaggi**:
- Ambiente identico a produzione
- Breakpoint funzionanti
- Build ottimizzato (minified + tree-shaking)

---

### ⚡ Ottimizzazione Performance

**Obiettivo**: Profilare performance con build ottimizzato.

**Workflow**:
```bash
# 1. Build produzione
yarn build:prod

# 2. Avvia preview
yarn preview

# 3. Apri Chrome DevTools
# - Performance tab → Start profiling
# - Registra interazione
# - Analizza flame graph

# 4. Lighthouse audit
# - DevTools → Lighthouse tab
# - Genera report
```

**Tools**:
- Chrome DevTools Performance
- React DevTools Profiler
- Lighthouse
- Bundle analyzer (se configurato)

---

### 🧪 Test Pre-Deploy

**Obiettivo**: Verificare che tutto funzioni prima del deploy Railway.

**Checklist**:

```bash
# 1. Clean build
yarn clean
yarn build:prod

# 2. Preview locale
yarn preview

# 3. Test manualmente:
# - ✅ Tutti i moduli caricano (/sales, /hr, /stock, ecc.)
# - ✅ Login funziona
# - ✅ Navigation tra moduli
# - ✅ No errori console
# - ✅ Sourcemaps disponibili (DevTools → Sources)

# 4. Se tutto ok, push a Railway
git add .
git commit -m "Fix: descrizione"
git push origin develop
```

---

### 🔍 Debug Modulo Singolo

**Obiettivo**: Focus su un solo modulo senza overhead.

**Workflow**:
```bash
# 1. Avvia solo il modulo che ti interessa
cd portaal-fe-sales
yarn start

# 2. Se il modulo dipende da common/hr, avviali anche:
cd ../portaal-fe-common && yarn start &
cd ../portaal-fe-hr && yarn start &

# 3. Debug in VSCode
# F5 → "🔧 Debug Single Module: Sales"
```

**Vantaggi**:
- Meno RAM
- Build più veloce
- Focus su un solo modulo

---

## Comandi Rapidi

```bash
# Sviluppo
yarn dev                 # Avvia tutti i moduli (hot reload)
yarn dev:core            # Avvia solo core
yarn dev:common          # Avvia solo common

# Build
yarn build               # Build tutti i moduli
yarn build:prod          # Build + copia in dist/
yarn preview             # Build + serve su :3000

# Debug
yarn debug:browser       # Avvia browser con debug abilitato

# Utility
yarn clean               # Pulisce build artifacts
yarn install:all         # Reinstalla tutte le dipendenze

# Railway
railway logs             # Vedi logs produzione
railway ssh              # Accedi al container
railway status           # Stato deployment
```

---

## Risorse Utili

- **Webpack Module Federation**: [Docs](https://webpack.js.org/concepts/module-federation/)
- **Chrome DevTools**: [Guide](https://developer.chrome.com/docs/devtools/)
- **VSCode Debugging**: [Guide](https://code.visualstudio.com/docs/editor/debugging)
- **SourceMaps**: [Intro](https://web.dev/source-maps/)

---

## Note Finali

- **Tutti i 12 moduli** hanno sourcemaps complete
- **Breakpoint VSCode** funzionano in **tutte le modalità**
- **Preview mode** simula esattamente la produzione Railway
- Per problemi non risolti, controlla i logs: `yarn dev 2>&1 | tee dev.log`

Buon debug! 🐛🔍
