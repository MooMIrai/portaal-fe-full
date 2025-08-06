# Dashboard Widget Editor - Documentazione Completa

## Indice
1. [Overview](#overview)
2. [Installazione e Setup](#installazione-e-setup)
3. [Architettura](#architettura)
4. [Componenti UI](#componenti-ui)
5. [API e Servizi](#api-e-servizi)
6. [Tipi di Widget](#tipi-di-widget)
7. [Guida Sviluppatori](#guida-sviluppatori)
8. [Troubleshooting](#troubleshooting)
9. [Roadmap](#roadmap)

---

## Overview

### Scopo
Il **Dashboard Widget Editor** è un microservizio Module Federation che fornisce un'interfaccia visuale completa per:
- Creare e configurare widget per dashboard
- Gestire template riutilizzabili
- Visualizzare anteprime in tempo reale
- Mappare sorgenti dati dinamicamente
- Esportare/importare configurazioni

### Caratteristiche Principali
- 🎨 **Editor Visuale**: Interfaccia drag-and-drop intuitiva
- 📊 **12 Tipi di Widget**: Grafici, metriche, tabelle, timeline
- 🔄 **Preview Live**: Anteprima in tempo reale con dati esempio/reali
- 📱 **Responsive**: Preview multi-dispositivo (desktop/tablet/mobile)
- 🎯 **Type-Safe**: Completo supporto TypeScript
- 🔌 **Module Federation**: Integrazione seamless con altri microservizi
- 🎨 **Temi Personalizzabili**: Supporto Kendo UI themes
- 💾 **Template System**: Salvataggio e riutilizzo configurazioni

### Stack Tecnologico
- **Frontend**: React 18, TypeScript 4.5+
- **UI Components**: Kendo React UI
- **Styling**: Tailwind CSS, SCSS modules
- **Build**: Webpack 5 con Module Federation
- **State Management**: React hooks e Context API
- **HTTP Client**: Axios
- **Date Handling**: date-fns

---

## Installazione e Setup

### Prerequisiti
- Node.js >= 16.x
- Yarn 1.22.x
- Accesso ai microservizi: `portaal-fe-common` e `portaal-fe-dashboard`

### Installazione

```bash
# Clona il repository
cd portaal-fe-full/portaal-fe-dashboard-editor

# Installa dipendenze
yarn install

# Crea file di ambiente (se non esistono)
cp .env.development.example .env.development
cp .env.production.example .env.production
```

### Configurazione Ambiente

#### .env.development
```env
REMOTE_PATH=http://localhost:3003
RELEASE_PATH=http://localhost:3022/
REACT_APP_API_URL=http://localhost:8080/api
```

#### .env.production
```env
REMOTE_PATH=/
RELEASE_PATH=/dashboardeditor/
REACT_APP_API_URL=/api
```

### Avvio del Servizio

```bash
# Sviluppo con hot reload
yarn start

# Build sviluppo
yarn build:dev

# Build produzione
yarn build

# Avvio senza watch
yarn start:no-watch
```

Il servizio sarà disponibile su: **http://localhost:3022**

### Integrazione con Core

Il microservizio è già configurato in `portaal-fe-core`. Per abilitarlo:

1. Assicurarsi che `dashboardeditor` sia incluso in `ENABLED_MFES` (se utilizzato)
2. Verificare che il servizio sia in esecuzione sulla porta 3022
3. Il menu "Dashboard Editor" apparirà automaticamente per utenti con permesso `EDIT_DASHBOARDS`

---

## Architettura

### Struttura delle Cartelle

```
portaal-fe-dashboard-editor/
├── src/
│   ├── components/           # Componenti React riutilizzabili
│   │   ├── WidgetTypeSelector/    # Selezione tipo widget
│   │   ├── WidgetConfigurator/   # Configurazione widget
│   │   ├── WidgetPreview/        # Anteprima widget
│   │   ├── DataSourceMapper/     # Mapping sorgenti dati
│   │   ├── LayoutManager/        # Gestione layout (future)
│   │   └── TemplateLibrary/      # Libreria template (future)
│   ├── pages/               # Pagine principali
│   │   ├── EditorPage/          # Editor principale
│   │   ├── TemplatesPage/       # Gestione template
│   │   └── PreviewPage/         # Preview fullscreen
│   ├── services/            # Servizi API
│   │   ├── widgetService.ts     # CRUD widget
│   │   ├── dashboardService.ts  # Gestione dashboard
│   │   └── templateService.ts   # Template management
│   ├── types/               # TypeScript definitions
│   │   ├── widget.types.ts      # Tipi widget
│   │   ├── config.types.ts      # Configurazioni
│   │   └── api.types.ts         # Tipi API
│   ├── utils/               # Utility functions
│   │   ├── widgetHelpers.ts     # Helper widget
│   │   └── sampleDataGenerator.ts # Generatore dati esempio
│   ├── App.tsx              # Componente root con routes
│   ├── MfeInit.ts          # Configurazione Module Federation
│   ├── bootstrap.tsx       # Bootstrap dell'applicazione
│   └── constants.ts        # Costanti globali
├── webpack.config.js       # Configurazione Webpack
├── package.json           # Dipendenze e scripts
└── tsconfig.json          # Configurazione TypeScript
```

### Module Federation Configuration

```javascript
// webpack.config.js - Configurazione chiave
{
  name: "dashboardeditor",
  filename: "remoteEntry.js",
  remotes: {
    common: "common@.../remoteEntry.js",
    dashboard: "dashboard@.../remoteEntry.js"
  },
  exposes: {
    "./Index": "./src/MfeInit",
    "./Routes": "./src/App",
    "./WidgetEditor": "./src/components/WidgetConfigurator/component"
  }
}
```

### Flusso dei Dati

```
User Input → EditorPage → WidgetConfigurator → State Update
                ↓                                    ↓
          WidgetPreview ← Data Generation ← Widget Config
                ↓
          API Service → Backend → Database
```

### Integration Points

1. **Con portaal-fe-common**:
   - Componenti UI condivisi (Button, Form, Table, Modal, etc.)
   - Servizi di autenticazione
   - Theme provider

2. **Con portaal-fe-dashboard**:
   - Import componenti widget per preview
   - Condivisione tipi TypeScript
   - API endpoints comuni

3. **Con Backend API**:
   - RESTful endpoints per CRUD operations
   - Structured widget data format
   - Real-time data fetching

---

## Componenti UI

### WidgetTypeSelector

Componente per la selezione visuale del tipo di widget.

```typescript
interface WidgetTypeSelectorProps {
  onSelect: (type: WidgetType) => void;
  selectedType?: WidgetType;
}
```

**Funzionalità**:
- Grid di cards con icone per ogni tipo di widget
- Filtri per categoria (Charts, Metrics, Tables, Timeline)
- Ricerca testuale
- Highlighting del widget selezionato

**Utilizzo**:
```tsx
<WidgetTypeSelector 
  onSelect={(type) => handleWidgetTypeSelect(type)}
  selectedType={currentType}
/>
```

### WidgetConfigurator

Configuratore principale con tabs per diverse sezioni di configurazione.

```typescript
interface WidgetConfiguratorProps {
  widgetType: WidgetType;
  initialConfig: Partial<WidgetConfig>;
  onChange: (config: Partial<WidgetConfig>) => void;
  onDataSourceChange?: (dataSource: DataSourceConfig) => void;
  onDataMappingChange?: (mapping: DataMapping[]) => void;
}
```

**Tabs disponibili**:
1. **Generale**: Titolo, descrizione, refresh interval
2. **Configurazione**: Opzioni specifiche per tipo widget
3. **Dati**: Configurazione sorgente dati e mapping
4. **Stile**: Colori, fonts, layout
5. **Avanzate**: JSON editor, opzioni avanzate

**Form Fields Dinamici**:
Il componente genera automaticamente i campi del form basandosi sul tipo di widget selezionato.

### WidgetPreview

Anteprima del widget con supporto per dati esempio e reali.

```typescript
interface WidgetPreviewProps {
  widgetType: WidgetType;
  config: Partial<WidgetConfig>;
  dataSource?: DataSourceConfig;
  isLivePreview?: boolean;
  fullSize?: boolean;
}
```

**Modalità**:
- **Live Preview**: Anteprima inline durante la configurazione
- **Full Preview**: Anteprima a schermo intero
- **Sample Data**: Dati di esempio generati automaticamente
- **Real Data**: Dati reali da API

### DataSourceMapper

Componente per mappare i campi della sorgente dati ai campi richiesti dal widget.

```typescript
interface DataSourceMapperProps {
  widgetType: WidgetType;
  onDataSourceChange: (dataSource: DataSourceConfig) => void;
  onMappingChange?: (mapping: DataMapping[]) => void;
}
```

**Funzionalità**:
- Configurazione endpoint API
- Test connessione con feedback visuale
- Mapping drag-and-drop dei campi
- Gestione parametri dinamici
- Trasformazioni dati (date, numeri, etc.)

---

## API e Servizi

### Widget Service

```typescript
// Esempio di utilizzo
import { widgetService } from '@/services/widgetService';

// Creare un widget
const newWidget = await widgetService.createWidget({
  name: 'Sales Dashboard KPI',
  widgetType: 'kpi',
  config: {
    title: 'Monthly Sales',
    valueField: 'totalSales',
    format: '€ {0:n0}'
  }
});

// Ottenere dati strutturati
const widgetData = await widgetService.generateWidgetData(
  reportId, 
  {
    date_from: '2024-01-01',
    date_to: '2024-12-31'
  }
);
```

### Endpoints Principali

#### Widget CRUD
- `GET /api/v1/structured-widget` - Lista widget
- `GET /api/v1/structured-widget/:id` - Dettaglio widget
- `POST /api/v1/structured-widget` - Crea widget
- `PUT /api/v1/structured-widget/:id` - Aggiorna widget
- `DELETE /api/v1/structured-widget/:id` - Elimina widget

#### Widget Data
- `POST /api/v1/structured-widget/:id/structured` - Genera dati strutturati
- `POST /api/v1/structured-widget/test-connection` - Test connessione

#### Templates
- `GET /api/v1/widget-templates` - Lista template
- `POST /api/v1/widget-templates` - Crea template
- `POST /api/v1/widget-templates/:id/duplicate` - Duplica template

### Formato Dati Strutturati

```typescript
interface WidgetData {
  widgetType: string;
  data: any[];
  config: WidgetConfig;
  computed?: {
    categories?: string[];
    dateRange?: { min: string; max: string };
    totals?: Record<string, number>;
  };
  metadata?: {
    lastUpdated: string;
    dataSource: string;
    filters?: Record<string, any>;
  };
}
```

---

## Tipi di Widget

### 1. Gantt Chart
**Uso**: Timeline progetti, pianificazione attività

```typescript
{
  widgetType: 'gantt',
  config: {
    categoryField: 'projectName',
    fromField: 'startDate',
    toField: 'endDate',
    dateFormat: 'MMM yyyy',
    baseUnit: 'months'
  }
}
```

### 2. Pie Chart
**Uso**: Distribuzione percentuale, quote

```typescript
{
  widgetType: 'pie',
  config: {
    categoryField: 'department',
    valueField: 'budget',
    showLabels: true,
    showLegend: true,
    legendPosition: 'bottom'
  }
}
```

### 3. Bar Chart
**Uso**: Confronti tra categorie

```typescript
{
  widgetType: 'bar',
  config: {
    categoryField: 'month',
    valueField: ['sales2023', 'sales2024'],
    orientation: 'vertical',
    stacked: false
  }
}
```

### 4. Line Chart
**Uso**: Trend temporali, andamenti

```typescript
{
  widgetType: 'line',
  config: {
    categoryField: 'date',
    valueField: ['visitors', 'conversions'],
    smooth: true,
    markers: true
  }
}
```

### 5. KPI Card
**Uso**: Metriche chiave con trend

```typescript
{
  widgetType: 'kpi',
  config: {
    valueField: 'currentValue',
    format: '€ {0:n0}',
    trend: {
      field: 'previousValue',
      positiveColor: '#27ae60',
      negativeColor: '#e74c3c'
    }
  }
}
```

### 6. Table
**Uso**: Dati dettagliati, report

```typescript
{
  widgetType: 'table',
  config: {
    columns: [
      { field: 'name', title: 'Nome', sortable: true },
      { field: 'value', title: 'Valore', format: '{0:n0}' }
    ],
    pageSize: 20,
    filterable: true
  }
}
```

[Altri widget: Area, Gauge, Donut, Scatter, Heatmap, Timeline - con configurazioni simili]

---

## Guida Sviluppatori

### Aggiungere un Nuovo Tipo di Widget

1. **Definire il tipo in constants.ts**:
```typescript
export const WIDGET_TYPES = {
  // ... existing types
  NEW_WIDGET: 'newWidget'
} as const;

export const WIDGET_INFO = {
  [WIDGET_TYPES.NEW_WIDGET]: {
    name: 'New Widget',
    description: 'Description',
    category: WIDGET_CATEGORIES.CHARTS,
    icon: 'newWidgetIcon',
    requiredFields: ['field1', 'field2']
  }
};
```

2. **Aggiungere TypeScript types**:
```typescript
// In widget.types.ts
export interface NewWidgetConfig extends BaseWidgetConfig {
  field1: string;
  field2: string;
  // ... other fields
}
```

3. **Configurare i form fields**:
```typescript
// In widgetHelpers.ts
case 'newWidget':
  return {
    general: [
      {
        name: 'field1',
        label: 'Field 1',
        type: 'text',
        required: true
      }
      // ... other fields
    ]
  };
```

4. **Aggiungere generatore dati esempio**:
```typescript
// In sampleDataGenerator.ts
case 'newWidget':
  return [
    // ... sample data
  ];
```

### Best Practices

1. **Type Safety**:
   - Sempre definire interfacce TypeScript
   - Utilizzare union types per valori limitati
   - Validare input utente

2. **Performance**:
   - Utilizzare React.memo per componenti pesanti
   - Implementare lazy loading per widget complessi
   - Debounce input frequenti

3. **Error Handling**:
   ```typescript
   try {
     const data = await widgetService.generateWidgetData(id, params);
     setWidgetData(data);
   } catch (error) {
     console.error('Widget data error:', error);
     showNotification({ type: 'error', message: 'Errore caricamento dati' });
   }
   ```

4. **Testing**:
   ```typescript
   // Esempio test componente
   describe('WidgetTypeSelector', () => {
     it('should call onSelect when widget is clicked', () => {
       const onSelect = jest.fn();
       const { getByText } = render(
         <WidgetTypeSelector onSelect={onSelect} />
       );
       fireEvent.click(getByText('Gantt Chart'));
       expect(onSelect).toHaveBeenCalledWith('gantt');
     });
   });
   ```

### Estendere Funzionalità

#### Custom Widget Renderer
```typescript
// Creare un custom renderer
const CustomWidgetRenderer: React.FC<WidgetProps> = ({ data, config }) => {
  return (
    <div className="custom-widget">
      {/* Custom implementation */}
    </div>
  );
};

// Registrare nel WidgetPreview
const widgetRenderers = {
  custom: CustomWidgetRenderer
};
```

#### Custom Data Transformer
```typescript
// Trasformatore dati personalizzato
const transformCustomData = (rawData: any[]): TransformedData[] => {
  return rawData.map(item => ({
    ...item,
    // Custom transformations
    formattedDate: format(new Date(item.date), 'dd/MM/yyyy')
  }));
};
```

---

## Troubleshooting

### Problemi Comuni

#### 1. Widget non si carica
**Sintomo**: Schermata bianca o errore di caricamento

**Soluzioni**:
- Verificare che tutti i microservizi siano in esecuzione
- Controllare la console per errori Module Federation
- Verificare CORS settings se in sviluppo

#### 2. Dati non visualizzati
**Sintomo**: Widget vuoto nonostante configurazione corretta

**Soluzioni**:
- Verificare mapping campi in DataSourceMapper
- Controllare formato date (devono essere ISO 8601)
- Verificare permessi API

#### 3. Preview non aggiornata
**Sintomo**: Modifiche non riflesse nell'anteprima

**Soluzioni**:
- Verificare che onChange sia chiamato correttamente
- Controllare che state sia aggiornato
- Forzare re-render con key prop

### Debug Tips

1. **Abilitare logging dettagliato**:
```typescript
// In development
if (process.env.NODE_ENV === 'development') {
  console.log('Widget config:', config);
  console.log('Widget data:', data);
}
```

2. **Redux DevTools** (se implementato):
```typescript
const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
```

3. **Network debugging**:
- Utilizzare tab Network in Chrome DevTools
- Verificare headers e payload
- Controllare response status e body

### FAQ

**Q: Come posso testare un widget senza backend?**
A: Utilizza il pulsante "Dati esempio" nel preview, che genera automaticamente dati di test appropriati per ogni tipo di widget.

**Q: Posso importare configurazioni da altri progetti?**
A: Sì, utilizza la funzione export/import nella pagina Templates.

**Q: Come gestisco widget con molti dati?**
A: Implementa paginazione lato server e utilizza il campo `pageSize` nella configurazione.

---

## Roadmap

### Versione 1.1 (Q2 2024)
- [ ] Drag & drop per riordinare widget nel layout
- [ ] Supporto per widget compositi (dashboard in dashboard)
- [ ] Export PDF delle dashboard
- [ ] Temi custom per singoli widget

### Versione 1.2 (Q3 2024)
- [ ] Real-time collaboration
- [ ] Versioning delle configurazioni
- [ ] A/B testing per widget
- [ ] Machine learning per suggerimenti configurazione

### Versione 2.0 (Q4 2024)
- [ ] Widget marketplace
- [ ] Custom widget SDK
- [ ] Mobile app dedicata
- [ ] Integration con BI tools esterni

### Miglioramenti Continui
- Performance optimization
- Accessibilità WCAG 2.1 AA
- Internazionalizzazione completa
- Documentazione interattiva

---

## Contatti e Supporto

- **Team Development**: dashboard-team@company.com
- **Issues**: GitHub Issues nel repository
- **Documentazione API**: [Link to API docs]
- **Slack Channel**: #dashboard-widget-editor

## Licenza

Questo progetto è proprietario di Taal srl. Tutti i diritti riservati.

---

*Ultimo aggiornamento: Gennaio 2024*