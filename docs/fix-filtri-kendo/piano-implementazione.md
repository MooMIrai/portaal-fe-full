# Piano di Implementazione - Fix Filtri Kendo

## 📋 Step-by-Step Implementation

### Step 1: Configurare CSS Modules in Webpack

**File**: `/portaal-fe-common/webpack.config.js`

#### Modifiche da Applicare:

1. **Rimuovere** la regola CSS generica (righe 142-144)
2. **Aggiungere** due regole separate:

```javascript
// Regola per CSS Modules (file .module.scss)
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
    ]
},
// Regola per CSS normali (file .scss e .css)
{
    test: /\.(css|s[ac]ss)$/i,
    exclude: /\.module\.s[ac]ss$/i,
    use: ["style-loader", "css-loader", "postcss-loader"]
}
```

### Step 2: Fix Logica Toggle Filtro

**File**: `/portaal-fe-common/src/components/GridTable/FiltersForm/component.tsx`

#### Modifiche Riga 211:

```tsx
// PRIMA (ERRATO):
svgIcon={opened ? filterClearIcon : filterIcon}

// DOPO (CORRETTO):
svgIcon={filterIcon}
```

### Step 3: Verificare styles.module.scss

**File**: `/portaal-fe-common/src/components/GridTable/FiltersForm/styles.module.scss`

Verificare che contenga:
```scss
.container {
    transition: all 0.3s ease;
    overflow: hidden;
    padding: 10px;
    
    &.closed {
        max-height: 0;
        padding: 0;
        opacity: 0;
    }
}
```

### Step 4: Restart Servizi

```bash
# Restart common per applicare modifiche webpack
pm2 restart common

# Restart microservizi che usano GridTable
pm2 restart sales hr recruiting stock reports
```

### Step 5: Test Funzionalità

#### Test in Sales (porta 3008):
1. Navigare a `/sales/clienti`
2. Verificare pulsante filtro
3. Click per aprire/chiudere
4. Applicare filtri
5. Reset filtri

#### Test in HR (porta 3009):
1. Navigare a `/hr/personale`
2. Ripetere test sopra

### Step 6: Validazione Browser DevTools

1. **Inspect Element** sul div filtri:
   - Verificare classi CSS corrette
   - No più "undefined undefined"
   
2. **Console**:
   - Nessun errore CSS Modules
   - Nessun warning undefined

3. **Network**:
   - Verificare caricamento styles.module.scss

## 🚀 Comandi Rapidi

```bash
# Build e restart common
cd portaal-fe-common
yarn build
pm2 restart common

# Logs per debug
pm2 logs common --lines 50

# Test immediato
pm2 restart sales && pm2 logs sales
```

## ⚠️ Possibili Problemi

### Problema 1: Cache Webpack
**Soluzione**: 
```bash
rm -rf portaal-fe-common/node_modules/.cache
pm2 restart common
```

### Problema 2: CSS non si aggiorna
**Soluzione**:
```bash
# Force rebuild
cd portaal-fe-common
yarn build:clean
pm2 restart common
```

### Problema 3: Errori TypeScript
**Soluzione**: Aggiungere type definition
```typescript
// In portaal-fe-common/src/types/css-modules.d.ts
declare module '*.module.scss' {
    const classes: { [key: string]: string };
    export default classes;
}
```

## ✅ Checklist Finale

- [ ] Webpack config modificato
- [ ] CSS Modules funzionanti
- [ ] Pulsante filtro toggle corretto
- [ ] Nessuna classe "undefined"
- [ ] Test in Sales completato
- [ ] Test in HR completato
- [ ] Console senza errori
- [ ] Animazioni smooth