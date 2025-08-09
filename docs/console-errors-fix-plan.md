# Piano d'Azione: Risoluzione Errori Console

## Analisi degli Errori Attuali

### 1. HR Module - CSS Module Export Errors
**Problema:** Il modulo HR ha due errori CSS Module mancanti:
- `export 'listBoxContainer' was not found`
- `export 'parentTab' was not found`

**File coinvolti:**
- `/portaal-fe-hr/src/component/TabPersonaleHR/component.tsx` - Utilizza `styles.listBoxContainer` e `styles.parentTab`
- `/portaal-fe-hr/src/component/TabPersonaleHR/style.module.scss` - Non esporta queste classi (sono commentate)

**Soluzione:**
1. Decommentare le classi CSS nel file SCSS
2. Verificare che le classi siano definite correttamente
3. Riavviare il servizio HR per applicare i cambiamenti

### 2. HR Module - Personale Component CSS Modules
**Problema:** Temporaneamente rimosso CSS Modules da PersonaleSection per evitare errori
- File: `/portaal-fe-hr/src/pages/Personale/component.tsx`
- Classe mancante: `canceledUsersInput`

**Soluzione:**
1. Ripristinare l'import del CSS Module
2. Verificare che la classe sia esportata correttamente dal file SCSS
3. Rimuovere gli stili inline temporanei

### 3. Notifications Module - CSS Module Export Error
**Problema:** Classe CSS non trovata
- `export 'btnClean' was not found`

**Soluzione:**
1. Identificare il componente che usa `btnClean`
2. Verificare/creare la classe nel file SCSS corrispondente
3. Riavviare il servizio Notifications

### 4. Stock Module - CSS Module Warning
**Problema:** Warning su file component
- File: `DeviceCrud/component.tsx`
- Probabilmente errore di export CSS Module

**Soluzione:**
1. Analizzare il file DeviceCrud
2. Correggere eventuali import/export CSS Module
3. Riavviare il servizio Stock

### 5. React Router - No Routes Matched Warnings
**Problema:** Warnings su route non trovate
- Appare in fondo alle pagine: "Pagina non trovata"

**Soluzione:**
1. Verificare configurazione route in ogni microservizio
2. Controllare che tutti i path siano definiti correttamente
3. Implementare route di fallback appropriate

### 6. React Props Warnings
**Problema:** Props non riconosciute passate a elementi DOM

**Soluzione:**
1. Identificare componenti che passano props non valide
2. Filtrare props prima di passarle a elementi DOM
3. Utilizzare destructuring per separare props custom

## Ordine di Esecuzione

### Fase 1: HR Module (Priorità Alta)
1. **Fix TabPersonaleHR CSS Module errors**
   - Decommentare `.parentTab` e `.listBoxContainer` in `style.module.scss`
   - Verificare utilizzo in `component.tsx`
   
2. **Ripristinare CSS Modules in Personale component**
   - Riabilitare import in `/pages/Personale/component.tsx`
   - Rimuovere stili inline temporanei
   - Verificare che `.canceledUsersInput` sia definito

3. **Test completo**
   - Riavviare servizio HR
   - Verificare /personale funzioni senza errori console

### Fase 2: Notifications Module
1. **Identificare componente con btnClean**
   - Cercare utilizzo in tutti i file del modulo
   - Verificare file SCSS associato

2. **Creare/correggere classe CSS**
   - Aggiungere `.btnClean` al file SCSS appropriato
   - Verificare export corretto

3. **Test**
   - Riavviare servizio Notifications
   - Verificare assenza errori

### Fase 3: Stock Module
1. **Analizzare DeviceCrud**
   - Controllare import CSS Module
   - Verificare classi utilizzate

2. **Correggere eventuali problemi**
   - Allineare classi CSS con utilizzo
   - Fix import/export

3. **Test**
   - Riavviare servizio Stock
   - Verificare warning risolto

### Fase 4: React Router Issues
1. **Audit completo route**
   - Mappare tutte le route definite
   - Identificare route mancanti

2. **Implementare fallback**
   - Aggiungere route catch-all
   - Migliorare gestione errori

### Fase 5: React Props Warnings
1. **Identificare componenti problematici**
   - Cercare pattern di props spreading
   - Identificare props custom

2. **Implementare filtering**
   - Utilizzare rest operator
   - Filtrare props non DOM

## Comandi Utili

```bash
# Riavvio singolo servizio
pm2 restart hr
pm2 restart notifications
pm2 restart stock

# Verifica log
pm2 logs hr --lines 50
pm2 logs notifications --lines 50
pm2 logs stock --lines 50

# Pulizia cache (se necessario)
rm -rf portaal-fe-hr/.webpack-cache
rm -rf portaal-fe-notifications/.webpack-cache
rm -rf portaal-fe-stock/.webpack-cache

# Riavvio completo
yarn restart
```

## Metriche di Successo
- ✅ Zero errori CSS Module in console
- ✅ Zero warning React Router
- ✅ Zero warning React props
- ✅ Tutti i microservizi funzionanti senza errori
- ✅ /personale completamente funzionale con CSS Modules

## Note Importanti
- Sempre testare dopo ogni fix
- Mantenere backup dei file modificati
- Documentare cambiamenti significativi
- Verificare che non si introducano regressioni

## Stima Tempi
- Fase 1 (HR): 15 minuti
- Fase 2 (Notifications): 10 minuti  
- Fase 3 (Stock): 10 minuti
- Fase 4 (Router): 20 minuti
- Fase 5 (Props): 15 minuti
- **Totale stimato: 70 minuti**