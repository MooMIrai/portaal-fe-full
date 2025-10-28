# Portaal Frontend Full

Applicazione frontend modulare basata su **Webpack Module Federation** per la gestione di un portale aziendale integrato.

## Architettura

Il progetto è strutturato come un **monorepo** con **12 microfrontend indipendenti** che comunicano tra loro tramite Module Federation. Ogni modulo può essere sviluppato, buildato e deployato indipendentemente.

### Moduli

- **portaal-fe-core**: Shell application principale che orchestra tutti i moduli
- **portaal-fe-common**: Modulo condiviso con componenti, utilities e servizi comuni
- **portaal-fe-auth**: Gestione autenticazione e autorizzazione
- **portaal-fe-sales**: Modulo vendite
- **portaal-fe-stock**: Gestione magazzino
- **portaal-fe-hr**: Risorse umane
- **portaal-fe-recruiting**: Gestione recruiting
- **portaal-fe-lookUps**: Gestione tabelle di lookup
- **portaal-fe-notifications**: Sistema di notifiche
- **portaal-fe-reports**: Modulo reportistica
- **portaal-fe-chatbot**: Chatbot integrato
- **portaal-fe-personalarea**: Area personale utente

## Requisiti

- **Node.js**: >= 18.0.0
- **Yarn**: >= 1.22.0

## Setup Locale

### 1. Installazione dipendenze

```bash
yarn install:all
```

Questo comando installa le dipendenze per tutti i moduli del workspace.

### 2. Configurazione ambiente

Ogni modulo ha i propri file di configurazione ambiente:

- `.env.development` - Configurazione per sviluppo locale
- `.env.production` - Configurazione per produzione

**Variabili principali:**

```bash
# Backend API URL
BE_PATH=https://portaaljsbe-production.up.railway.app

# URL base dei microfrontend remoti
REMOTE_PATH=https://portaljs.nexadata.it

# Path di rilascio del modulo (specifico per ogni modulo)
RELEASE_PATH=nome-modulo/
RELEASE_ASSETS_PATH=/nome-modulo/assets/
```

> **Nota**: Le variabili d'ambiente possono essere sovrascritte tramite variabili di sistema (es. in Railway) grazie all'opzione `systemvars: true` in tutti i webpack config.

## Sviluppo

### Avviare tutti i moduli in modalità development

```bash
yarn dev
```

Questo comando avvia tutti i microfrontend contemporaneamente con hot reload. Ogni modulo sarà disponibile sulla propria porta:

- **portaal-fe-core**: http://localhost:3000
- **portaal-fe-common**: http://localhost:3001
- **portaal-fe-auth**: http://localhost:3002
- **portaal-fe-sales**: http://localhost:3008
- **portaal-fe-stock**: http://localhost:3012
- **portaal-fe-hr**: http://localhost:3010
- *... (vedi devServer.port nei vari webpack.config.js)*

### Avviare un singolo modulo

```bash
yarn dev:core    # Avvia solo il core
yarn dev:common  # Avvia solo il common
```

Oppure entrare direttamente nella directory del modulo:

```bash
cd portaal-fe-sales
yarn start
```

## Build

### Build di produzione

```bash
yarn build:prod
```

Questo comando:
1. Builda tutti i moduli in modalità production
2. Copia i bundle nella directory `dist/` con la struttura corretta
3. Genera sourcemap per debugging

### Preview locale del build

```bash
yarn preview
```

Builda il progetto e lo serve su http://localhost:3000 usando `serve`.

## Deploy

### Railway

Il progetto è configurato per il deploy automatico su Railway tramite il file `railway.json`.

#### Configurazione Railway

**Variabili d'ambiente da configurare su Railway:**

```bash
BE_PATH=https://portaaljsbe-production.up.railway.app
REMOTE_PATH=https://portaljs.nexadata.it
```

**Build automatico:**
- Railway esegue automaticamente `yarn railway:build` al push
- Watch automatico su modifiche a:
  - `portaal-fe-*/src/**`
  - `portaal-fe-*/webpack.config.js`
  - `portaal-fe-*/.env.production`
  - `scripts/**`
  - `package.json`

**Start command:**
```bash
HOST=0.0.0.0 npx serve dist -p $PORT -s
```

Railway assegna dinamicamente la porta tramite `$PORT` e mappa automaticamente 443 (HTTPS) → porta interna.

#### Deploy manuale

1. Push su branch `develop`:
   ```bash
   git push origin develop
   ```

2. Railway rileva automaticamente il nuovo commit e avvia il deploy

3. Verifica i log su Railway dashboard per confermare il successo

## Debug

Per informazioni dettagliate su come debuggare l'applicazione in tutte le modalità disponibili (dev mode, preview mode, VSCode breakpoints, ecc.), consulta la **[Guida al Debug](./DEBUGGING.md)**.

Modalità principali:
- **Dev Mode**: `yarn dev` - Hot reload, sviluppo rapido
- **Preview Mode**: `yarn preview` - Simula produzione locale, breakpoint VSCode funzionanti
- **Debug VSCode**: Configurazioni già pronte in `.vscode/launch.json`

## Script Disponibili

| Script | Descrizione |
|--------|-------------|
| `yarn install:all` | Installa dipendenze di tutti i moduli |
| `yarn dev` | Avvia tutti i moduli in development |
| `yarn dev:core` | Avvia solo il modulo core |
| `yarn dev:common` | Avvia solo il modulo common |
| `yarn build` | Build di tutti i moduli |
| `yarn build:prod` | Build + copia nella directory dist |
| `yarn preview` | Build + serve in locale |
| `yarn clean` | Pulisce i build artifacts |
| `yarn railway:build` | Build command usato da Railway |
| `yarn debug:browser` | Avvia debug browser inspection |

## Struttura Directory

```
portaal-fe-full/
├── portaal-fe-auth/           # Modulo autenticazione
├── portaal-fe-chatbot/        # Modulo chatbot
├── portaal-fe-common/         # Modulo condiviso
├── portaal-fe-core/           # Shell application
├── portaal-fe-hr/             # Modulo HR
├── portaal-fe-lookUps/        # Tabelle lookup
├── portaal-fe-notifications/  # Sistema notifiche
├── portaal-fe-personalarea/   # Area personale
├── portaal-fe-recruiting/     # Modulo recruiting
├── portaal-fe-reports/        # Reportistica
├── portaal-fe-sales/          # Modulo vendite
├── portaal-fe-stock/          # Gestione magazzino
├── scripts/                   # Script di build e utility
├── dist/                      # Output build produzione
├── package.json               # Workspace root config
└── railway.json               # Configurazione Railway
```

Ogni modulo contiene:
```
portaal-fe-<nome>/
├── src/                       # Codice sorgente
│   ├── App.tsx               # Entry point routes
│   ├── MfeInit.tsx           # Inizializzazione MFE
│   └── index.html            # Template HTML
├── webpack.config.js          # Configurazione Webpack
├── .env.development           # Env development
├── .env.production            # Env production
└── package.json               # Dipendenze modulo
```

## Module Federation

### Exposed Modules

Ogni microfrontend espone:
- `./Index` → `MfeInit.tsx` (inizializzazione)
- `./Routes` → `App.tsx` (routes del modulo)

### Remote References

I moduli referenziano `common` come remote:
```javascript
remotes: {
  common: "common@<REMOTE_PATH>/common/remoteEntry.js"
}
```

Il modulo `sales` referenzia anche `hr`:
```javascript
remotes: {
  common: "common@<REMOTE_PATH>/common/remoteEntry.js",
  hr: "hr@<REMOTE_PATH>/hr/remoteEntry.js"
}
```

### Shared Dependencies

React e React-DOM sono condivisi tra tutti i moduli con:
- `singleton: true` (evita duplicazioni)
- Version pinning per garantire compatibilità

## Tecnologie

- **React 18**
- **TypeScript**
- **Webpack 5** con Module Federation
- **React Router**
- **Babel**
- **PostCSS** + TailwindCSS
- **Playwright** (testing)

## Repository

- **Azure DevOps**: `taal@vs-ssh.visualstudio.com:v3/taal/Portaal.js/portaal-fe-full`
- **GitHub**: `git@github.com:MooMIrai/portaal-fe-full.git`

## Troubleshooting

### Errore "Cannot resolve remote"
- Verifica che `REMOTE_PATH` sia configurato correttamente
- Verifica che i moduli remoti siano già buildati e disponibili

### Errore di versione React
- Assicurati che tutti i moduli usino la stessa versione di React
- Controlla che `singleton: true` sia configurato per React

### Build fallisce
- Pulisci i build artifacts: `yarn clean`
- Reinstalla le dipendenze: `yarn install:all`
- Verifica che Node.js sia >= 18.0.0

### Railway deployment fallisce
- Verifica che le variabili d'ambiente siano configurate su Railway
- Controlla i log di build/runtime su Railway dashboard
- Verifica che `railway.json` sia committato

## License

Proprietary - Taal/NexaData
