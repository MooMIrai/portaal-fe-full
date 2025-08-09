# Analisi Dettagliata Warning CSS Modules

## 📊 Statistiche Warning

### Common (portaal-fe-common)
- **Totale warning**: 70+
- **Componenti affetti**: 18
- **Tipo principale**: "export 'className' was not found in './module.scss'"

## 🔍 Dettaglio Warning per Componente

### GridTable/FiltersForm
```
WARNING: export 'container' was not found in './styles.module.scss'
WARNING: export 'closed' was not found in './styles.module.scss'
```
**Problema**: File si chiama `style.module.scss`, import cerca `styles.module.scss`
**Import errato**: `import * as styles from './style.module.scss'`

### GridTable/component
```
WARNING: export 'gridContainer' was not found in './style.module.scss'
WARNING: export 'customActions' was not found in './style.module.scss'
WARNING: export 'filterContainer' was not found in './style.module.scss'
```
**Problema**: Import con `* as styles` invece di default import

### Calendar/component
```
WARNING: export 'MonthView' was not found in './styles.module.scss'
```
**File esistente**: `styles.module.scss` ✓
**Import errato**: `import * as styles`

### CalendarMobile/component
```
WARNING: export 'calendarMobile' was not found in './styles.module.scss'
WARNING: export 'container' was not found in './styles.module.scss'
```

### CountrySelector/component
```
WARNING: export 'dropDown' was not found in './styles.module.scss'
```

### CustomListView/component
```
WARNING: export 'container' was not found in './styles.module.scss'
WARNING: export 'listContainer' was not found in './styles.module.scss'
```

### DynamicForm/component
```
WARNING: export 'dynamicFormFieldCol' was not found in './styles.module.scss'
```

### GridTable/CellAction/component
```
WARNING: export 'actions' was not found in './styles.module.scss'
```

### HoursDaysFilterCell/component
```
WARNING: export 'hoursDaysWrapper' was not found in './styles.module.scss'
WARNING: export 'container' was not found in './styles.module.scss'
WARNING: export 'label' was not found in './styles.module.scss'
WARNING: export 'inputField' was not found in './styles.module.scss'
WARNING: export 'button' was not found in './styles.module.scss'
WARNING: export 'unitSelect' was not found in './styles.module.scss'
```

### InlineEditTable/component
```
WARNING: export 'editDialogButtons' was not found in './styles.module.scss'
```

### InputText/component
```
WARNING: export 'container' was not found in './style.module.scss'
WARNING: export 'input' was not found in './style.module.scss'
WARNING: export 'button' was not found in './style.module.scss'
```

### Sidebar/component
Numerosi warning (15+):
```
WARNING: export 'page' was not found in './style.module.scss'
WARNING: export 'navbar' was not found in './style.module.scss'
WARNING: export 'hamburgerBtn' was not found in './style.module.scss'
WARNING: export 'brandWrapper' was not found in './style.module.scss'
WARNING: export 'profileContainer' was not found in './style.module.scss'
...
```

### SkillsSelector/component
```
WARNING: export 'skillContainer' was not found in './styles.module.scss'
WARNING: export 'skillSelectorButton' was not found in './styles.module.scss'
WARNING: export 'title' was not found in './styles.module.scss'
```

### Tab/component
```
WARNING: export 'containerFluid' was not found in './styles.module.scss'
WARNING: export 'parentContainer' was not found in './styles.module.scss'
WARNING: export 'buttonTab' was not found in './styles.module.scss'
```

### UpLoadSingleFile/component
```
WARNING: export 'uploadContainer' was not found in './styles.module.scss'
WARNING: export 'uploadFileButton' was not found in './styles.module.scss'
```

### UploadMultiple/component
Multiple warning (8+):
```
WARNING: export 'existingFileItem' was not found in './styles.module.scss'
WARNING: export 'existingFilesContainer' was not found in './styles.module.scss'
WARNING: export 'existingFilesTitle' was not found in './styles.module.scss'
...
```

### UploadMultipleFiles/component
```
WARNING: export 'droppableArea' was not found in './styles.module.scss'
WARNING: export 'droppableText' was not found in './styles.module.scss'
WARNING: export 'existingFilesContainer' was not found in './styles.module.scss'
WARNING: export 'existingFilesTitle' was not found in './styles.module.scss'
WARNING: export 'existingFilesList' was not found in './styles.module.scss'
```

## 🎯 Pattern dei Problemi

### Problema 1: Inconsistenza Nomi File
- **9 componenti** usano `style.module.scss`
- **9 componenti** usano `styles.module.scss`
- Tutti gli import cercano `styles.module.scss`

### Problema 2: Import Errati
```javascript
// Pattern errato trovato in TUTTI i componenti
import * as styles from './styles.module.scss';

// Pattern corretto necessario
import styles from './styles.module.scss';
```

### Problema 3: CSS Modules Non Configurati
- Webpack non processa i file come CSS Modules
- I file vengono importati come oggetti vuoti
- Risultato: `styles.container` = undefined

## 📈 Impatto

- **18 componenti** in Common non funzionanti
- **70+ warning** ad ogni build
- **Filtri Kendo** completamente rotti
- **Stili mancanti** in molti componenti UI

## ✅ Soluzione Necessaria

1. **Standardizzare** tutti i nomi file a `styles.module.scss`
2. **Correggere** tutti gli import rimuovendo `* as`
3. **Configurare** webpack per CSS Modules
4. **Aggiungere** TypeScript definitions