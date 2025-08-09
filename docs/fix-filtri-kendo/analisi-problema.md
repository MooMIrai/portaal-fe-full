# Analisi Dettagliata del Problema Filtri Kendo

## 1. Analisi del Codice Problematico

### FiltersForm Component
**File**: `/portaal-fe-common/src/components/GridTable/FiltersForm/component.tsx`

#### Problema 1: CSS Modules Non Risolti
```tsx
// Riga 9: Import CSS Module
import styles from './styles.module.scss';

// Riga 214: Uso delle classi
<div className={styles.container + ' ' + (!opened ? styles.closed : '')}>
```

**Risultato**: `styles.container` = undefined, `styles.closed` = undefined
**Output HTML**: `<div class="undefined undefined">`

#### Problema 2: Logica Icona Pulsante
```tsx
// Righe 207-212: Pulsante Toggle
<CustomButton
    onClick={() => setOpened(!opened)}
    themeColor="info"
    svgIcon={opened ? filterClearIcon : filterIcon} // ❌ Logica invertita
    fillMode={'link'}
/>
```

**Problema**: Quando il filtro è aperto, mostra `filterClearIcon` invece di `filterIcon`

### GridTable Component
**File**: `/portaal-fe-common/src/components/GridTable/component.tsx`

```tsx
// Righe 608-612: Trasformazione classi CSS
const styleClasses = (props.className?.split(" ") || [])
    .filter(styleClass => styleClass !== "")
    .map(styleClass => styles[styleClass]) // ❌ CSS Modules non funzionano
    .filter(styleClass => styleClass)
    .join(" ");
```

## 2. Configurazione Webpack Attuale

**File**: `/portaal-fe-common/webpack.config.js`

### Configurazione CSS Attuale (ERRATA)
```javascript
// Righe 142-144
{
    test: /\.(css|s[ac]ss)$/i,
    use: ["style-loader", "css-loader", "postcss-loader"],
}
```

**Problema**: Questa regola processa TUTTI i file CSS/SCSS allo stesso modo, senza supporto per CSS Modules.

## 3. Impatto sui Microservizi

I seguenti microservizi utilizzano GridTable con filtri:

- **Sales** (3008): Griglia Clienti, Ordini, Prodotti
- **HR** (3009): Griglia Personale, Contratti
- **Recruiting** (3011): Griglia Candidati
- **Stock** (3012): Griglia Inventario
- **Reports** (3015): Griglie Report dinamiche

## 4. Sintomi Visibili

### Stato Attuale (ERRATO)
```html
<div class="k-toolbar">
    <button class="k-button"><!-- Pulsante Filtro --></button>
    <div class="undefined undefined">
        <!-- Form filtri sempre visibile -->
    </div>
</div>
```

### Stato Desiderato (CORRETTO)
```html
<div class="k-toolbar">
    <button class="k-button"><!-- Pulsante Filtro --></button>
    <div class="filters-container filters-closed">
        <!-- Form filtri nascosto/visibile al toggle -->
    </div>
</div>
```

## 5. Root Cause Analysis

### Catena di Eventi:
1. **Build Time**: Webpack non configura CSS Modules per `.module.scss`
2. **Import Time**: `import styles from './styles.module.scss'` restituisce oggetto vuoto
3. **Runtime**: `styles.container` è undefined
4. **Render**: className diventa "undefined undefined"
5. **UI**: Filtri sempre visibili, pulsante non funziona

## 6. Soluzione Necessaria

### A. Configurazione Webpack Corretta
Aggiungere due regole separate:
1. Una per file `.module.scss` (con CSS Modules)
2. Una per file `.scss` normali (senza CSS Modules)

### B. Fix Logica Component
1. Mantenere icona consistente nel pulsante
2. Verificare logica toggle opened/closed

### C. Testing Completo
1. Build del common
2. Restart servizi
3. Test in ogni microservizio