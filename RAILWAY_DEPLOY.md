# Guida Deploy Railway - Portaal Frontend

Guida completa per configurare, verificare e troubleshootare i deploy automatici su Railway per il progetto Portaal Frontend.

## Indice

- [Panoramica](#panoramica)
- [Verifica Configurazione Attuale](#verifica-configurazione-attuale)
- [Configurazione Repository](#configurazione-repository)
- [Watch Patterns](#watch-patterns)
- [Deploy Manuale](#deploy-manuale)
- [Troubleshooting](#troubleshooting)
- [Workflow Multi-Remote](#workflow-multi-remote)
- [Comandi Rapidi](#comandi-rapidi)

---

## Panoramica

### Come Funziona il Deploy Automatico

Railway monitora un repository Git e trigge un deploy automatico quando:

1. **Commit pushato** al branch monitorato (es. `develop` o `main`)
2. **File modificati** corrispondono ai `watchPatterns` definiti in `railway.json`
3. **Auto-deploy** è abilitato nel progetto Railway

### Architettura Attuale

```
Progetto: portaal-fe-full
├── Repository Locale
│   ├── origin  → Azure DevOps (vs-ssh.visualstudio.com)
│   └── github  → GitHub (github.com/MooMIrai/portaal-fe-full)
│
├── Railway Project
│   ├── Environment: production
│   ├── Repository: [DA VERIFICARE - prob. GitHub]
│   ├── Branch: develop
│   └── URL: https://portaal-fe-full-production.up.railway.app/
│
└── Build Process
    ├── Build Command: yarn railway:build
    ├── Start Command: npx serve dist -l tcp://0.0.0.0:$PORT -s
    └── Watch: railway.json watchPatterns
```

---

## Verifica Configurazione Attuale

### 1. Verifica Progetto Railway Attivo

```bash
railway status
```

**Output atteso**:
```
Project: portaal-fe-full
Environment: production
Service: portaal-fe-full
```

Se mostra un progetto diverso o errore → Devi collegare il progetto:
```bash
railway link
```

---

### 2. Verifica Deployment Recenti

```bash
railway deployment list
```

**Output mostra**:
- ID deployment
- Status (SUCCESS/FAILED/BUILDING)
- Timestamp

**Controlla**:
- Quando è stato l'ultimo deploy?
- È SUCCESS o FAILED?
- Corrisponde al tuo ultimo commit?

---

### 3. Verifica Repository Collegato (Dashboard)

**IMPORTANTE**: Railway CLI **non** mostra quale repository è collegato. Devi verificare nella dashboard web.

**Procedura**:

1. Vai su https://railway.app/dashboard
2. Seleziona progetto "portaal-fe-full"
3. Vai su **Settings** → **Source**
4. Verifica:
   - ✅ Repository: `MooMIrai/portaal-fe-full` (GitHub) o `taal/Portaal.js/portaal-fe-full` (Azure)
   - ✅ Branch: `develop`
   - ✅ Auto-deploy: **Enabled**

**Screenshot della configurazione dovrebbe mostrare**:
```
Source Repository: github.com/MooMIrai/portaal-fe-full
Branch: develop
Deploy on Push: ✅ Enabled
```

---

### 4. Verifica Variabili d'Ambiente

```bash
railway variables
```

**Variabili richieste**:
```
BE_PATH=https://portaaljsbe-production.up.railway.app
REMOTE_PATH=https://portaljs.nexadata.it
PORT=8080  # Automatico, gestito da Railway
```

Se mancano, aggiungi:
```bash
railway variables set BE_PATH=https://portaaljsbe-production.up.railway.app
railway variables set REMOTE_PATH=https://portaljs.nexadata.it
```

---

## Configurazione Repository

### Scenario: Railway collegato a GitHub

Se Railway è collegato a GitHub ma pushavi solo ad Azure DevOps, **i deploy non partiranno**.

#### Soluzione 1: Push a GitHub

```bash
# Verifica remotes
git remote -v

# Push al remote GitHub
git push github develop

# Opzionale: Push a entrambi sempre
git push origin develop && git push github develop
```

#### Soluzione 2: Cambiare Repository su Railway

**Via Dashboard**:
1. Railway Dashboard → Settings → Source
2. Click "Disconnect Repository"
3. Click "Connect Repository"
4. Seleziona Azure DevOps (se supportato) o GitHub
5. Autorizza Railway ad accedere
6. Seleziona branch `develop`

**Nota**: Railway supporta meglio GitHub. Azure DevOps richiede configurazione webhook manuale.

---

### Scenario: Railway collegato a Azure DevOps

Se Railway è già collegato ad Azure DevOps, verifica webhook:

**Via Azure DevOps**:
1. Vai su dev.azure.com → progetto Portaal.js
2. Project Settings → Service Hooks
3. Cerca webhook Railway
4. Verifica URL webhook sia attivo

Se webhook manca, aggiungilo:
```
URL: https://backboard.railway.app/webhooks/azure-devops/<PROJECT_ID>
Trigger: Push to branch develop
```

---

## Watch Patterns

### Configurazione Attuale (`railway.json`)

```json
"watchPatterns": [
  "portaal-fe-*/src/**",
  "portaal-fe-*/webpack.config.js",
  "portaal-fe-*/.env.production",
  "scripts/**",
  "package.json"
]
```

### Cosa Triggera un Deploy

✅ **Triggerano deploy**:
- Modifiche a file sorgenti: `portaal-fe-*/src/**`
- Modifiche webpack config: `portaal-fe-*/webpack.config.js`
- Modifiche env produzione: `portaal-fe-*/.env.production`
- Modifiche script: `scripts/**`
- Modifiche package.json root

❌ **NON triggerano deploy**:
- File `.vscode/**` (configurazioni VSCode)
- File `.md` (documentazione come README.md, DEBUGGING.md)
- File `.git*` (gitignore, gitattributes)
- File `dist/**` (build output, non commitare!)
- File `node_modules/**` (dipendenze)

### Modificare Watch Patterns

Se vuoi che anche altri file triggerino deploy:

1. Modifica `railway.json`:
   ```json
   "watchPatterns": [
     "portaal-fe-*/src/**",
     "portaal-fe-*/webpack.config.js",
     "portaal-fe-*/.env.production",
     "scripts/**",
     "package.json",
     "railway.json"  // <-- Aggiunto!
   ]
   ```

2. Commit e push:
   ```bash
   git add railway.json
   git commit -m "Update Railway watch patterns"
   git push <remote> develop
   ```

**Nota**: Modificare `railway.json` stesso NON triggerà deploy finché non è nei watchPatterns!

---

## Deploy Manuale

Quando il deploy automatico non parte, puoi triggerarlo manualmente.

### Opzione 1: Deploy Immediato (`railway up`)

```bash
# Deploy codice corrente (non serve commit)
railway up
```

**Quando usare**:
- Test rapido senza commit
- Deploy di modifiche locali non committate

**Limitazioni**:
- Deploya stato locale, non Git
- Non tracciato in history Git

---

### Opzione 2: Redeploy Ultimo Commit (`railway redeploy`)

```bash
# Re-deploya l'ultimo deployment
railway redeploy
```

**Quando usare**:
- Deployment fallito per problemi temporanei (network, timeout)
- Rebuild senza modifiche codice
- Refresh dopo modifica variabili ambiente

---

### Opzione 3: Deploy Commit Specifico (Dashboard)

**Via Web**:
1. Railway Dashboard → Deployments
2. Click "New Deployment"
3. Seleziona commit specifico
4. Click "Deploy"

---

### Opzione 4: Forzare Deploy via Commit Vuoto

Se hai pushato ma deploy non parte:

```bash
# Commit vuoto per triggerare deploy
git commit --allow-empty -m "Trigger Railway deployment"
git push <remote> develop
```

**Attenzione**: Funziona solo se:
- Repository corretto è collegato
- Branch corretto è monitorato
- Auto-deploy è abilitato

---

## Troubleshooting

### ❌ Railway non triggera deploy dopo push

**Diagnosi Step-by-Step**:

#### Step 1: Verifica che hai pushato al repository giusto

```bash
# Controlla remotes
git remote -v

# Controlla ultimo push
git log --oneline -1

# Verifica su quale remote hai pushato
git branch -vv
```

**Output esempio**:
```
* develop dcea30a [origin/develop] Add debug config
```

Se vedi `[origin/develop]` ma Railway è collegato a GitHub → **Problema trovato!**

**Soluzione**:
```bash
# Push anche a GitHub
git push github develop
```

---

#### Step 2: Verifica file modificati corrispondono a watchPatterns

```bash
# Vedi file modificati nell'ultimo commit
git show --name-only
```

**Se modifichi solo**:
- `.vscode/**` → Non trigge ra
- `README.md` → Non triggera
- `DEBUGGING.md` → Non triggera

**Soluzione**: Modifica un file watchato:
```bash
# Esempio: bumpa versione
npm version patch  # Modifica package.json
git push <remote> develop
```

---

#### Step 3: Verifica auto-deploy è attivo

**Via Dashboard**:
1. Railway → Settings → Source
2. Controlla "Deploy on Push" = **Enabled**

Se disabilitato → Abilita

---

#### Step 4: Verifica deployment status

```bash
railway deployment list
```

Se ultimo deployment è:
- **SKIPPED**: File non matchano watchPatterns
- **PENDING**: Deploy in coda
- **BUILDING**: In corso
- **FAILED**: Vedi logs → `railway logs`

---

### ❌ Deploy FAILED

```bash
# Vedi logs ultimo deployment
railway logs

# Oppure deployment specifico
railway logs --deployment <ID>
```

**Errori comuni**:

#### 1. Build fallisce

**Errore**: `yarn railway:build failed`

**Cause**:
- Errori TypeScript
- Dipendenze mancanti
- Out of memory

**Soluzioni**:
```bash
# Test build in locale
yarn clean
yarn install
yarn build:prod

# Se fallisce anche in locale, fixa errori
# Se funziona in locale, problema Railway config
```

#### 2. Start command fallisce

**Errore**: `Error: listen EADDRINUSE`

**Causa**: Porta già in uso (raro su Railway)

**Soluzione**: Verifica startCommand in `railway.json`:
```json
"startCommand": "npx serve dist -l tcp://0.0.0.0:$PORT -s"
```

Deve usare `$PORT` (variabile Railway), non porta hardcoded.

---

### ❌ Deploy SUCCESS ma sito non funziona (502)

**Problema**: Deploy completato, ma sito ritorna 502 Bad Gateway.

**Diagnosi**:

```bash
# Accedi al container
railway ssh

# Verifica processo attivo
ps aux | grep serve

# Verifica bind address
cat /proc/net/tcp | head -2
```

**Decodifica hex**:
- `00000000:PORT` = `0.0.0.0:PORT` ✅ Corretto
- `0100007F:PORT` = `127.0.0.1:PORT` ❌ Sbagliato (localhost only)

**Causa**: Server binda su localhost invece che 0.0.0.0.

**Soluzione**: Già fixata in railway.json:
```json
"startCommand": "npx serve dist -l tcp://0.0.0.0:$PORT -s"
```

Se problema persiste, verifica Public Networking su Railway dashboard.

---

### ❌ Deploy in PENDING infinito

**Causa**: Coda deployment o problema Railway infrastruttura.

**Soluzioni**:
1. Aspetta 5-10 minuti
2. Cancella deployment:
   ```bash
   railway deployment cancel
   ```
3. Redeploy:
   ```bash
   railway redeploy
   ```

---

## Workflow Multi-Remote

Il progetto ha 2 remotes Git. Ecco come gestirli.

### Setup Attuale

```bash
$ git remote -v
github  git@github.com:MooMIrai/portaal-fe-full.git
origin  taal@vs-ssh.visualstudio.com:v3/taal/Portaal.js/portaal-fe-full
```

### Workflow Consigliato

#### Opzione A: Railway su GitHub (Consigliato)

Se Railway è collegato a GitHub:

```bash
# Sviluppo normale
git add .
git commit -m "Feature: ..."

# Push a ENTRAMBI i remotes
git push origin develop    # Azure DevOps (backup/team)
git push github develop    # GitHub (Railway deploy)

# Oppure push simultaneo (config una volta)
git config alias.pushall '!git push origin develop && git push github develop'
git pushall  # Push a entrambi
```

**Pro**:
- Deploy automatico su GitHub push
- GitHub ha miglior integrazione Railway
- Webhook automatico

**Contro**:
- Devi ricordarti di pushare a entrambi

---

#### Opzione B: Railway su Azure DevOps

Se Railway è collegato ad Azure DevOps:

```bash
# Push solo ad Azure
git push origin develop

# Deploy dovrebbe partire automaticamente
# Se non parte, webhook non configurato
```

**Pro**:
- Un solo push necessario
- Centralizzato su Azure DevOps

**Contro**:
- Webhook Azure→Railway da configurare manualmente
- Meno stabile di GitHub

---

### Sincronizzare i Remotes

Se hai pushato solo a un remote e vuoi sincronizzare:

```bash
# Situazione: pushato solo a origin (Azure)
# Vuoi sincronizzare su github

# Fetch da origin
git fetch origin

# Push branch develop a github
git push github develop

# Verifica sincronizzazione
git log origin/develop..github/develop  # Dovrebbe essere vuoto
```

---

### Cambiare Remote Principale

Se vuoi usare GitHub come remote principale:

```bash
# Rinomina remotes
git remote rename origin azure
git remote rename github origin

# Ora origin = GitHub, azure = Azure DevOps

# Update branch tracking
git branch -u origin/develop

# Verifica
git remote -v
```

---

## Comandi Rapidi

### Verifica Status

```bash
# Status progetto Railway
railway status

# Lista deployment recenti
railway deployment list

# Logs live
railway logs --follow

# Logs ultimo deployment
railway logs

# Variabili ambiente
railway variables
```

### Deploy

```bash
# Deploy immediato (codice locale)
railway up

# Redeploy ultimo commit
railway redeploy

# Forza deploy via commit vuoto
git commit --allow-empty -m "Trigger deploy"
git push github develop
```

### Debug

```bash
# SSH nel container produzione
railway ssh

# Esegui comando nel container
railway ssh "comando"

# Esempio: controlla processo
railway ssh "ps aux | grep serve"

# Esempio: verifica network binding
railway ssh "cat /proc/net/tcp | head -3"

# Esempio: verifica file deployati
railway ssh "ls -la /app/dist"
```

### Gestione Service

```bash
# Restart service
railway restart

# Rimuovi deployment
railway deployment remove <ID>

# Lista servizi nel progetto
railway service

# Switch ambiente
railway environment
```

### Git Multi-Remote

```bash
# Push a entrambi i remotes
git push origin develop && git push github develop

# Verifica differenze tra remotes
git log origin/develop..github/develop

# Forza sync GitHub con Azure
git push github origin/develop:develop --force

# Verifica branch tracking
git branch -vv
```

---

## Checklist Pre-Deploy

Prima di ogni deploy importante:

- [ ] Test locale funziona: `yarn preview`
- [ ] No errori TypeScript: `yarn build`
- [ ] Commit message descrittivo
- [ ] Push al remote corretto (GitHub se Railway su GitHub)
- [ ] File modificati matchano watchPatterns?
- [ ] Variabili ambiente configurate su Railway
- [ ] Auto-deploy abilitato su Railway
- [ ] Branch corretto (`develop`)

---

## Checklist Post-Deploy

Dopo deploy completato:

- [ ] Deployment status = SUCCESS: `railway deployment list`
- [ ] Sito accessibile: https://portaal-fe-full-production.up.railway.app/
- [ ] No errori 502
- [ ] Tutti moduli caricano (`/sales`, `/hr`, `/stock`, ecc.)
- [ ] Check logs per errori: `railway logs`
- [ ] Test funzionalità principali

---

## Configurazione Consigliata

Per un workflow ottimale:

1. **Railway collegato a GitHub**
2. **Branch `develop` monitorato**
3. **Auto-deploy abilitato**
4. **Push a entrambi remotes** (Azure + GitHub)
5. **WatchPatterns includono** `railway.json` stesso

Setup:
```bash
# 1. Verifica Railway su GitHub (via dashboard)

# 2. Configura git alias per push simultaneo
git config --local alias.pushall '!git push origin develop && git push github develop'

# 3. Usa sempre pushall
git pushall

# 4. Verifica deploy partito
railway deployment list
```

---

## Risorse Utili

- **Railway Dashboard**: https://railway.app/dashboard
- **Railway Docs**: https://docs.railway.app/
- **Railway CLI**: https://docs.railway.app/develop/cli
- **GitHub Repository**: https://github.com/MooMIrai/portaal-fe-full
- **Azure DevOps**: https://dev.azure.com/taal/Portaal.js

---

## Note Finali

- Railway deploy automatico funziona **solo** se collegato al repository giusto
- File `.vscode` e `.md` **non** triggerano deploy per design
- Per test rapidi, usa `railway up` invece di commit
- Logs Railway sono essenziali per debug: `railway logs --follow`
- SSH nel container utile per verifiche runtime: `railway ssh`

Per problemi non risolti, contatta il team o apri issue su GitHub.
