# Health Check - Verifica Rapida Sistema

## 🚦 Check List Veloce (2 minuti)

### 1. Servizi PM2 Running
```bash
pm2 list | grep portaal-fe
```
✅ Tutti devono essere "online"
❌ Se qualcuno è "stopped" o "errored"

### 2. Test Veloce Porte
```bash
# Test tutte le porte in un comando
for p in 3000 3003 3005 3006 3008 3009 3011 3012 3013 3015 3018 3020; do 
  timeout 1 curl -s http://localhost:$p > /dev/null && echo "✅ $p" || echo "❌ $p"
done
```

### 3. Test Browser Minimo
1. Aprire: http://localhost:3000
2. Verificare:
   - Pagina carica? ✅/❌
   - Menu visibile? ✅/❌
   - Errori console? ✅/❌

## 🔴 Problemi Comuni e Fix Rapidi

### Problema 1: "Cannot GET /"
```bash
# Il servizio non è partito correttamente
pm2 restart [servizio]
pm2 logs [servizio] --lines 30
```

### Problema 2: "Loading script failed"
```bash
# Module Federation non trova il remoteEntry
# Verificare che il servizio target sia online
pm2 status
# Verificare la porta nel browser
curl http://localhost:[porta]/remoteEntry.js
```

### Problema 3: "Port already in use"
```bash
# Trova chi usa la porta
lsof -i :[porta]
# Killa il processo
kill -9 [PID]
# Riavvia servizio
pm2 restart [servizio]
```

### Problema 4: Schermo bianco
```bash
# Controlla Core e Common
pm2 logs core --lines 50
pm2 logs common --lines 50
# Riavvia entrambi
pm2 restart core common
```

### Problema 5: Menu non mostra moduli
```bash
# Problema di permessi o caricamento
# Verificare Auth
pm2 logs auth --lines 30
# Clear browser cache
# CTRL+SHIFT+R nel browser
```

## 🟡 Warning Accettabili

Questi warning sono normali e NON bloccanti:
- ⚠️ "No Telerik license found" - normale senza licenza
- ⚠️ "React Router Future Flag Warning" - deprecation warning
- ⚠️ "export 'xxx' was not found" - CSS modules warning
- ⚠️ "Insertion point null" - theme switcher warning

## 🟢 Sistema OK quando:

✅ PM2 mostra tutti i servizi "online"
✅ http://localhost:3000 carica senza schermo bianco
✅ Menu laterale mostra almeno 5 moduli
✅ Click su Dashboard non da errore
✅ Console browser non ha errori rossi critici

## 📊 Health Score

Calcola il tuo health score:

| Check | Punti |
|-------|-------|
| Core online | 20 |
| Common online | 20 |
| Auth online | 10 |
| Menu visibile | 10 |
| Dashboard carica | 10 |
| Nessun errore console | 10 |
| Altri moduli (ognuno) | 2 |

**Score totale: ___/100**

- 90-100: Sistema perfetto ✅
- 70-89: Sistema funzionante con problemi minori 🟡
- 50-69: Sistema parzialmente funzionante 🟠
- 0-49: Sistema con problemi critici 🔴

## 🔄 Recovery Completo

Se niente funziona, recovery totale:
```bash
# 1. Stop tutto
pm2 delete portaal-fe

# 2. Clear logs
pm2 flush

# 3. Reinstalla dipendenze (dalla root)
yarn install

# 4. Riavvia tutto
pm2 start ecosystem.config.js

# 5. Aspetta 30 secondi per inizializzazione

# 6. Test
curl http://localhost:3000
```

## 📝 Checklist Giornaliera

Da fare ogni mattina prima di sviluppare:

- [ ] `pm2 status` - tutti online?
- [ ] `yarn --version` - yarn installato?
- [ ] Browser cache pulita?
- [ ] `git status` - repository pulito?
- [ ] Aprire http://localhost:3000 - funziona?

---

*Health Check v1.0 - Aggiornato: 2025-08-08*