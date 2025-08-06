# Elenco Microservizi Portaal Frontend

## Core Application (Host)

| Nome | Percorso | Porta | URL | Descrizione |
|------|----------|-------|-----|-------------|
| **portaal-fe-core** | `/home/mverde/src/taal/portaal-fe-full/portaal-fe-core` | `3000` | http://localhost:3000 | Applicazione principale che carica tutti i microfrontend |

## Microservizi

| Nome | Percorso | Porta | URL | Module Name | Descrizione |
|------|----------|-------|-----|-------------|-------------|
| **portaal-fe-common** | `/home/mverde/src/taal/portaal-fe-full/portaal-fe-common` | `3003` | http://localhost:3003 | `common` | Componenti e servizi condivisi (sempre abilitato) |
| **portaal-fe-auth** | `/home/mverde/src/taal/portaal-fe-full/portaal-fe-auth` | `3006` | http://localhost:3006 | `auth` | Autenticazione e login (sempre abilitato) |
| **portaal-fe-lookUps** | `/home/mverde/src/taal/portaal-fe-full/portaal-fe-lookUps` | `3005` | http://localhost:3005 | `lookups` | Gestione dati lookup |
| **portaal-fe-personalarea** | `/home/mverde/src/taal/portaal-fe-full/portaal-fe-personalarea` | `3007` | http://localhost:3007 | `personalarea` | Area personale (non integrato nel core) |
| **portaal-fe-sales** | `/home/mverde/src/taal/portaal-fe-full/portaal-fe-sales` | `3008` | http://localhost:3008 | `sales` | Modulo vendite |
| **portaal-fe-hr** | `/home/mverde/src/taal/portaal-fe-full/portaal-fe-hr` | `3009` | http://localhost:3009 | `hr` | Risorse umane |
| **portaal-fe-recruiting** | `/home/mverde/src/taal/portaal-fe-full/portaal-fe-recruiting` | `3011` | http://localhost:3011 | `recruiting` | Reclutamento |
| **portaal-fe-stock** | `/home/mverde/src/taal/portaal-fe-full/portaal-fe-stock` | `3012` | http://localhost:3012 | `stock` | Magazzino/Inventario |
| **portaal-fe-notifications** | `/home/mverde/src/taal/portaal-fe-full/portaal-fe-notifications` | `3013` | http://localhost:3013 | `notification` | Notifiche |
| **portaal-fe-reports** | `/home/mverde/src/taal/portaal-fe-full/portaal-fe-reports` | `3015` | http://localhost:3015 | `reports` | Report |
| **portaal-fe-chatbot** | `/home/mverde/src/taal/portaal-fe-full/portaal-fe-chatbot` | `3018` | http://localhost:3018 | `chatbot` | Chatbot |
| **portaal-fe-dashboard** | `/home/mverde/src/taal/portaal-fe-full/portaal-fe-dashboard` | `3020` | http://localhost:3020 | `dashboard` | Dashboard |
| **portaal-fe-reporteditor** | `/home/mverde/src/taal/portaal-fe-full/portaal-fe-reporteditor` | `3021` | http://localhost:3021 | `reporteditor` | Query Report Editor |

## Comandi di Avvio

### Avviare un singolo microservizio

```bash
cd [percorso_microservizio]
yarn install  # solo la prima volta o dopo modifiche a package.json
yarn start
```

### Avviare tutti i microservizi

```bash
# In terminali separati, eseguire per ogni microservizio:
cd /home/mverde/src/taal/portaal-fe-full/portaal-fe-[nome]
yarn start
```

### Avviare solo microservizi selezionati

Con la configurazione `ENABLED_MFES` in `.env.development`, puoi specificare quali microservizi caricare.

**Esempio**: Per avviare solo sales e dashboard:

1. Configura `.env.development` nel core:
   ```env
   ENABLED_MFES=sales,dashboard
   ```

2. Avvia i servizi necessari:
   ```bash
   # Terminal 1 - Common (sempre necessario)
   cd /home/mverde/src/taal/portaal-fe-full/portaal-fe-common
   yarn start

   # Terminal 2 - Auth (sempre necessario)
   cd /home/mverde/src/taal/portaal-fe-full/portaal-fe-auth
   yarn start

   # Terminal 3 - Sales
   cd /home/mverde/src/taal/portaal-fe-full/portaal-fe-sales
   yarn start

   # Terminal 4 - Dashboard
   cd /home/mverde/src/taal/portaal-fe-full/portaal-fe-dashboard
   yarn start

   # Terminal 5 - Core (avviare per ultimo)
   cd /home/mverde/src/taal/portaal-fe-full/portaal-fe-core
   yarn start
   ```

## Script Utili

### Script per avviare tutti i microservizi (bash)

Crea un file `start-all.sh`:

```bash
#!/bin/bash

# Array dei microservizi
services=(
    "portaal-fe-common"
    "portaal-fe-auth"
    "portaal-fe-lookUps"
    "portaal-fe-sales"
    "portaal-fe-hr"
    "portaal-fe-recruiting"
    "portaal-fe-stock"
    "portaal-fe-notifications"
    "portaal-fe-reports"
    "portaal-fe-chatbot"
    "portaal-fe-dashboard"
    "portaal-fe-reporteditor"
    "portaal-fe-core"
)

# Avvia ogni servizio in un nuovo terminale
for service in "${services[@]}"
do
    echo "Avviando $service..."
    gnome-terminal --tab --title="$service" -- bash -c "cd /home/mverde/src/taal/portaal-fe-full/$service && yarn start; exec bash"
done
```

### Script per fermare tutti i servizi

```bash
#!/bin/bash
# Ferma tutti i processi Node.js sulle porte dei microservizi
for port in 3000 3003 3005 3006 3007 3008 3009 3011 3012 3013 3015 3018 3020 3021
do
    pid=$(lsof -ti:$port)
    if [ ! -z "$pid" ]; then
        echo "Fermando processo sulla porta $port (PID: $pid)"
        kill -9 $pid
    fi
done
```

## Note

- **common** e **auth** sono sempre necessari e vengono caricati automaticamente
- **personalarea** esiste ma non è integrato nel core
- L'ordine di avvio consigliato è: common → auth → altri microservizi → core
- Ogni microservizio può essere sviluppato e testato indipendentemente
- Le porte devono essere libere prima di avviare i servizi