# Guida Completa Implementazione portaal-fe-reporteditor

## Indice
1. [Panoramica](#panoramica)
2. [Architettura del Sistema](#architettura-del-sistema)
3. [Setup Iniziale](#setup-iniziale)
4. [Configurazione Webpack e Module Federation](#configurazione-webpack)
5. [Integrazione con Core](#integrazione-con-core)
6. [Struttura delle Directory](#struttura-directory)
7. [Implementazione Componenti](#implementazione-componenti)
8. [API e Servizi](#api-e-servizi)
9. [Routing e Navigazione](#routing-e-navigazione)
10. [Sicurezza](#sicurezza)
11. [Testing](#testing)
12. [Build e Deployment](#build-e-deployment)
13. [Checklist Completa](#checklist-completa)

## 1. Panoramica

Il microservizio `portaal-fe-reporteditor` è un editor avanzato per la creazione e gestione di query SQL e report all'interno dell'ecosistema Portaal. Utilizza l'architettura Module Federation per integrarsi come microfrontend nell'applicazione principale.

### Caratteristiche Principali:
- Editor SQL avanzato con Monaco Editor
- Sistema di parametri dinamici
- Preview in tempo reale dei risultati
- Template predefiniti
- Export in vari formati (Excel, PDF, CSV)
- Integrazione con dashboard widgets

### Stack Tecnologico:
- React 18.3 con TypeScript
- Webpack 5 con Module Federation
- KendoReact per UI components
- Monaco Editor per editing SQL
- Tailwind CSS per styling
- Axios per chiamate API

## 2. Architettura del Sistema

### 2.1 Module Federation Setup
```
portaal-fe-core (HOST - porta 3000)
    ├── portaal-fe-common (porta 3003) - sempre caricato
    ├── portaal-fe-auth (porta 3006) - sempre caricato
    └── portaal-fe-reporteditor (porta 3021) - nuovo microservizio
```

### 2.2 Comunicazione tra Microservizi
- Il core carica dinamicamente reporteditor tramite Module Federation
- Condivisione di dipendenze comuni (React, React-DOM, etc.)
- Utilizzo di servizi comuni da portaal-fe-common

## 3. Setup Iniziale

### 3.1 Creazione Directory Base
```bash
# Dalla root del progetto
cd /home/mverde/src/taal/portaal-fe-full

# Copia la struttura dal dashboard come base
cp -r portaal-fe-dashboard portaal-fe-reporteditor

# Entra nella nuova directory
cd portaal-fe-reporteditor
```

### 3.2 Pulizia File Non Necessari
```bash
# Rimuovi componenti specifici del dashboard
rm -rf src/components/widgets/
rm -rf src/components/dashboard/
rm -rf src/services/api/dashboardApi.ts
rm -rf src/contexts/DashboardContext.tsx
rm -rf src/types/dashboard.types.ts
rm -rf src/types/widget.types.ts
```

### 3.3 Configurazione package.json
```json
{
  "name": "portaal-mfe-reporteditor",
  "version": "1.0.0",
  "scripts": {
    "build": "webpack --mode production",
    "build:dev": "webpack --mode development",
    "build:start": "cd dist && PORT=3021 npx serve",
    "start": "webpack serve --mode development",
    "start:live": "webpack serve --open --mode development --live-reload --hot",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  },
  "dependencies": {
    // Dipendenze esistenti dal dashboard...
    "@monaco-editor/react": "^4.6.0",
    "monaco-editor": "^0.45.0",
    "react-hook-form": "^7.50.0",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.4",
    "react-query": "^3.39.3",
    "@tanstack/react-query": "^5.20.0",
    "zustand": "^4.5.0"
  }
}
```

### 3.4 Installazione Dipendenze
```bash
# Installa tutte le dipendenze
yarn install

# Oppure con npm
npm install
```

## 4. Configurazione Webpack e Module Federation

### 4.1 webpack.config.js
```javascript
const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const Dotenv = require("dotenv-webpack");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const deps = require("./package.json").dependencies;
const webpack = require("webpack");

const mfeConfig = (path, mode) => ({
  name: "reporteditor",
  filename: "remoteEntry.js",
  remotes: {
    common:
      "common@" +
      path +
      (mode === "production" ? "/common" : "") +
      "/remoteEntry.js",
  },
  exposes: {
    "./Index": "./src/MfeInit",
    "./Routes": "./src/App",
  },
  shared: {
    ...deps,
    common: {
      singleton: true,
    },
    react: {
      singleton: true,
      requiredVersion: deps.react,
    },
    "react-dom": {
      singleton: true,
      requiredVersion: deps["react-dom"],
    },
    "monaco-editor": {
      singleton: true,
      requiredVersion: deps["monaco-editor"],
    },
  },
});

module.exports = (_, argv) => {
  const dotenvPath = argv.mode === 'development' ? './.env.development' : './.env';
  require("dotenv").config({ path: dotenvPath });
  return {
    devtool: "source-map",
    output: {
      publicPath: process.env.RELEASE_PATH,
      clean: true,
    },
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", ".json", ".mjs"],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      }
    },
    devServer: {
      port: 3021,
      historyApiFallback: true,
    },
    module: {
      rules: [
        {
          test: /\.m?js/,
          type: "javascript/auto",
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.(css|s[ac]ss)$/i,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.ttf$/,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin(mfeConfig(process.env.REMOTE_PATH, argv.mode)),
      new HtmlWebPackPlugin({
        template: "./src/index.html",
      }),
      new Dotenv({ path: dotenvPath }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(argv.mode),
      }),
    ],
  };
};
```

### 4.2 File Environment (.env.development)
```env
RELEASE_PATH=http://localhost:3021/
REMOTE_PATH=http://localhost:3003
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_ENVIRONMENT=development
```

### 4.3 File Environment (.env)
```env
RELEASE_PATH=/reporteditor/
REMOTE_PATH=
REACT_APP_API_URL=/api
REACT_APP_ENVIRONMENT=production
```

## 5. Integrazione con Core

### 5.1 Aggiornamento webpack.config.js del Core

Nel file `/home/mverde/src/taal/portaal-fe-full/portaal-fe-core/webpack.config.js`:

```javascript
// Aggiungi reporteditor alla lista dei remotes
const mfeConfig = (path, mode) => {
  let allRemotes = {
    common: "common@http://localhost:3003/remoteEntry.js",
    auth: "auth@http://localhost:3006/remoteEntry.js",
    lookups: "lookups@http://localhost:3005/remoteEntry.js",
    sales: "sales@http://localhost:3008/remoteEntry.js",
    hr: "hr@http://localhost:3009/remoteEntry.js",
    recruiting: "recruiting@http://localhost:3011/remoteEntry.js",
    stock:"stock@http://localhost:3012/remoteEntry.js",
    notification:"notification@http://localhost:3013/remoteEntry.js",
    reports:"reports@http://localhost:3015/remoteEntry.js",
    dashboard:"dashboard@http://localhost:3020/remoteEntry.js",
    chatbot:"chatbot@http://localhost:3018/remoteEntry.js",
    reporteditor:"reporteditor@http://localhost:3021/remoteEntry.js", // NUOVO
  };
  
  if (mode === "production") {
    allRemotes = {
      // ... altri remotes ...
      reporteditor:"reporteditor@reporteditor/remoteEntry.js", // NUOVO
    };
  }
  // ... resto del codice ...
}
```

### 5.2 Aggiornamento MICROSERVICES_LIST.md

Aggiungi la nuova entry:
```markdown
| **portaal-fe-reporteditor** | `/home/mverde/src/taal/portaal-fe-full/portaal-fe-reporteditor` | `3021` | http://localhost:3021 | `reporteditor` | Query Report Editor |
```

### 5.3 Aggiornamento SELECTIVE_MICROSERVICES_LOADING.md

Aggiungi `reporteditor` alla lista dei microservizi selezionabili:
```markdown
- `reporteditor` - Query Report Editor
```

### 5.4 Abilitazione del Microservizio tramite ENABLED_MFES

Per abilitare il nuovo microservizio, devi aggiornare la variabile `ENABLED_MFES` nel file `.env.development` del core:

```env
# In portaal-fe-core/.env.development

# Per abilitare solo alcuni microservizi incluso reporteditor:
ENABLED_MFES=sales,dashboard,reporteditor

# Oppure lascia vuoto per abilitare tutti (reporteditor sarà incluso automaticamente dopo l'aggiunta al webpack.config.js)
ENABLED_MFES=
```

**IMPORTANTE**: Dopo aver modificato `ENABLED_MFES`, devi riavviare il core per applicare le modifiche.

## 6. Struttura delle Directory

```
portaal-fe-reporteditor/
├── src/
│   ├── index.html
│   ├── index.js
│   ├── bootstrap.js
│   ├── App.tsx
│   ├── MfeInit.ts
│   ├── components/
│   │   ├── common/
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── ConfirmDialog.tsx
│   │   ├── editor/
│   │   │   ├── SqlEditor.tsx
│   │   │   ├── SqlEditorToolbar.tsx
│   │   │   └── SqlAutoComplete.tsx
│   │   ├── parameters/
│   │   │   ├── ParameterBuilder.tsx
│   │   │   ├── ParameterForm.tsx
│   │   │   ├── ParameterList.tsx
│   │   │   └── ParameterTypes/
│   │   │       ├── StringParameter.tsx
│   │   │       ├── NumberParameter.tsx
│   │   │       ├── DateParameter.tsx
│   │   │       ├── BooleanParameter.tsx
│   │   │       └── ListParameter.tsx
│   │   ├── preview/
│   │   │   ├── QueryPreview.tsx
│   │   │   ├── ResultGrid.tsx
│   │   │   └── ExportButtons.tsx
│   │   └── templates/
│   │       ├── TemplateGallery.tsx
│   │       ├── TemplateCard.tsx
│   │       └── TemplateImportExport.tsx
│   ├── pages/
│   │   ├── QueryList/
│   │   │   ├── index.tsx
│   │   │   └── QueryListTable.tsx
│   │   ├── QueryEditor/
│   │   │   ├── index.tsx
│   │   │   ├── QueryEditorLayout.tsx
│   │   │   └── QueryEditorSidebar.tsx
│   │   └── TemplateManager/
│   │       └── index.tsx
│   ├── services/
│   │   ├── api/
│   │   │   ├── reportEditorApi.ts
│   │   │   ├── queryApi.ts
│   │   │   └── templateApi.ts
│   │   └── validators/
│   │       ├── sqlValidator.ts
│   │       └── parameterValidator.ts
│   ├── contexts/
│   │   ├── ReportEditorContext.tsx
│   │   └── QueryContext.tsx
│   ├── hooks/
│   │   ├── useQuery.ts
│   │   ├── useQueryExecution.ts
│   │   └── useTemplates.ts
│   ├── types/
│   │   ├── query.types.ts
│   │   ├── parameter.types.ts
│   │   └── template.types.ts
│   ├── utils/
│   │   ├── sqlParser.ts
│   │   ├── parameterExtractor.ts
│   │   └── exportHelpers.ts
│   └── styles/
│       ├── index.css
│       └── editor.css
├── public/
│   └── (assets statici)
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.development
├── .env
├── package.json
├── webpack.config.js
├── babel.config.js
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 7. Implementazione Componenti

### 7.1 MfeInit.ts
```typescript
export default function() {
  return {
    menuItems: [
      {
        id: 17,
        text: 'Report Editor',
        level: 0,
        route: '/reporteditor',
        iconKey: 'reportEditorIcon',
        permissions: ['REPORT_EDITOR_VIEW']
      }
    ]
  }
}
```

### 7.2 App.tsx
```typescript
import React from "react";
import Routes from 'common/Routes';
import { QueryList } from "./pages/QueryList";
import { QueryEditor } from "./pages/QueryEditor";
import { TemplateManager } from "./pages/TemplateManager";

const App = () => {
  return (
    <Routes data={[
      {
        path: "/reporteditor",
        element: <QueryList />,
        permissions: ['REPORT_EDITOR_VIEW']
      },
      {
        path: "/reporteditor/new",
        element: <QueryEditor />,
        permissions: ['REPORT_EDITOR_CREATE']
      },
      {
        path: "/reporteditor/edit/:id",
        element: <QueryEditor />,
        permissions: ['REPORT_EDITOR_EDIT']
      },
      {
        path: "/reporteditor/templates",
        element: <TemplateManager />,
        permissions: ['REPORT_EDITOR_VIEW']
      }
    ]}/>
  );
};

export default App;
```

### 7.3 Types Definition (types/query.types.ts)
```typescript
export interface Query {
  id: number;
  name: string;
  description?: string;
  sql: string;
  parameters: QueryParameter[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  category?: string;
  tags?: string[];
  isTemplate: boolean;
  permissions?: string[];
}

export interface QueryParameter {
  id: string;
  name: string;
  label: string;
  type: ParameterType;
  required: boolean;
  defaultValue?: any;
  validation?: ParameterValidation;
  dependsOn?: string;
  options?: ParameterOption[];
}

export enum ParameterType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  DATETIME = 'DATETIME',
  BOOLEAN = 'BOOLEAN',
  STATIC_LIST = 'STATIC_LIST',
  DYNAMIC_LIST = 'DYNAMIC_LIST'
}

export interface ParameterValidation {
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
}

export interface ParameterOption {
  value: string | number;
  label: string;
}

export interface QueryExecutionRequest {
  queryId: number;
  parameters: Record<string, any>;
  limit?: number;
  offset?: number;
}

export interface QueryExecutionResult {
  data: any[];
  columns: ColumnDefinition[];
  rowCount: number;
  executionTime: number;
  error?: string;
}

export interface ColumnDefinition {
  field: string;
  title: string;
  type: string;
  width?: number;
}
```

### 7.4 SQL Editor Component (components/editor/SqlEditor.tsx)
```typescript
import React, { useRef, useCallback } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';

interface SqlEditorProps {
  value: string;
  onChange: (value: string) => void;
  onValidate?: (markers: any[]) => void;
  height?: string;
  readOnly?: boolean;
  theme?: 'light' | 'dark';
}

export const SqlEditor: React.FC<SqlEditorProps> = ({
  value,
  onChange,
  onValidate,
  height = '400px',
  readOnly = false,
  theme = 'light'
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const handleEditorWillMount = (monaco: Monaco) => {
    // Registra autocompletamento SQL personalizzato
    monaco.languages.registerCompletionItemProvider('sql', {
      provideCompletionItems: (model, position) => {
        const suggestions = [
          // Keywords SQL
          ...['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 
              'INNER JOIN', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 
              'OFFSET', 'AS', 'ON', 'AND', 'OR', 'NOT', 'IN', 'EXISTS',
              'BETWEEN', 'LIKE', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MAX', 'MIN']
            .map(keyword => ({
              label: keyword,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: keyword,
            })),
          // Funzioni comuni
          ...['COALESCE', 'CAST', 'CONVERT', 'DATE_FORMAT', 'NOW', 'CURDATE']
            .map(func => ({
              label: func,
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: func + '($1)',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            })),
        ];
        
        return { suggestions };
      }
    });

    // Configurazione tema SQL
    monaco.editor.defineTheme('sql-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'keyword.sql', foreground: '0000FF' },
        { token: 'string.sql', foreground: 'A31515' },
        { token: 'comment.sql', foreground: '008000' },
      ],
      colors: {}
    });
  };

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Configura validazione SQL
    editor.onDidChangeModelDecorations(() => {
      const model = editor.getModel();
      if (model && onValidate) {
        const markers = monaco.editor.getModelMarkers({ resource: model.uri });
        onValidate(markers);
      }
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <Editor
        height={height}
        defaultLanguage="sql"
        theme={theme === 'dark' ? 'vs-dark' : 'sql-light'}
        value={value}
        onChange={handleEditorChange}
        beforeMount={handleEditorWillMount}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          readOnly,
          automaticLayout: true,
          formatOnPaste: true,
          formatOnType: true,
          suggestOnTriggerCharacters: true,
          wordWrap: 'on',
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
};
```

### 7.5 Parameter Builder Component (components/parameters/ParameterBuilder.tsx)
```typescript
import React, { useState } from 'react';
import { 
  Form, 
  FormField, 
  FormInput, 
  FormDropDownList,
  FormCheckbox,
  FormDatePicker 
} from '@progress/kendo-react-form';
import { Button } from '@progress/kendo-react-buttons';
import { Card, CardHeader, CardBody } from '@progress/kendo-react-layout';
import { QueryParameter, ParameterType } from '../../types/query.types';

interface ParameterBuilderProps {
  parameters: QueryParameter[];
  onParametersChange: (parameters: QueryParameter[]) => void;
  sqlQuery: string;
}

export const ParameterBuilder: React.FC<ParameterBuilderProps> = ({
  parameters,
  onParametersChange,
  sqlQuery
}) => {
  const [selectedParameter, setSelectedParameter] = useState<QueryParameter | null>(null);

  const extractParametersFromSQL = (sql: string): string[] => {
    const paramRegex = /:(\w+)/g;
    const matches = sql.matchAll(paramRegex);
    return Array.from(matches, m => m[1]);
  };

  const addParameter = () => {
    const newParam: QueryParameter = {
      id: `param_${Date.now()}`,
      name: '',
      label: '',
      type: ParameterType.STRING,
      required: false,
    };
    onParametersChange([...parameters, newParam]);
    setSelectedParameter(newParam);
  };

  const updateParameter = (id: string, updates: Partial<QueryParameter>) => {
    onParametersChange(
      parameters.map(p => p.id === id ? { ...p, ...updates } : p)
    );
  };

  const deleteParameter = (id: string) => {
    onParametersChange(parameters.filter(p => p.id !== id));
    if (selectedParameter?.id === id) {
      setSelectedParameter(null);
    }
  };

  const autoDetectParameters = () => {
    const detectedParams = extractParametersFromSQL(sqlQuery);
    const newParams = detectedParams
      .filter(name => !parameters.some(p => p.name === name))
      .map(name => ({
        id: `param_${Date.now()}_${name}`,
        name,
        label: name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' '),
        type: ParameterType.STRING,
        required: true,
      }));
    
    if (newParams.length > 0) {
      onParametersChange([...parameters, ...newParams]);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader className="bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Parametri Query</h3>
            <div className="space-x-2">
              <Button
                onClick={autoDetectParameters}
                size="small"
                themeColor="info"
              >
                Auto-detect
              </Button>
              <Button
                onClick={addParameter}
                size="small"
                themeColor="primary"
              >
                Aggiungi
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-gray-200">
            {parameters.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Nessun parametro definito
              </div>
            ) : (
              parameters.map(param => (
                <div
                  key={param.id}
                  className={`p-3 cursor-pointer hover:bg-gray-50 ${
                    selectedParameter?.id === param.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedParameter(param)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{param.label || param.name}</div>
                      <div className="text-sm text-gray-500">
                        :{param.name} - {param.type}
                      </div>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteParameter(param.id);
                      }}
                      size="small"
                      themeColor="error"
                      fillMode="flat"
                    >
                      Elimina
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="bg-gray-50">
          <h3 className="text-lg font-semibold">
            {selectedParameter ? 'Modifica Parametro' : 'Dettagli Parametro'}
          </h3>
        </CardHeader>
        <CardBody>
          {selectedParameter ? (
            <Form
              initialValues={selectedParameter}
              onSubmit={(values) => {
                updateParameter(selectedParameter.id, values);
              }}
              render={(formRenderProps) => (
                <form onSubmit={formRenderProps.onSubmit}>
                  <div className="space-y-4">
                    <FormField
                      name="name"
                      label="Nome Parametro"
                      component={FormInput}
                      validator={requiredValidator}
                    />
                    
                    <FormField
                      name="label"
                      label="Etichetta"
                      component={FormInput}
                      validator={requiredValidator}
                    />
                    
                    <FormField
                      name="type"
                      label="Tipo"
                      component={FormDropDownList}
                      data={Object.values(ParameterType)}
                      validator={requiredValidator}
                    />
                    
                    <FormField
                      name="required"
                      label="Obbligatorio"
                      component={FormCheckbox}
                    />
                    
                    <FormField
                      name="defaultValue"
                      label="Valore Predefinito"
                      component={FormInput}
                    />
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="submit"
                        themeColor="primary"
                      >
                        Salva
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            />
          ) : (
            <div className="text-center text-gray-500">
              Seleziona un parametro per modificarlo
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

const requiredValidator = (value: any) => value ? "" : "Campo obbligatorio";
```

### 7.6 Query Preview Component (components/preview/QueryPreview.tsx)
```typescript
import React, { useState } from 'react';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { Button } from '@progress/kendo-react-buttons';
import { Card, CardHeader, CardBody } from '@progress/kendo-react-layout';
import { QueryExecutionResult } from '../../types/query.types';

interface QueryPreviewProps {
  result: QueryExecutionResult | null;
  loading: boolean;
  onRefresh: () => void;
}

export const QueryPreview: React.FC<QueryPreviewProps> = ({
  result,
  loading,
  onRefresh
}) => {
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(20);
  const excelExportRef = React.useRef<ExcelExport>(null);

  const handleExcelExport = () => {
    if (excelExportRef.current) {
      excelExportRef.current.save();
    }
  };

  const handlePageChange = (event: any) => {
    setSkip(event.page.skip);
    setTake(event.page.take);
  };

  if (!result && !loading) {
    return (
      <Card>
        <CardBody>
          <div className="text-center py-8 text-gray-500">
            Esegui la query per visualizzare i risultati
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="bg-gray-50">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Risultati Query</h3>
            {result && (
              <div className="text-sm text-gray-600">
                {result.rowCount} righe • {result.executionTime}ms
              </div>
            )}
          </div>
          <div className="space-x-2">
            <Button
              onClick={onRefresh}
              disabled={loading}
              themeColor="info"
              size="small"
            >
              Aggiorna
            </Button>
            <Button
              onClick={handleExcelExport}
              disabled={!result || result.data.length === 0}
              themeColor="success"
              size="small"
            >
              Esporta Excel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody className="p-0">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="k-loading-indicator k-loading-indicator-large"></div>
          </div>
        ) : result?.error ? (
          <div className="p-4 bg-red-50 text-red-700">
            <div className="font-semibold">Errore nell'esecuzione:</div>
            <div className="mt-1">{result.error}</div>
          </div>
        ) : result ? (
          <>
            <ExcelExport
              data={result.data}
              fileName="query-results.xlsx"
              ref={excelExportRef}
            >
              <Grid
                data={result.data.slice(skip, skip + take)}
                skip={skip}
                take={take}
                total={result.rowCount}
                pageable={true}
                onPageChange={handlePageChange}
                sortable={true}
                resizable={true}
                style={{ height: '500px' }}
              >
                {result.columns.map((column) => (
                  <GridColumn
                    key={column.field}
                    field={column.field}
                    title={column.title}
                    width={column.width}
                  />
                ))}
              </Grid>
            </ExcelExport>
          </>
        ) : null}
      </CardBody>
    </Card>
  );
};
```

## 8. API e Servizi

### 8.1 Report Editor API Service (services/api/reportEditorApi.ts)
```typescript
import axios from 'axios';
import { Query, QueryExecutionRequest, QueryExecutionResult } from '../../types/query.types';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor per aggiungere token di autenticazione
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const reportEditorApi = {
  // Query CRUD operations
  getQueries: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    category?: string;
  }): Promise<{ data: Query[]; total: number }> => {
    const response = await api.get('/report-editor/queries', { params });
    return response.data;
  },

  getQuery: async (id: number): Promise<Query> => {
    const response = await api.get(`/report-editor/queries/${id}`);
    return response.data;
  },

  createQuery: async (query: Omit<Query, 'id' | 'createdAt' | 'updatedAt'>): Promise<Query> => {
    const response = await api.post('/report-editor/queries', query);
    return response.data;
  },

  updateQuery: async (id: number, query: Partial<Query>): Promise<Query> => {
    const response = await api.put(`/report-editor/queries/${id}`, query);
    return response.data;
  },

  deleteQuery: async (id: number): Promise<void> => {
    await api.delete(`/report-editor/queries/${id}`);
  },

  // Query execution
  executeQuery: async (request: QueryExecutionRequest): Promise<QueryExecutionResult> => {
    const response = await api.post('/report-editor/execute', request);
    return response.data;
  },

  // Validate SQL
  validateSQL: async (sql: string): Promise<{ valid: boolean; errors?: string[] }> => {
    const response = await api.post('/report-editor/validate-sql', { sql });
    return response.data;
  },

  // Export query results
  exportQuery: async (queryId: number, format: 'excel' | 'csv' | 'pdf', parameters: Record<string, any>): Promise<Blob> => {
    const response = await api.post(
      `/report-editor/queries/${queryId}/export`,
      { format, parameters },
      { responseType: 'blob' }
    );
    return response.data;
  },

  // Templates
  getTemplates: async (): Promise<Query[]> => {
    const response = await api.get('/report-editor/templates');
    return response.data;
  },

  createTemplate: async (queryId: number): Promise<Query> => {
    const response = await api.post(`/report-editor/queries/${queryId}/make-template`);
    return response.data;
  },

  // Get available tables for autocomplete
  getAvailableTables: async (): Promise<string[]> => {
    const response = await api.get('/report-editor/available-tables');
    return response.data;
  },

  // Get table columns for autocomplete
  getTableColumns: async (tableName: string): Promise<{ name: string; type: string }[]> => {
    const response = await api.get(`/report-editor/tables/${tableName}/columns`);
    return response.data;
  },
};
```

### 8.2 Context Provider (contexts/ReportEditorContext.tsx)
```typescript
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Query, QueryExecutionResult } from '../types/query.types';
import { reportEditorApi } from '../services/api/reportEditorApi';

interface ReportEditorContextType {
  queries: Query[];
  selectedQuery: Query | null;
  loading: boolean;
  error: string | null;
  executionResult: QueryExecutionResult | null;
  
  // Actions
  loadQueries: () => Promise<void>;
  selectQuery: (query: Query | null) => void;
  saveQuery: (query: Query) => Promise<void>;
  deleteQuery: (id: number) => Promise<void>;
  executeQuery: (queryId: number, parameters: Record<string, any>) => Promise<void>;
}

const ReportEditorContext = createContext<ReportEditorContextType | undefined>(undefined);

export const useReportEditor = () => {
  const context = useContext(ReportEditorContext);
  if (!context) {
    throw new Error('useReportEditor must be used within ReportEditorProvider');
  }
  return context;
};

export const ReportEditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [executionResult, setExecutionResult] = useState<QueryExecutionResult | null>(null);

  const loadQueries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await reportEditorApi.getQueries();
      setQueries(result.data);
    } catch (err) {
      setError('Errore nel caricamento delle query');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectQuery = useCallback((query: Query | null) => {
    setSelectedQuery(query);
    setExecutionResult(null);
  }, []);

  const saveQuery = useCallback(async (query: Query) => {
    try {
      setLoading(true);
      setError(null);
      
      let savedQuery: Query;
      if (query.id) {
        savedQuery = await reportEditorApi.updateQuery(query.id, query);
      } else {
        savedQuery = await reportEditorApi.createQuery(query);
      }
      
      // Aggiorna la lista delle query
      setQueries(prev => {
        const index = prev.findIndex(q => q.id === savedQuery.id);
        if (index >= 0) {
          return [...prev.slice(0, index), savedQuery, ...prev.slice(index + 1)];
        } else {
          return [...prev, savedQuery];
        }
      });
      
      setSelectedQuery(savedQuery);
    } catch (err) {
      setError('Errore nel salvataggio della query');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteQuery = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      
      await reportEditorApi.deleteQuery(id);
      
      setQueries(prev => prev.filter(q => q.id !== id));
      if (selectedQuery?.id === id) {
        setSelectedQuery(null);
      }
    } catch (err) {
      setError('Errore nell\'eliminazione della query');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedQuery]);

  const executeQuery = useCallback(async (queryId: number, parameters: Record<string, any>) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await reportEditorApi.executeQuery({ queryId, parameters });
      setExecutionResult(result);
    } catch (err) {
      setError('Errore nell\'esecuzione della query');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const value: ReportEditorContextType = {
    queries,
    selectedQuery,
    loading,
    error,
    executionResult,
    loadQueries,
    selectQuery,
    saveQuery,
    deleteQuery,
    executeQuery,
  };

  return (
    <ReportEditorContext.Provider value={value}>
      {children}
    </ReportEditorContext.Provider>
  );
};
```

## 9. Routing e Navigazione

### 9.1 Query List Page (pages/QueryList/index.tsx)
```typescript
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { Input } from '@progress/kendo-react-inputs';
import { Card, CardHeader, CardBody } from '@progress/kendo-react-layout';
import { useReportEditor } from '../../contexts/ReportEditorContext';

export const QueryList: React.FC = () => {
  const navigate = useNavigate();
  const { queries, loading, loadQueries, deleteQuery } = useReportEditor();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadQueries();
  }, [loadQueries]);

  const filteredQueries = queries.filter(q =>
    q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (query: any) => {
    navigate(`/reporteditor/edit/${query.id}`);
  };

  const handleDelete = async (query: any) => {
    if (window.confirm(`Eliminare la query "${query.name}"?`)) {
      await deleteQuery(query.id);
    }
  };

  const cellRender = (cell: any, field: string) => {
    if (field === 'actions') {
      return (
        <td>
          <div className="space-x-2">
            <Button
              size="small"
              themeColor="primary"
              onClick={() => handleEdit(cell.dataItem)}
            >
              Modifica
            </Button>
            <Button
              size="small"
              themeColor="error"
              onClick={() => handleDelete(cell.dataItem)}
            >
              Elimina
            </Button>
          </div>
        </td>
      );
    }
    return cell;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Query Report Editor</h1>
        <p className="text-gray-600">Gestisci e crea query SQL per report e dashboard</p>
      </div>

      <Card>
        <CardHeader className="bg-gray-50">
          <div className="flex justify-between items-center">
            <Input
              placeholder="Cerca query..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.value)}
              style={{ width: '300px' }}
            />
            <div className="space-x-2">
              <Button
                themeColor="info"
                onClick={() => navigate('/reporteditor/templates')}
              >
                Template
              </Button>
              <Button
                themeColor="primary"
                onClick={() => navigate('/reporteditor/new')}
              >
                Nuova Query
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="k-loading-indicator k-loading-indicator-large"></div>
            </div>
          ) : (
            <Grid
              data={filteredQueries}
              style={{ height: '600px' }}
              sortable={true}
              pageable={{
                pageSizes: [10, 20, 50],
                pageSize: 20
              }}
            >
              <GridColumn field="name" title="Nome" width="250px" />
              <GridColumn field="description" title="Descrizione" />
              <GridColumn field="category" title="Categoria" width="150px" />
              <GridColumn
                field="updatedAt"
                title="Ultima Modifica"
                width="180px"
                format="{0:dd/MM/yyyy HH:mm}"
              />
              <GridColumn
                field="createdBy"
                title="Creato da"
                width="150px"
              />
              <GridColumn
                title="Azioni"
                width="200px"
                cell={(props) => cellRender(props, 'actions')}
              />
            </Grid>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
```

### 9.2 Query Editor Page (pages/QueryEditor/index.tsx)
```typescript
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { Form, FormField, FormInput, FormTextArea } from '@progress/kendo-react-form';
import { SqlEditor } from '../../components/editor/SqlEditor';
import { ParameterBuilder } from '../../components/parameters/ParameterBuilder';
import { QueryPreview } from '../../components/preview/QueryPreview';
import { useReportEditor } from '../../contexts/ReportEditorContext';
import { Query } from '../../types/query.types';

export const QueryEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedQuery, loading, saveQuery, executeQuery, executionResult } = useReportEditor();
  const [selected, setSelected] = useState(0);
  const [query, setQuery] = useState<Partial<Query>>({
    name: '',
    description: '',
    sql: '',
    parameters: [],
    category: '',
  });

  useEffect(() => {
    if (id && selectedQuery?.id === parseInt(id)) {
      setQuery(selectedQuery);
    }
  }, [id, selectedQuery]);

  const handleSave = async () => {
    try {
      await saveQuery(query as Query);
      navigate('/reporteditor');
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
    }
  };

  const handleExecute = async () => {
    if (query.id) {
      const parameters = query.parameters?.reduce((acc, param) => {
        acc[param.name] = param.defaultValue || '';
        return acc;
      }, {} as Record<string, any>);
      
      await executeQuery(query.id, parameters || {});
      setSelected(2); // Passa alla tab Preview
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            {id ? 'Modifica Query' : 'Nuova Query'}
          </h1>
          <p className="text-gray-600">
            Crea o modifica query SQL con parametri dinamici
          </p>
        </div>
        <div className="space-x-2">
          <Button
            onClick={() => navigate('/reporteditor')}
            themeColor="info"
          >
            Annulla
          </Button>
          <Button
            onClick={handleSave}
            themeColor="primary"
            disabled={loading}
          >
            Salva
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <Form
            initialValues={query}
            onSubmit={() => {}}
            render={() => (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  name="name"
                  label="Nome Query"
                  component={FormInput}
                  value={query.name}
                  onChange={(e) => setQuery({ ...query, name: e.value })}
                />
                <FormField
                  name="category"
                  label="Categoria"
                  component={FormInput}
                  value={query.category}
                  onChange={(e) => setQuery({ ...query, category: e.value })}
                />
                <div className="col-span-2">
                  <FormField
                    name="description"
                    label="Descrizione"
                    component={FormTextArea}
                    value={query.description}
                    onChange={(e) => setQuery({ ...query, description: e.value })}
                  />
                </div>
              </div>
            )}
          />
        </div>

        <TabStrip
          selected={selected}
          onSelect={(e) => setSelected(e.selected)}
        >
          <TabStripTab title="Editor SQL">
            <div className="p-4">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold">Query SQL</h3>
                <Button
                  onClick={handleExecute}
                  themeColor="success"
                  disabled={!query.sql || loading}
                >
                  Esegui Query
                </Button>
              </div>
              <SqlEditor
                value={query.sql || ''}
                onChange={(sql) => setQuery({ ...query, sql })}
                height="400px"
              />
            </div>
          </TabStripTab>

          <TabStripTab title="Parametri">
            <div className="p-4">
              <ParameterBuilder
                parameters={query.parameters || []}
                onParametersChange={(parameters) => setQuery({ ...query, parameters })}
                sqlQuery={query.sql || ''}
              />
            </div>
          </TabStripTab>

          <TabStripTab title="Preview">
            <div className="p-4">
              <QueryPreview
                result={executionResult}
                loading={loading}
                onRefresh={handleExecute}
              />
            </div>
          </TabStripTab>
        </TabStrip>
      </div>
    </div>
  );
};
```

## 10. Sicurezza

### 10.1 SQL Validator (services/validators/sqlValidator.ts)
```typescript
export class SqlValidator {
  private static readonly FORBIDDEN_KEYWORDS = [
    'INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER', 
    'TRUNCATE', 'EXEC', 'EXECUTE', 'GRANT', 'REVOKE'
  ];

  private static readonly ALLOWED_FUNCTIONS = [
    'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'COALESCE', 'CAST',
    'CONVERT', 'DATE_FORMAT', 'NOW', 'CURDATE', 'YEAR', 'MONTH',
    'DAY', 'CONCAT', 'SUBSTRING', 'LENGTH', 'TRIM', 'UPPER', 'LOWER'
  ];

  private static readonly MAX_QUERY_LENGTH = 10000;
  private static readonly MAX_SUBQUERIES = 5;

  static validate(sql: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check query length
    if (sql.length > this.MAX_QUERY_LENGTH) {
      errors.push(`La query supera la lunghezza massima di ${this.MAX_QUERY_LENGTH} caratteri`);
    }

    // Check for forbidden keywords
    const upperSql = sql.toUpperCase();
    for (const keyword of this.FORBIDDEN_KEYWORDS) {
      if (upperSql.includes(keyword)) {
        errors.push(`Keyword non consentita: ${keyword}`);
      }
    }

    // Check for SQL injection patterns
    if (this.hasSqlInjectionPatterns(sql)) {
      errors.push('Rilevato possibile tentativo di SQL injection');
    }

    // Count subqueries
    const subqueryCount = (sql.match(/\bSELECT\b/gi) || []).length - 1;
    if (subqueryCount > this.MAX_SUBQUERIES) {
      errors.push(`Numero massimo di subquery superato (max: ${this.MAX_SUBQUERIES})`);
    }

    // Validate parameters
    const paramErrors = this.validateParameters(sql);
    errors.push(...paramErrors);

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private static hasSqlInjectionPatterns(sql: string): boolean {
    const patterns = [
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,  // OR 1=1
      /(\b(OR|AND)\s+'[^']*'\s*=\s*'[^']*')/i,  // OR 'a'='a'
      /(--\s*$)/m,  // SQL comments at end of line
      /(\/\*[\s\S]*?\*\/)/,  // Block comments
      /(\bUNION\s+SELECT\b)/i,  // UNION attacks
      /(;\s*DROP\s+)/i,  // Multiple statements
    ];

    return patterns.some(pattern => pattern.test(sql));
  }

  private static validateParameters(sql: string): string[] {
    const errors: string[] = [];
    const paramRegex = /:(\w+)/g;
    const params = new Set<string>();
    
    let match;
    while ((match = paramRegex.exec(sql)) !== null) {
      const paramName = match[1];
      if (params.has(paramName)) {
        errors.push(`Parametro duplicato: :${paramName}`);
      }
      params.add(paramName);
    }

    return errors;
  }
}
```

### 10.2 Permission Guards
```typescript
export const REPORT_EDITOR_PERMISSIONS = {
  VIEW: 'REPORT_EDITOR_VIEW',
  CREATE: 'REPORT_EDITOR_CREATE',
  EDIT: 'REPORT_EDITOR_EDIT',
  DELETE: 'REPORT_EDITOR_DELETE',
  EXECUTE: 'REPORT_EDITOR_EXECUTE',
  EXPORT: 'REPORT_EDITOR_EXPORT',
  MANAGE_TEMPLATES: 'REPORT_EDITOR_MANAGE_TEMPLATES'
};

export const hasPermission = (userPermissions: string[], requiredPermission: string): boolean => {
  return userPermissions.includes(requiredPermission) || userPermissions.includes('ADMIN');
};
```

## 11. Testing

### 11.1 Setup Testing (vitest.config.ts)
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 11.2 Test Example (SqlEditor.test.tsx)
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SqlEditor } from '../src/components/editor/SqlEditor';

describe('SqlEditor', () => {
  it('should render the editor', () => {
    const onChange = vi.fn();
    render(
      <SqlEditor 
        value="SELECT * FROM users" 
        onChange={onChange}
      />
    );
    
    expect(screen.getByText(/SELECT/)).toBeInTheDocument();
  });

  it('should call onChange when content changes', () => {
    const onChange = vi.fn();
    const { container } = render(
      <SqlEditor 
        value="" 
        onChange={onChange}
      />
    );
    
    // Simula cambio contenuto
    // Monaco editor richiede test più complessi
  });
});
```

## 12. Build e Deployment

### 12.1 Build Scripts
```json
{
  "scripts": {
    "build": "webpack --mode production",
    "build:analyze": "webpack-bundle-analyzer dist/stats.json",
    "docker:build": "docker build -t portaal-fe-reporteditor .",
    "docker:run": "docker run -p 3021:80 portaal-fe-reporteditor"
  }
}
```

### 12.2 Dockerfile
```dockerfile
# Build stage
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN yarn build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 12.3 nginx.conf
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /remoteEntry.js {
        add_header Access-Control-Allow-Origin *;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 13. Checklist Completa

### 13.1 Setup Iniziale
- [ ] Creare directory portaal-fe-reporteditor
- [ ] Copiare struttura base da dashboard
- [ ] Pulire file non necessari
- [ ] Configurare package.json
- [ ] Installare dipendenze base
- [ ] Installare Monaco Editor e dipendenze aggiuntive
- [ ] Configurare webpack.config.js
- [ ] Creare file .env.development e .env
- [ ] Configurare tsconfig.json
- [ ] Configurare babel.config.js
- [ ] Configurare tailwind.config.js
- [ ] Configurare postcss.config.js

### 13.2 Integrazione Core
- [ ] Aggiornare webpack.config.js del core
- [ ] Aggiungere reporteditor ai remotes (development e production)
- [ ] Aggiornare MICROSERVICES_LIST.md
- [ ] Aggiornare SELECTIVE_MICROSERVICES_LOADING.md
- [ ] Aggiornare ENABLED_MFES in .env.development del core (opzionale)
- [ ] Testare caricamento microservizio

### 13.3 Struttura Base
- [ ] Creare struttura directory come da schema
- [ ] Implementare MfeInit.ts
- [ ] Implementare App.tsx con routes
- [ ] Creare bootstrap.js e index.js
- [ ] Configurare index.html

### 13.4 Types e Interfaces
- [ ] Creare query.types.ts
- [ ] Creare parameter.types.ts
- [ ] Creare template.types.ts
- [ ] Creare api response types

### 13.5 Componenti Editor
- [ ] Implementare SqlEditor con Monaco
- [ ] Configurare syntax highlighting SQL
- [ ] Implementare autocompletamento
- [ ] Aggiungere validazione in tempo reale
- [ ] Creare toolbar editor

### 13.6 Componenti Parameters
- [ ] Implementare ParameterBuilder
- [ ] Creare form per ogni tipo di parametro
- [ ] Implementare drag & drop per ordinamento
- [ ] Aggiungere validazioni parametri
- [ ] Implementare dipendenze tra parametri

### 13.7 Componenti Preview
- [ ] Implementare QueryPreview
- [ ] Integrare KendoReact Grid
- [ ] Aggiungere paginazione
- [ ] Implementare export Excel/PDF
- [ ] Gestire errori esecuzione

### 13.8 Componenti Template
- [ ] Implementare TemplateGallery
- [ ] Creare TemplateCard
- [ ] Implementare import/export template
- [ ] Aggiungere categorizzazione

### 13.9 API e Servizi
- [ ] Creare reportEditorApi.ts
- [ ] Implementare tutti gli endpoints
- [ ] Configurare interceptors
- [ ] Gestire autenticazione
- [ ] Implementare gestione errori

### 13.10 Context e State
- [ ] Implementare ReportEditorContext
- [ ] Creare QueryContext
- [ ] Configurare provider globale
- [ ] Implementare hooks custom

### 13.11 Pagine
- [ ] Implementare QueryList page
- [ ] Implementare QueryEditor page
- [ ] Implementare TemplateManager page
- [ ] Aggiungere navigazione

### 13.12 Sicurezza
- [ ] Implementare SqlValidator
- [ ] Aggiungere whitelist comandi SQL
- [ ] Implementare controllo permessi
- [ ] Validare parametri input
- [ ] Prevenire SQL injection

### 13.13 Stili e UI
- [ ] Configurare stili globali
- [ ] Personalizzare tema KendoReact
- [ ] Implementare responsive design
- [ ] Aggiungere animazioni
- [ ] Verificare accessibilità

### 13.14 Testing
- [ ] Configurare Vitest
- [ ] Scrivere unit test componenti
- [ ] Test integrazione API
- [ ] Test sicurezza SQL validator
- [ ] Test performance query execution
- [ ] Coverage minimo 80%

### 13.15 Build e Deployment
- [ ] Configurare build produzione
- [ ] Ottimizzare bundle size
- [ ] Creare Dockerfile
- [ ] Configurare nginx
- [ ] Test build locale
- [ ] Documentare processo deployment

### 13.16 Documentazione
- [ ] Creare README.md dettagliato
- [ ] Documentare API endpoints
- [ ] Guida utente
- [ ] Esempi query
- [ ] Troubleshooting guide

### 13.17 Integrazione Finale
- [ ] Test completo con tutti i microservizi
- [ ] Verificare routing
- [ ] Test permessi
- [ ] Test performance
- [ ] User acceptance testing

## Note Finali

Questa documentazione fornisce una guida completa per implementare il microservizio portaal-fe-reporteditor. Segui la checklist in ordine per assicurarti di non tralasciare nessun passaggio importante.

### Priorità di Implementazione:
1. Setup base e integrazione con core
2. Componenti editor SQL e parametri
3. API integration
4. Preview e export
5. Template system
6. Testing e sicurezza
7. Deployment

### Risorse Utili:
- [Monaco Editor Documentation](https://microsoft.github.io/monaco-editor/)
- [KendoReact Documentation](https://www.telerik.com/kendo-react-ui/components/)
- [Module Federation Examples](https://github.com/module-federation/module-federation-examples)
- [SQL Parser Libraries](https://github.com/taozhi8833998/node-sql-parser)

### Contatti per Supporto:
- Team Frontend: [email]
- Team Backend API: [email]
- DevOps: [email]