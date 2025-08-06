#!/bin/bash

# Script per avviare tutti i microservizi con yarn
# Evita il problema dei nomi dei workspace

echo "Avvio di tutti i microservizi..."

# Array dei microservizi da avviare (in ordine)
declare -A services=(
    ["portaal-fe-common"]=3003
    ["portaal-fe-auth"]=3006
    ["portaal-fe-lookUps"]=3005
    ["portaal-fe-sales"]=3008
    ["portaal-fe-hr"]=3009
    ["portaal-fe-recruiting"]=3011
    ["portaal-fe-stock"]=3012
    ["portaal-fe-notifications"]=3013
    ["portaal-fe-reports"]=3015
    ["portaal-fe-chatbot"]=3018
    ["portaal-fe-dashboard"]=3020
    ["portaal-fe-reporteditor"]=3021
    ["portaal-fe-dashboard-editor"]=3022
    ["portaal-fe-core"]=3000
)

# Funzione per avviare un servizio
start_service() {
    local service=$1
    local port=${services[$service]}
    
    echo "Avvio $service sulla porta $port..."
    cd "$service" && yarn start:live &
    cd ..
}

# Cambio directory al root del progetto
cd "$(dirname "$0")"

# Avvio prima common e auth (necessari)
start_service "portaal-fe-common"
sleep 2
start_service "portaal-fe-auth"
sleep 2

# Avvio tutti gli altri microservizi
for service in "${!services[@]}"; do
    if [[ "$service" != "portaal-fe-common" && "$service" != "portaal-fe-auth" && "$service" != "portaal-fe-core" ]]; then
        start_service "$service"
        sleep 1
    fi
done

# Avvio core per ultimo
sleep 3
start_service "portaal-fe-core"

echo ""
echo "Tutti i microservizi sono stati avviati!"
echo "Applicazione principale: http://localhost:3000"
echo ""
echo "Per fermare tutti i servizi, usa: pkill -f 'yarn start:live'"