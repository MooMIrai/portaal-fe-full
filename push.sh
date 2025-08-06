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
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Branch di default (può essere sovrascritto con parametro)
branch="${1:-develop}"

echo -e "${BLUE}Pushing to branch: ${branch}${NC}\n"

# Contatore per repository pushati
repos_pushed=0

# Loop per eseguire git push in ogni repository
for repo in "${repos[@]}"
do
    # Spostarsi nella directory del repository
    cd "${base_dir}/${repo}" || { echo -e "${RED}Failed to access directory ${repo}${NC}"; continue; }
    
    # Verifica se ci sono commit da pushare
    if [[ -n $(git log origin/${branch}..HEAD 2>/dev/null) ]]; then
        echo -e "${YELLOW}Pushing repository: ${repo}${NC}"
        
        # Esegui git push
        if git push origin HEAD:${branch}; then
            echo -e "${GREEN}✓ Successfully pushed ${repo}${NC}"
            ((repos_pushed++))
        else
            echo -e "${RED}✗ Failed to push ${repo}${NC}"
            echo -e "${YELLOW}  You may need to pull first or resolve conflicts${NC}"
        fi
    else
        # Verifica se il branch esiste
        if git rev-parse --verify ${branch} >/dev/null 2>&1; then
            echo -e "${GREEN}Nothing to push in ${repo} (up to date)${NC}"
        else
            echo -e "${YELLOW}Branch ${branch} does not exist in ${repo}${NC}"
        fi
    fi
    
    # Tornare alla directory precedente
    cd - > /dev/null
done

echo -e "\n${GREEN}Push operation completed${NC}"
echo -e "${BLUE}Repositories pushed: ${repos_pushed}${NC}"