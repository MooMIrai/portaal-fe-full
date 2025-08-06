# PM2 Setup per Portaal Frontend

## ⚠️ IMPORTANTE: Prima di iniziare

**Riavvia il servizio impazza-report-costi** se è stato fermato:
```bash
cd /home/mverde/src/valerio/impazza_report_costi
pm2 start
```

## Panoramica

Questo progetto usa PM2 con namespace isolato "portaal" per gestire tutti i microservizi frontend senza interferire con altri servizi PM2 sulla macchina.

## Comandi disponibili

### Gestione servizi Portaal

```bash
# Avviare tutti i microservizi Portaal
yarn pm2:start

# Fermare tutti i microservizi Portaal (SOLO quelli con namespace "portaal")
yarn pm2:stop

# Riavviare tutti i microservizi Portaal
yarn pm2:restart

# Eliminare tutti i microservizi Portaal da PM2
yarn pm2:delete

# Vedere lo stato dei microservizi Portaal
yarn pm2:status

# Vedere i log in tempo reale dei microservizi Portaal
yarn pm2:logs

# Monitor interattivo (solo servizi Portaal)
yarn pm2:monit
```

## Microservizi e porte

| Servizio | Porta | Nome PM2 |
|----------|-------|----------|
| Core | 3000 | portaal-core |
| Common | 3003 | portaal-common |
| Auth | 3006 | portaal-auth |
| Lookups | 3005 | portaal-lookups |
| Sales | 3008 | portaal-sales |
| HR | 3009 | portaal-hr |
| Recruiting | 3011 | portaal-recruiting |
| Stock | 3012 | portaal-stock |
| Notifications | 3013 | portaal-notifications |
| Reports | 3015 | portaal-reports |
| Chatbot | 3018 | portaal-chatbot |
| Dashboard | 3020 | portaal-dashboard |
| Report Editor | 3021 | portaal-reporteditor |
| Dashboard Editor | 3022 | portaal-dashboard-editor |

## Log

I log sono salvati in `logs/pm2/`:
- `{service}-out.log` - Output standard
- `{service}-error.log` - Errori
- `{service}-combined.log` - Tutti i log

## Troubleshooting

### Se i servizi non si avviano

1. Controlla che tutte le dipendenze siano installate:
   ```bash
   yarn install
   ```

2. Controlla i log di errore:
   ```bash
   yarn pm2:logs
   ```

3. Verifica che le porte non siano già in uso:
   ```bash
   lsof -i :3000,3003,3005,3006,3008,3009,3011,3012,3013,3015,3018,3020,3021,3022
   ```

### Se hai fermato accidentalmente altri servizi

I comandi PM2 di questo progetto operano SOLO sui servizi con namespace "portaal". 
Se hai usato `pm2 delete all` per errore, riavvia manualmente gli altri servizi.

## Note importanti

1. **Namespace isolation**: Tutti i servizi Portaal usano il namespace "portaal"
2. **Nessuna interferenza**: I comandi non toccano servizi in altri namespace
3. **Log separati**: Ogni microservizio ha i propri file di log
4. **Memory limits**: Ogni servizio ha un limite di memoria configurato

## Avvio rapido

```bash
# Prima volta
yarn install
yarn pm2:start

# Vedere lo stato
yarn pm2:status

# Vedere i log
yarn pm2:logs

# Fermare tutto (solo Portaal)
yarn pm2:stop
```

L'applicazione sarà disponibile su http://localhost:3000