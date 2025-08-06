#!/bin/bash

# Array di directory dei repository
repos=(
    "portaal-fe-common"
    "portaal-fe-core"
    "portaal-fe-dashboard"
    "portaal-fe-hr"
    "portaal-fe-lookUps"
    "portaal-fe-personalarea"
    "portaal-fe-recruiting"
    "portaal-fe-sales"
    "portaal-fe-auth"
    "portaal-fe-stock"
    "portaal-fe-notifications"
    "portaal-fe-reports"
    "portaal-fe-chatbot"
)

# Percorso di base dove si trovano le cartelle dei repository
base_dir="."

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Loop per eseguire git add in ogni repository
for repo in "${repos[@]}"
do
    # Spostarsi nella directory del repository
    cd "${base_dir}/${repo}" || { echo -e "${RED}Failed to access directory ${repo}${NC}"; continue; }
    
    # Verifica se ci sono modifiche
    if [[ -n $(git status --porcelain) ]]; then
        echo -e "${YELLOW}Adding changes in repository: ${repo}${NC}"
        git add .
        echo -e "${GREEN}✓ Added all changes in ${repo}${NC}"
        
        # Mostra un riepilogo delle modifiche aggiunte
        git status --short
    else
        echo -e "${GREEN}No changes to add in ${repo}${NC}"
    fi
    
    # Tornare alla directory precedente
    cd - > /dev/null
done

echo -e "${GREEN}Add operation completed for all repositories${NC}"