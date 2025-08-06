# Caricamento Selettivo dei Microservizi

Questa funzionalità permette di scegliere quali microservizi caricare all'avvio dell'applicazione, utile per lo sviluppo e il testing quando non tutti i microservizi sono necessari.

## Configurazione

### 1. Variabile d'ambiente ENABLED_MFES

Nel file `.env.development` del core, puoi specificare quali microservizi abilitare usando la variabile `ENABLED_MFES`:

```env
# Lascia vuoto per abilitare tutti i microservizi (default)
ENABLED_MFES=

# Oppure specifica solo quelli che vuoi abilitare (separati da virgola)
ENABLED_MFES=lookups,sales,dashboard,reports

# I microservizi 'common' e 'auth' sono sempre abilitati automaticamente
```

### 2. Microservizi disponibili

I seguenti microservizi possono essere abilitati/disabilitati:
- `lookups` - Gestione lookup data
- `sales` - Modulo vendite
- `hr` - Risorse umane
- `recruiting` - Reclutamento
- `stock` - Magazzino/inventario
- `notifications` - Notifiche (nota: usare `notifications` con la 's')
- `reports` - Report
- `dashboard` - Dashboard
- `chatbot` - Chatbot
- `reporteditor` - Query Report Editor
- `dashboardeditor` - Dashboard Editor
- `personalarea` - Area Personale

**Nota:** `common` e `auth` sono sempre abilitati in quanto essenziali per il funzionamento dell'applicazione.

## Come usare

### Esempio 1: Abilitare solo alcuni microservizi

Per lavorare solo con sales e dashboard:

1. Modifica `.env.development`:
   ```env
   ENABLED_MFES=sales,dashboard
   ```

2. Riavvia tutti i servizi con PM2:
   ```bash
   yarn stop
   yarn start:dev
   ```

**Nota importante:** PM2 avvierà comunque tutti i microservizi definiti in `ecosystem.config.js`, ma solo quelli specificati in `ENABLED_MFES` saranno caricati e accessibili nell'applicazione. I servizi non abilitati verranno avviati ma non utilizzati dal core.

### Esempio 2: Abilitare tutti i microservizi (default)

Lascia `ENABLED_MFES` vuoto o commentato:
```env
ENABLED_MFES=
# oppure
# ENABLED_MFES=
```

## Gestione con PM2

Il progetto utilizza PM2 per gestire tutti i microservizi. I comandi disponibili sono:

- `yarn start:dev` - Avvia tutti i servizi in modalità development
- `yarn start:live` - Avvia tutti i servizi in modalità production
- `yarn stop` - Ferma tutti i servizi
- `yarn restart` - Riavvia tutti i servizi
- `yarn delete` - Rimuove tutti i servizi da PM2
- `yarn logs` - Visualizza i log di tutti i servizi del namespace `portaal-fe`

### Gestione singoli servizi

Se vuoi gestire un singolo servizio con PM2:

```bash
# Fermare un singolo servizio
pm2 stop dashboard-editor

# Riavviare un singolo servizio
pm2 restart core

# Vedere i log di un singolo servizio
pm2 logs dashboard
```

## Gestione degli errori

Se un microservizio abilitato non è in esecuzione:
- L'applicazione mostrerà un messaggio di errore nell'interfaccia
- Il menu del microservizio non apparirà
- Le route del microservizio mostreranno un componente di errore

## Vantaggi

1. **Sviluppo più veloce**: Non devi avviare tutti i microservizi
2. **Risparmio risorse**: Meno processi Node.js in esecuzione
3. **Testing isolato**: Puoi testare specifici microservizi
4. **Debug semplificato**: Meno log e complessità

## Note tecniche

- La configurazione viene letta durante il build del webpack
- Richiede il riavvio del core per applicare le modifiche
- I microservizi non abilitati non vengono caricati nel bundle
- Il file `mfeConfig.ts` viene generato automaticamente basandosi sui microservizi abilitati