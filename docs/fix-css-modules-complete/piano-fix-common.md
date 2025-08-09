# Piano Fix CSS Modules - portaal-fe-common

## 🎯 Obiettivo
Risolvere tutti i 70+ warning CSS Modules in portaal-fe-common per ripristinare il funzionamento dei filtri Kendo e degli stili.

## 📋 Lista Componenti da Fixare

### Gruppo 1: File da Rinominare (style → styles)
1. `GridTable/FiltersForm/style.module.scss` → `styles.module.scss`
2. `GridTable/style.module.scss` → `styles.module.scss`
3. `InputText/style.module.scss` → `styles.module.scss`
4. `Sidebar/style.module.scss` → `styles.module.scss`
5. Altri file con nome `style.module.scss`

### Gruppo 2: Import da Correggere (TUTTI)
Tutti i 18 componenti necessitano correzione import:

```javascript
// DA (errato)
import * as styles from './styles.module.scss';

// A (corretto)
import styles from './styles.module.scss';
```

## 🛠 Step-by-Step Implementation

### Step 1: Aggiungere TypeScript Definitions

Creare file `/portaal-fe-common/src/css-modules.d.ts`:

```typescript
// CSS Modules type definitions
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
```

### Step 2: Fix Webpack Config (GIÀ FATTO ✓)

La configurazione webpack è già stata aggiornata con:
```javascript
{
  test: /\.module\.s[ac]ss$/i,
  use: [
    "style-loader",
    {
      loader: "css-loader",
      options: {
        modules: {
          localIdentName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    "postcss-loader"
  ],
}
```

### Step 3: Script di Rinomina File

```bash
# Rinomina tutti i file style.module.scss → styles.module.scss
cd portaal-fe-common/src/components

# Lista file da rinominare
find . -name "style.module.scss" -type f

# Rinomina
find . -name "style.module.scss" -type f -exec sh -c 'mv "$1" "${1%style.module.scss}styles.module.scss"' _ {} \;
```

### Step 4: Script Fix Import

```bash
# Fix tutti gli import
cd portaal-fe-common/src

# Trova e corregge import errati
find . -name "*.tsx" -o -name "*.ts" | xargs sed -i "s/import \* as styles from '\(.*\)\.module\.scss'/import styles from '\1.module.scss'/g"
```

### Step 5: Fix Manuali Specifici

#### GridTable/FiltersForm/component.tsx
```javascript
// Linea 6 - DA:
import * as styles from './style.module.scss';
// A:
import styles from './styles.module.scss';
```

#### Calendar/component.tsx
```javascript
// Linea da trovare e correggere
import * as styles from './styles.module.scss';
// A:
import styles from './styles.module.scss';
```

[Ripetere per tutti i 18 componenti]

## 📁 File da Modificare

### Priorità ALTA (Filtri Kendo)
1. `/components/GridTable/FiltersForm/`
   - Rinominare: `style.module.scss` → `styles.module.scss`
   - Fix import in `component.tsx`

2. `/components/GridTable/`
   - Rinominare: `style.module.scss` → `styles.module.scss`
   - Fix import in `component.tsx`

### Priorità MEDIA (UI Components)
3. `/components/Calendar/`
4. `/components/CalendarMobile/`
5. `/components/CustomListView/`
6. `/components/DynamicForm/`
7. `/components/InlineEditTable/`
8. `/components/InputText/`
9. `/components/Sidebar/`
10. `/components/Tab/`

### Priorità BASSA (Upload Components)
11. `/components/UpLoadSingleFile/`
12. `/components/UploadMultiple/`
13. `/components/UploadMultipleFiles/`
14. `/components/CountrySelector/`
15. `/components/SkillsSelector/`
16. `/components/HoursDaysFilterCell/`
17. `/components/GridTable/CellAction/`
18. `/components/Calendar/SlotViewItem/`

## 🧪 Test di Validazione

### Test 1: Build senza Warning
```bash
cd portaal-fe-common
pm2 restart common
pm2 logs common --lines 100 | grep WARNING
# Aspettarsi: 0 warning CSS Modules
```

### Test 2: Filtri Kendo
1. Navigare a Sales → Clienti
2. Click pulsante filtro
3. Verificare:
   - Filtri si nascondono/mostrano
   - Nessuna classe "undefined"
   - Animazione smooth

### Test 3: Inspect Element
1. Aprire DevTools
2. Inspect del div filtri
3. Verificare classi tipo: `FiltersForm__container___3xY2z`

## ⚠️ Possibili Problemi

### Problema: Cache Webpack
```bash
rm -rf node_modules/.cache
pm2 restart common
```

### Problema: TypeScript Errors
Assicurarsi che `tsconfig.json` includa:
```json
{
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.d.ts"
  ]
}
```

### Problema: Stili Non Applicati
Verificare che i file SCSS abbiano effettivamente le classi:
```scss
.container {
  // stili...
}
.closed {
  // stili...
}
```

## ✅ Checklist Finale

- [ ] TypeScript definitions aggiunte
- [ ] Tutti i file rinominati a `styles.module.scss`
- [ ] Tutti gli import corretti (no `* as`)
- [ ] Build senza warning
- [ ] Filtri Kendo funzionanti
- [ ] Test in almeno 3 microservizi