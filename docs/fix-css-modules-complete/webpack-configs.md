# Configurazione Webpack CSS Modules

## 📋 Microservizi da Configurare

Tutti i seguenti microservizi necessitano della configurazione CSS Modules:

1. portaal-fe-auth
2. portaal-fe-chatbot
3. portaal-fe-dashboard
4. portaal-fe-dashboard-editor
5. portaal-fe-hr
6. portaal-fe-lookups
7. portaal-fe-notifications
8. portaal-fe-personalarea
9. portaal-fe-recruiting
10. portaal-fe-reporteditor
11. portaal-fe-reports
12. portaal-fe-sales
13. portaal-fe-stock
14. portaal-fe-core (se usa CSS modules)

## 🛠 Configurazione da Aggiungere

### webpack.config.js - Sezione Module Rules

Sostituire la regola CSS esistente con queste due regole:

```javascript
module: {
  rules: [
    // ... altre regole ...
    
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
      ],
    },
    
    // Regola per CSS normali (non-modules)
    {
      test: /\.(css|s[ac]ss)$/i,
      exclude: /\.module\.s[ac]ss$/i,
      use: [
        "style-loader", 
        "css-loader", 
        "postcss-loader"
      ],
    },
    
    // ... altre regole ...
  ]
}
```

## 📝 Script di Applicazione Massiva

### Backup dei File
```bash
# Backup di tutti i webpack.config.js
for service in auth chatbot dashboard dashboard-editor hr lookups notifications personalarea recruiting reporteditor reports sales stock; do
  cp portaal-fe-$service/webpack.config.js portaal-fe-$service/webpack.config.js.backup
done
```

### Applicazione Configurazione
```bash
#!/bin/bash
# fix-webpack-css-modules.sh

SERVICES="auth chatbot dashboard dashboard-editor hr lookups notifications personalarea recruiting reporteditor reports sales stock"

for SERVICE in $SERVICES; do
  CONFIG_FILE="portaal-fe-$SERVICE/webpack.config.js"
  
  if [ -f "$CONFIG_FILE" ]; then
    echo "Fixing $CONFIG_FILE..."
    
    # Qui andrebbe lo script di modifica
    # Per sicurezza, meglio farlo manualmente per ogni file
    
    echo "✓ Fixed $SERVICE"
  else
    echo "⚠ File not found: $CONFIG_FILE"
  fi
done
```

## 🔍 Verifica Configurazione Esistente

### Check Configurazione Attuale
```bash
# Verifica se CSS Modules già configurati
for service in auth hr sales stock; do
  echo "=== $service ==="
  grep -A5 "module\.scss" portaal-fe-$service/webpack.config.js || echo "No CSS Modules config"
done
```

## 📂 TypeScript Definitions

Ogni microservizio deve avere il file `src/css-modules.d.ts`:

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

### Script Creazione TypeScript Definitions
```bash
# Crea css-modules.d.ts in tutti i microservizi
for service in auth chatbot dashboard dashboard-editor hr lookups notifications personalarea recruiting reporteditor reports sales stock; do
  cat > portaal-fe-$service/src/css-modules.d.ts << 'EOF'
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
EOF
  echo "✓ Created css-modules.d.ts for $service"
done
```

## ⚠️ Note Importanti

### 1. Ordine delle Regole
L'ordine è importante! La regola per CSS Modules deve venire PRIMA della regola generale CSS.

### 2. Produzione vs Development
Per produzione, considerare l'uso di `MiniCssExtractPlugin` invece di `style-loader`:

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isDevelopment = process.env.NODE_ENV === 'development';

// Nella configurazione:
{
  test: /\.module\.s[ac]ss$/i,
  use: [
    isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        modules: {
          localIdentName: isDevelopment 
            ? '[name]__[local]___[hash:base64:5]'
            : '[hash:base64:8]'
        }
      }
    },
    'postcss-loader'
  ],
}
```

### 3. PostCSS Configuration
Assicurarsi che ogni microservizio abbia `postcss.config.js`:

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## 🧪 Test di Validazione

### Per Ogni Microservizio:
1. **Build Test**
   ```bash
   cd portaal-fe-[service]
   npm run build
   # Check: Nessun warning CSS Modules
   ```

2. **Dev Server Test**
   ```bash
   pm2 restart [service]
   pm2 logs [service] --lines 50
   # Check: Server avviato senza errori
   ```

3. **Browser Test**
   - Navigare al microservizio
   - Inspect element con DevTools
   - Verificare classi CSS con hash (es: `Component__class___3xY2z`)

## ✅ Checklist per Microservizio

Per ogni microservizio:
- [ ] webpack.config.js aggiornato
- [ ] css-modules.d.ts creato
- [ ] Build senza warning
- [ ] Server avviato correttamente
- [ ] CSS Modules funzionanti nel browser

## 📊 Stato Configurazione

| Microservizio | Webpack Config | TypeScript Def | Testato |
|--------------|----------------|----------------|---------|
| common | ✅ | ❌ | ✅ |
| auth | ❌ | ❌ | ❌ |
| chatbot | ❌ | ❌ | ❌ |
| dashboard | ❌ | ❌ | ❌ |
| dashboard-editor | ❌ | ❌ | ❌ |
| hr | ❌ | ✅ | ❌ |
| lookups | ❌ | ❌ | ❌ |
| notifications | ❌ | ❌ | ❌ |
| personalarea | ❌ | ❌ | ❌ |
| recruiting | ❌ | ❌ | ❌ |
| reporteditor | ❌ | ❌ | ❌ |
| reports | ❌ | ❌ | ❌ |
| sales | ❌ | ❌ | ❌ |
| stock | ❌ | ❌ | ❌ |