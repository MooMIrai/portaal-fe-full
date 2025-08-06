# Sistema di Error Tracking

## Panoramica
Il sistema di error tracking è stato implementato per catturare automaticamente tutti gli errori delle chiamate API e inviarli al supporto tecnico con informazioni dettagliate per il debugging.

## Componenti Principali

### 1. UUID Generator (`/portaal-fe-common/src/utils/uuid.ts`)
- Genera identificatori univoci per ogni richiesta
- Utilizza `crypto.randomUUID()` quando disponibile
- Fallback per browser più vecchi

### 2. Error Reporting Service (`/portaal-fe-common/src/services/ErrorReportingService.ts`)
- Gestisce la coda degli errori
- Invia report in batch per ottimizzare le performance
- Retry automatico in caso di fallimento
- Salvataggio in localStorage per errori non inviati
- Singleton pattern per gestione centralizzata

### 3. BEService Integration (`/portaal-fe-common/src/services/BEService.ts`)
- Aggiunge automaticamente `x-request-id` header a tutte le richieste
- Cattura tutti gli errori nell'interceptor
- Raccoglie informazioni di contesto (pagina, user agent, etc.)
- Calcola la durata delle richieste

## Informazioni Raccolte per Ogni Errore

### Request Info
- **Request ID**: UUID univoco per tracciare la richiesta nei log backend
- **URL**: Endpoint chiamato
- **Method**: GET, POST, PATCH, DELETE, etc.
- **Payload**: Dati inviati (JSON parsed se necessario)
- **Params**: Query parameters
- **Headers**: Headers sanitizzati (senza token/auth)

### Error Details
- **Status Code**: Codice HTTP di errore
- **Message**: Messaggio di errore
- **Stack Trace**: Stack completo dell'errore
- **Response**: Risposta completa del server

### Context
- **Page**: URL completo della pagina dove è avvenuto l'errore
- **Referrer**: Pagina di provenienza
- **User Agent**: Browser e sistema operativo
- **Screen Resolution**: Risoluzione schermo
- **Tenant**: Tenant corrente
- **Session ID**: ID sessione per raggruppare errori
- **Environment**: development/staging/production

### Performance
- **Duration**: Tempo di risposta in millisecondi
- **Connection Type**: Tipo di connessione (4g, wifi, etc.)
- **Effective Type**: Qualità effettiva della connessione

## Utilizzo

### Automatico
Il sistema si attiva automaticamente per tutti gli errori HTTP. Non è necessaria alcuna configurazione aggiuntiva.

### Test Manuale
È disponibile una suite di test in `/portaal-fe-common/src/services/ErrorReportingService.test.ts`:

```javascript
// Nel browser console:
window.testErrorReporting.runAll(); // Esegue tutti i test
window.testErrorReporting.testSingleError(); // Test singolo errore
window.testErrorReporting.testBatchErrors(); // Test batch
window.testErrorReporting.testStats(); // Mostra statistiche
```

### API Endpoint
Il servizio invia i report a: `POST /api/v1/error-reports/batch`

Formato payload:
```json
{
  "errors": [
    {
      "requestId": "uuid",
      "timestamp": "2024-01-01T00:00:00Z",
      "errorDetails": {...},
      "request": {...},
      "context": {...},
      "performance": {...}
    }
  ],
  "batchId": "batch-uuid",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Ricerca nei Log Backend
Per trovare un errore specifico nei log backend, cerca per:
- `x-request-id` header
- Il valore UUID mostrato nell'error report

Esempio query log:
```
grep "x-request-id: 123e4567-e89b-12d3-a456-426614174000" /var/log/backend.log
```

## Configurazione
- **Batch Size**: 10 errori per batch
- **Retry**: Max 3 tentativi con backoff esponenziale
- **Cache localStorage**: Max 50 errori salvati
- **Batch Delay**: 1 secondo tra batch

## Privacy e Sicurezza
- Token e authorization headers vengono rimossi automaticamente
- Cookie non vengono inviati
- Dati sensibili dovrebbero essere sanitizzati lato backend

## Manutenzione
- I report falliti vengono salvati in localStorage con chiave `failedErrorReports`
- Il servizio tenta di reinviare i report al prossimo caricamento pagina
- Monitorare la dimensione della coda con `ErrorReportingService.getStats()`