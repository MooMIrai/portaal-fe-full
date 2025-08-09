# Test e Validazione - Fix Filtri Kendo

## 🧪 Test Plan Completo

### Pre-Requisiti
- [ ] Common riavviato con nuova config webpack
- [ ] Sales e HR in esecuzione
- [ ] Browser DevTools aperto

## Test 1: Verifica CSS Modules

### Test Case 1.1: Classi CSS Risolte
**Steps**:
1. Aprire Sales (http://localhost:3008)
2. Navigare a Clienti
3. Inspect del div contenitore filtri

**Expected**:
```html
<div class="FiltersForm__container___3xY2z">
```

**NOT Expected**:
```html
<div class="undefined undefined">
```

### Test Case 1.2: Toggle Visibility
**Steps**:
1. Click pulsante filtro
2. Verificare cambio classe CSS

**Expected**:
- Prima del click: `class="FiltersForm__container___3xY2z FiltersForm__closed___1aB2c"`
- Dopo il click: `class="FiltersForm__container___3xY2z"`

## Test 2: Funzionalità Filtri

### Test Case 2.1: Apertura/Chiusura
**Steps**:
1. Click pulsante filtro → Apre
2. Click di nuovo → Chiude
3. Ripetere 5 volte

**Expected**:
- Toggle smooth con animazione
- Nessun glitch visivo
- Stato consistente

### Test Case 2.2: Applicazione Filtri
**Steps**:
1. Aprire filtri
2. Inserire "Test" nel campo nome
3. Click "Cerca"

**Expected**:
- Griglia filtrata correttamente
- Filtri rimangono visibili
- Dati aggiornati

### Test Case 2.3: Reset Filtri
**Steps**:
1. Con filtri applicati
2. Click "Cancella"

**Expected**:
- Campi svuotati
- Griglia mostra tutti i dati
- Filtri rimangono aperti

## Test 3: Cross-Microservice

### Microservizi da Testare:

| Microservizio | Porta | Path Test | Griglia |
|--------------|-------|-----------|---------|
| Sales | 3008 | /sales/clienti | Clienti |
| HR | 3009 | /hr/personale | Personale |
| Recruiting | 3011 | /recruiting/candidati | Candidati |
| Stock | 3012 | /stock/inventario | Inventario |
| Reports | 3015 | /reports | Report List |

### Test per Ogni Microservizio:
- [ ] Filtri si aprono/chiudono
- [ ] Nessuna classe undefined
- [ ] Filtri funzionanti
- [ ] Console senza errori

## Test 4: Browser Compatibility

### Browsers da Testare:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (se disponibile)
- [ ] Edge (latest)

### Test per Browser:
1. Funzionalità base filtri
2. Animazioni CSS
3. Layout responsive

## Test 5: Performance

### Metriche da Verificare:
- [ ] Toggle filtri < 100ms
- [ ] Nessun memory leak aprendo/chiudendo ripetutamente
- [ ] CPU usage normale durante animazioni

### Come Testare:
1. Chrome DevTools → Performance
2. Registrare mentre si toggle 20 volte
3. Analizzare:
   - FPS durante animazioni
   - Memory heap
   - Event listeners

## Test 6: Regression Testing

### Verificare che NON si sono rotti:
- [ ] Altri componenti Common
- [ ] Stili globali
- [ ] Build di produzione
- [ ] Hot reload in development

## 📊 Test Results Template

```markdown
## Test Execution - [DATA]

### Environment
- Browser: Chrome 120
- OS: Linux
- Node: 18.x
- Yarn: 1.22.x

### Results Summary
- ✅ CSS Modules: PASS
- ✅ Toggle Function: PASS
- ✅ Filter Application: PASS
- ✅ Cross-Microservice: PASS
- ✅ Performance: PASS

### Issues Found
- None / [Descrizione]

### Screenshots
- [Before Fix]
- [After Fix]
```

## 🐛 Troubleshooting

### Issue: Classi ancora undefined
**Check**:
1. `pm2 logs common` per errori webpack
2. Verificare file `.module.scss` esiste
3. Clear cache: `rm -rf node_modules/.cache`

### Issue: Toggle non funziona
**Check**:
1. Console per errori JavaScript
2. Verificare stato `opened` in React DevTools
3. Breakpoint su onClick handler

### Issue: Stili non applicati
**Check**:
1. Network tab per CSS caricati
2. Computed styles in DevTools
3. Specificità CSS selectors

## ✅ Sign-Off Criteria

Prima di considerare il fix completo:

- [ ] Tutti i test case PASS
- [ ] Nessun errore in console
- [ ] Performance accettabile
- [ ] Code review completata
- [ ] Documentazione aggiornata
- [ ] PM/Team Lead approval