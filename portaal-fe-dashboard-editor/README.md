# Dashboard Widget Editor

Dashboard Widget Editor è un'applicazione microfrontend per la creazione e configurazione di widget dashboard, integrata tramite Webpack Module Federation.

## 🚀 Caratteristiche principali

- **Editor visuale di widget** con configurazione in tempo reale
- **Supporto per vari tipi di widget**: Gantt, grafici (pie, bar, line, area), tabelle, KPI, gauge
- **Sistema di template** per salvare e riutilizzare configurazioni
- **Modalità preview** con supporto per diverse dimensioni schermo
- **Integrazione Module Federation** per uso come microfrontend

## 📋 Prerequisiti

- Node.js >= 16
- npm >= 8
- Applicazione host con Module Federation configurato

## 🛠️ Installazione

```bash
# Clona il repository
git clone [repository-url]

# Installa le dipendenze
npm install
```

## 🏃‍♂️ Sviluppo

```bash
# Avvia il server di sviluppo (porta 3022)
npm run start

# Build per produzione
npm run build

# Analizza il bundle
npm run analyze
```

## 🏗️ Architettura

### Struttura del progetto

```
src/
├── components/          # Componenti riutilizzabili
│   ├── Help/           # Sistema di help (disabilitato in MFE)
│   ├── WidgetConfigurator/  # Configuratore widget
│   ├── WidgetPreview/      # Preview widget
│   └── WidgetTypeSelector/ # Selettore tipo widget
├── pages/              # Pagine principali
│   ├── EditorPage/     # Editor principale (non usato in MFE)
│   ├── TemplatesPage/  # Gestione template
│   └── PreviewPage/    # Preview a schermo intero
├── types/              # TypeScript types
├── utils/              # Utility functions
├── MfeInit.ts          # Inizializzazione Module Federation
└── VisibleRoutes.tsx   # Route esposte per MFE
```

### Module Federation

L'applicazione espone i seguenti moduli:

```javascript
exposes: {
  "./Index": "./src/MfeInit",           // Menu items
  "./Routes": "./src/VisibleRoutes",    // Route per l'app host
  "./WidgetEditor": "./src/components/WidgetConfigurator/component",
  "./WidgetTypeSelector": "./src/components/WidgetTypeSelector/component",
  "./WidgetPreview": "./src/components/WidgetPreview/component",
}
```

## 🎯 Utilizzo

### Come microfrontend

L'applicazione si integra automaticamente con l'host tramite Module Federation:

1. **Menu Navigation**: Il menu "Dashboard Editor" espone solo sottomenu:
   - Widget Templates (`/dashboard-editor/templates`)
   - Preview Mode (`/dashboard-editor/preview`)

2. **Route disponibili**:
   - `/dashboard-editor/templates` - Gestione template widget
   - `/dashboard-editor/preview` - Preview widget salvati

### Standalone (sviluppo)

In modalità standalone, l'applicazione include anche la pagina EditorPage alla route principale `/`.

## 🎨 Tipi di Widget supportati

- **Gantt**: Timeline progetti e attività
- **Pie Chart**: Grafici a torta
- **Bar Chart**: Grafici a barre
- **Line Chart**: Grafici a linee
- **Area Chart**: Grafici ad area
- **Table**: Tabelle dati
- **KPI**: Indicatori chiave di performance
- **Gauge**: Indicatori circolari

## 🔧 Configurazione

### Environment Variables

```bash
# .env.development
RELEASE_PATH=auto
REMOTE_PATH=http://localhost:3003

# .env.production
RELEASE_PATH=/dashboard-editor/
REMOTE_PATH=https://your-domain.com
```

### Webpack Configuration

Il file `webpack.config.js` gestisce:
- Module Federation setup
- SCSS/Sass compilation
- TypeScript transpilation
- Development server (porta 3022)

## 🐛 Risoluzione problemi comuni

### Errori di import da 'common'
I componenti del modulo 'common' sono forniti dall'applicazione host. In sviluppo standalone, alcuni componenti potrebbero non essere disponibili.

### Help System
Il sistema di help è disabilitato in modalità microfrontend per evitare conflitti con l'applicazione host.

### Routing
Le route sono gestite dall'applicazione host. Il menu principale "Dashboard Editor" non naviga ma espande solo i sottomenu.

## 📝 Note per lo sviluppo

Per modifiche future al progetto, si consiglia di utilizzare il sistema di selezione agenti di Claude come descritto in `CLAUDE.md`.

## 📄 Licenza

[Inserire informazioni sulla licenza]