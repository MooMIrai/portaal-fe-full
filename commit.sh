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

# Verifica se è stato fornito un messaggio di commit
if [ -z "$1" ]; then
    echo -e "${RED}Error: Please provide a commit message${NC}"
    echo "Usage: ./commit.sh \"Your commit message\""
    exit 1
fi

# Messaggio di commit
commit_message="$1"

echo -e "${BLUE}Commit message: \"${commit_message}\"${NC}\n"

# Contatore per repository con modifiche
repos_committed=0

# Loop per eseguire git commit in ogni repository
for repo in "${repos[@]}"
do
    # Spostarsi nella directory del repository
    cd "${base_dir}/${repo}" || { echo -e "${RED}Failed to access directory ${repo}${NC}"; continue; }
    
    # Verifica se ci sono modifiche staged
    if [[ -n $(git diff --cached --name-only) ]]; then
        echo -e "${YELLOW}Committing changes in repository: ${repo}${NC}"
        git commit -m "${commit_message}"
        echo -e "${GREEN}✓ Committed changes in ${repo}${NC}"
        ((repos_committed++))
    else
        # Verifica se ci sono modifiche non staged
        if [[ -n $(git status --porcelain) ]]; then
            echo -e "${YELLOW}Warning: ${repo} has unstaged changes (run add.sh first)${NC}"
        else
            echo -e "${GREEN}No changes to commit in ${repo}${NC}"
        fi
    fi
    
    # Tornare alla directory precedente
    cd - > /dev/null
done

echo -e "\n${GREEN}Commit operation completed${NC}"
echo -e "${BLUE}Repositories committed: ${repos_committed}${NC}"