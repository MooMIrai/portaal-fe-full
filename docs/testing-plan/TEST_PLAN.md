# Piano Completo di Testing - Portaal Frontend

## 🎯 Obiettivo
Verificare che l'applicazione Portaal si apra correttamente e che tutti i 15 microservizi siano funzionanti e accessibili.

## 📋 Checklist Pre-Test

### 1. Verifica Ambiente
- [ ] Node.js versione >= 18.x
- [ ] Yarn installato (NON npm)
- [ ] PM2 installato globalmente
- [ ] Porta 3000-3022 libere
- [ ] Browser Chrome/Firefox aggiornato

### 2. Verifica Dipendenze
```bash
# Dalla root del progetto
yarn --version
pm2 --version
node --version
```

## 🔍 Test Sequenziali

### FASE 1: Verifica Servizi Individuali

#### Test 1.1 - Stato PM2
```bash
# Verificare che tutti i servizi siano in esecuzione
pm2 status

# Output atteso: tutti i servizi con status "online"
```

#### Test 1.2 - Verifica Porte
```bash
# Script per verificare tutte le porte
for port in 3000 3003 3005 3006 3008 3009 3011 3012 3013 3015 3018 3020 3021 3022; do
  echo -n "Porta $port: "
  curl -s -o /dev/null -w "%{http_code}" http://localhost:$port
  echo ""
done
```

#### Test 1.3 - Verifica RemoteEntry di ogni servizio
```bash
# Ogni servizio deve esporre remoteEntry.js per Module Federation
curl -I http://localhost:3000/remoteEntry.js   # Core
curl -I http://localhost:3003/remoteEntry.js   # Common
curl -I http://localhost:3006/remoteEntry.js   # Auth
curl -I http://localhost:3020/remoteEntry.js   # Dashboard
curl -I http://localhost:3005/remoteEntry.js   # Lookups
curl -I http://localhost:3008/remoteEntry.js   # Sales
curl -I http://localhost:3009/remoteEntry.js   # HR
curl -I http://localhost:3011/remoteEntry.js   # Recruiting
curl -I http://localhost:3012/remoteEntry.js   # Stock
curl -I http://localhost:3013/remoteEntry.js   # Notifications
curl -I http://localhost:3015/remoteEntry.js   # Reports
curl -I http://localhost:3018/remoteEntry.js   # Chatbot
# PersonalArea e Editors non hanno sempre remoteEntry
```

### FASE 2: Test Applicazione Principale

#### Test 2.1 - Core Application
```bash
# Test del container principale
curl -s http://localhost:3000 | grep -q "core-root" && echo "✅ Core OK" || echo "❌ Core FAIL"
```

#### Test 2.2 - Common Components
```bash
# Verifica che common sia accessibile
curl -s http://localhost:3003/remoteEntry.js | head -1 | grep -q "common" && echo "✅ Common OK" || echo "❌ Common FAIL"
```

### FASE 3: Test Browser (Manuale)

#### Test 3.1 - Apertura Applicazione
1. Aprire browser: http://localhost:3000
2. Verificare:
   - [ ] Pagina si carica senza errori nella console
   - [ ] Logo Portaal/Taal visibile
   - [ ] Menu laterale presente
   - [ ] Nessun errore di rete nella console (F12)

#### Test 3.2 - Verifica Menu
Verificare che ogni voce del menu sia presente:
- [ ] Gestione Ruoli (Auth)
- [ ] Dashboard
- [ ] Lookups
- [ ] Vendite (Sales)
- [ ] HR
- [ ] Recruiting
- [ ] Approvvigionamenti (Stock)
- [ ] Report
- [ ] Notifiche (se abilitato)
- [ ] Chat (se abilitato)

#### Test 3.3 - Navigazione Moduli
Cliccare su ogni modulo e verificare:

| Modulo | URL Atteso | Contenuto Visibile | Errori Console |
|--------|------------|-------------------|----------------|
| Dashboard | /dashboard | Dashboard widgets | ⬜ Sì ⬜ No |
| Lookups | /lookups | Tabelle lookup | ⬜ Sì ⬜ No |
| Vendite | /clienti | Lista clienti | ⬜ Sì ⬜ No |
| HR | /hr/... | Moduli HR | ⬜ Sì ⬜ No |
| Recruiting | /recruiting/... | Moduli recruiting | ⬜ Sì ⬜ No |
| Stock | /stock/... | Gestione magazzino | ⬜ Sì ⬜ No |
| Report | /reports | Lista report | ⬜ Sì ⬜ No |

### FASE 4: Test Module Federation

#### Test 4.1 - Verifica Caricamento Dinamico
Aprire Developer Tools (F12) > Network:
1. Navigare su un modulo
2. Verificare che vengano caricati:
   - [ ] remoteEntry.js del modulo
   - [ ] Chunks JavaScript del modulo
   - [ ] Nessun errore 404

#### Test 4.2 - Verifica Isolamento CSS
1. Ispezionare elementi (F12)
2. Verificare che ogni modulo abbia wrapper:
   - [ ] `<div id="mfe-dashboard">` per Dashboard
   - [ ] `<div id="mfe-sales">` per Sales
   - [ ] `<div id="mfe-hr">` per HR
   - [ ] etc...

### FASE 5: Test Logs e Errori

#### Test 5.1 - Analisi Logs PM2
```bash
# Verificare errori nei logs
pm2 logs --lines 50 --nostream | grep -i error

# Per ogni servizio specifico
pm2 logs core --lines 20 --nostream
pm2 logs dashboard --lines 20 --nostream
pm2 logs sales --lines 20 --nostream
# etc...
```

#### Test 5.2 - Console Browser
Nel browser (F12 > Console):
- [ ] Nessun errore rosso critico
- [ ] Warning accettabili (license Kendo, etc.)
- [ ] Nessun "Failed to fetch"
- [ ] Nessun "Module not found"

## 🔧 Troubleshooting Rapido

### Problema: Servizio non risponde
```bash
# Restart singolo servizio
pm2 restart [nome-servizio]

# Verificare log
pm2 logs [nome-servizio] --lines 50
```

### Problema: Porta occupata
```bash
# Trovare processo che usa la porta
lsof -i :3000  # sostituire con porta desiderata
# Kill processo se necessario
kill -9 [PID]
```

### Problema: Errori Module Federation
1. Verificare file `.env.development` di ogni servizio
2. Controllare che REMOTE_PATH punti a common (3003)
3. Verificare webpack.config.js per remotes configuration

## 📊 Report Finale

### Servizi Funzionanti
| Servizio | Porta | Build | Runtime | UI | Note |
|----------|-------|-------|---------|----|----|
| Core | 3000 | ⬜ | ⬜ | ⬜ | |
| Common | 3003 | ⬜ | ⬜ | ⬜ | |
| Auth | 3006 | ⬜ | ⬜ | ⬜ | |
| Dashboard | 3020 | ⬜ | ⬜ | ⬜ | |
| Lookups | 3005 | ⬜ | ⬜ | ⬜ | |
| Sales | 3008 | ⬜ | ⬜ | ⬜ | |
| HR | 3009 | ⬜ | ⬜ | ⬜ | |
| Recruiting | 3011 | ⬜ | ⬜ | ⬜ | |
| Stock | 3012 | ⬜ | ⬜ | ⬜ | |
| Notifications | 3013 | ⬜ | ⬜ | ⬜ | |
| Reports | 3015 | ⬜ | ⬜ | ⬜ | |
| Chatbot | 3018 | ⬜ | ⬜ | ⬜ | |
| PersonalArea | N/A | ⬜ | ⬜ | ⬜ | |
| Dashboard Editor | 3022 | ⬜ | ⬜ | ⬜ | |
| Report Editor | 3021 | ⬜ | ⬜ | ⬜ | |

### Riepilogo
- Totale servizi: 15
- Funzionanti: ___/15
- Con problemi: ___/15
- Non testabili: ___/15

## 🚀 Script di Test Automatico

Salvare come `run-tests.sh`:
```bash
#!/bin/bash
echo "🧪 Starting Portaal Frontend Tests..."
echo "======================================"

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Contatori
PASSED=0
FAILED=0

# Test funzione
test_service() {
    local name=$1
    local port=$2
    local path=${3:-"/"}
    
    echo -n "Testing $name (port $port)... "
    
    if curl -s -f -o /dev/null "http://localhost:$port$path"; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        ((FAILED++))
        return 1
    fi
}

# Run tests
test_service "Core" 3000
test_service "Common" 3003 "/remoteEntry.js"
test_service "Auth" 3006 "/remoteEntry.js"
test_service "Dashboard" 3020 "/remoteEntry.js"
test_service "Lookups" 3005 "/remoteEntry.js"
test_service "Sales" 3008 "/remoteEntry.js"
test_service "HR" 3009 "/remoteEntry.js"
test_service "Recruiting" 3011 "/remoteEntry.js"
test_service "Stock" 3012 "/remoteEntry.js"
test_service "Notifications" 3013 "/remoteEntry.js"
test_service "Reports" 3015 "/remoteEntry.js"
test_service "Chatbot" 3018 "/remoteEntry.js"

echo ""
echo "======================================"
echo "Results: $PASSED passed, $FAILED failed"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed!${NC}"
    exit 1
fi
```

## 📝 Note Importanti

1. **SEMPRE usare yarn**, mai npm
2. **Ordine di avvio importante**: Core e Common devono partire prima
3. **Verificare sempre i log** se qualcosa non funziona
4. **Browser cache**: Svuotare cache se si vedono versioni vecchie
5. **Hot reload**: Modifiche ai file dovrebbero ricaricarsi automaticamente

---

*Documento creato: 2025-08-08*
*Da aggiornare dopo ogni test con i risultati effettivi*