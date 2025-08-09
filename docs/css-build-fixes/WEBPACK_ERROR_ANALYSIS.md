# Webpack Error Analysis: "Module not found: Error: Can't resolve '2'"

**Data Analisi**: 2025-08-08  
**Errore**: Module resolution failure per modulo "2"  
**Impatto**: Blocco totale del build per tutti i microservizi

## 🔴 Errore Completo

```
ERROR in main
Module not found: Error: Can't resolve '2' in '/home/mverde/src/taal/portaal-fe-full/portaal-fe-[service]'
resolve '2' in '/home/mverde/src/taal/portaal-fe-full/portaal-fe-[service]'
  Parsed request is a module
  using description file: /home/mverde/src/taal/portaal-fe-full/portaal-fe-[service]/package.json (relative path: .)
    Field 'browser' doesn't contain a valid alias configuration
    resolve as module
      looking for modules in /home/mverde/src/taal/portaal-fe-full/portaal-fe-[service]/node_modules
        single file module
          [attempts to resolve with .tsx, .ts, .jsx, .js, .json, .mjs extensions]
        /home/mverde/src/taal/portaal-fe-full/portaal-fe-[service]/node_modules/2 doesn't exist
      looking for modules in /home/mverde/src/taal/portaal-fe-full/node_modules
        [same resolution attempts]
      [continues up directory tree]

webpack 5.101.0 compiled with 1 error
```

## 🔍 Analisi del Problema

### 1. Sintomo Osservato

Quando si esegue:
- `npm run build`
- `yarn build`
- `npx webpack --mode production`

Il comando effettivamente eseguito diventa:
```bash
webpack --mode production 2
```

Nota il "2" aggiunto alla fine del comando!

### 2. Dove NON è il Problema

Abbiamo verificato e escluso:

✅ **Package.json** - Il comando è corretto:
```json
"scripts": {
  "build": "webpack --mode production"
}
```

✅ **Codice sorgente** - Nessun import errato:
- Nessun `import '2'`
- Nessun `require('2')`
- Nessun `import something from '2'`

✅ **Webpack config** - Configurazione corretta, nessun riferimento a "2"

✅ **Caratteri nascosti** - Verificato con hexdump:
```
0000000   w   e   b   p   a   c   k       -   -   m   o   d   e       p
0000020   r   o   d   u   c   t   i   o   n  \n
```

### 3. Possibili Cause

#### Causa #1: Shell Expansion Issue (Più Probabile)
**Probabilità**: 🔴 Alta

Il "2" potrebbe essere interpretato come:
- File descriptor redirect (2>&1)
- Variabile di ambiente
- Alias di shell

**Test da fare**:
```bash
# Test diretto
/bin/bash -c "webpack --mode production"

# Test con env pulito
env -i webpack --mode production

# Test con sh invece di bash
sh -c "webpack --mode production"
```

#### Causa #2: NPM/Yarn Bug
**Probabilità**: 🟡 Media

Potrebbe essere un bug in:
- npm workspace configuration
- yarn workspaces
- Script runner interpretation

**Test da fare**:
```bash
# Bypass npm/yarn
npx --no-install webpack --mode production

# Run direttamente
node_modules/.bin/webpack --mode production
```

#### Causa #3: Webpack Entry Point Issue
**Probabilità**: 🟢 Bassa

Webpack potrebbe interpretare male l'entry point o un plugin.

**Verifiche fatte**:
- Entry point è configurato correttamente
- Nessun plugin sospetto

#### Causa #4: Encoding/Locale Issue
**Probabilità**: 🟢 Bassa

Problema di encoding dei file o locale del sistema.

**Test da fare**:
```bash
# Check locale
locale

# Run with C locale
LC_ALL=C webpack --mode production
```

## 🛠️ Soluzioni Proposte

### Soluzione 1: Workaround Immediato (Quick Fix)

Creare script di build alternativo che bypassa il problema:

```bash
#!/bin/bash
# build-workaround.sh
node_modules/.bin/webpack --mode production
```

### Soluzione 2: Fix Package.json (Recommended)

Modificare tutti i package.json:

```json
{
  "scripts": {
    "build": "node_modules/.bin/webpack --mode production",
    "build:old": "webpack --mode production"
  }
}
```

### Soluzione 3: Webpack Direct Config

Creare un file `build.js`:

```javascript
const webpack = require('webpack');
const config = require('./webpack.config.js');

webpack(config({ mode: 'production' }, { mode: 'production' }), (err, stats) => {
  if (err || stats.hasErrors()) {
    console.error(err || stats.toString());
    process.exit(1);
  }
  console.log(stats.toString({ colors: true }));
});
```

### Soluzione 4: Debug e Fix Root Cause

1. Identificare esattamente dove il "2" viene aggiunto
2. Trace del processo con strace
3. Debug di npm/yarn script execution

## 📊 Test Effettuati e Risultati

| Test | Comando | Risultato |
|------|---------|-----------|
| npm run build | `npm run build` | ❌ Errore "2" |
| yarn build | `yarn build` | ❌ Errore "2" |
| npx webpack | `npx webpack --mode production` | ❌ Errore "2" |
| Direct webpack | `./node_modules/.bin/webpack --mode production` | ⏳ Da testare |
| Clean env | `env -i webpack --mode production` | ⏳ Da testare |

## 🎯 Piano d'Azione

1. **Immediato**: Implementare Soluzione 1 (workaround script)
2. **Short-term**: Test Soluzione 2 (fix package.json)
3. **Long-term**: Identificare root cause per fix permanente

## 📝 Note Aggiuntive

- Il problema si manifesta in TUTTI i microservizi
- Non è correlato al contenuto del codice
- Sembra essere un problema di ambiente/tooling
- Potrebbe essere stato introdotto da uno script di automazione

## 🔗 Riferimenti

- [Webpack CLI Documentation](https://webpack.js.org/api/cli/)
- [NPM Scripts Documentation](https://docs.npmjs.com/cli/v8/using-npm/scripts)
- [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/)

---

*Analisi completata da Claude AI - 2025-08-08*