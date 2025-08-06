#!/bin/bash

# Script combinato per add, commit e push su tutti i repository

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
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Verifica se è stato fornito un messaggio di commit
if [ -z "$1" ]; then
    echo -e "${RED}Error: Please provide a commit message${NC}"
    echo "Usage: ./git-all.sh \"Your commit message\" [branch]"
    echo "Example: ./git-all.sh \"feat: implement collapsible menu\" develop"
    exit 1
fi

# Parametri
commit_message="$1"
branch="${2:-develop}"

echo -e "${CYAN}==================================================${NC}"
echo -e "${CYAN}Git Operations for All Repositories${NC}"
echo -e "${CYAN}==================================================${NC}"
echo -e "${BLUE}Commit message: \"${commit_message}\"${NC}"
echo -e "${BLUE}Target branch: ${branch}${NC}\n"

# Contatori
repos_modified=0
repos_committed=0
repos_pushed=0

# Loop per ogni repository
for repo in "${repos[@]}"
do
    echo -e "${CYAN}--------------------------------------------------${NC}"
    echo -e "${CYAN}Processing: ${repo}${NC}"
    echo -e "${CYAN}--------------------------------------------------${NC}"
    
    # Spostarsi nella directory del repository
    cd "${base_dir}/${repo}" || { echo -e "${RED}Failed to access directory ${repo}${NC}"; continue; }
    
    # 1. GIT ADD
    if [[ -n $(git status --porcelain) ]]; then
        echo -e "${YELLOW}[ADD] Adding changes...${NC}"
        git add .
        echo -e "${GREEN}✓ Added all changes${NC}"
        ((repos_modified++))
        
        # 2. GIT COMMIT
        echo -e "${YELLOW}[COMMIT] Committing changes...${NC}"
        git commit -m "${commit_message}"
        echo -e "${GREEN}✓ Committed changes${NC}"
        ((repos_committed++))
        
        # 3. GIT PUSH
        echo -e "${YELLOW}[PUSH] Pushing to ${branch}...${NC}"
        if git push origin HEAD:${branch}; then
            echo -e "${GREEN}✓ Successfully pushed${NC}"
            ((repos_pushed++))
        else
            echo -e "${RED}✗ Failed to push (may need to pull first)${NC}"
        fi
    else
        echo -e "${GREEN}No changes in this repository${NC}"
    fi
    
    # Tornare alla directory precedente
    cd - > /dev/null
    echo ""
done

# Riepilogo finale
echo -e "${CYAN}==================================================${NC}"
echo -e "${CYAN}Summary${NC}"
echo -e "${CYAN}==================================================${NC}"
echo -e "${BLUE}Repositories with changes: ${repos_modified}${NC}"
echo -e "${BLUE}Repositories committed: ${repos_committed}${NC}"
echo -e "${BLUE}Repositories pushed: ${repos_pushed}${NC}"

if [ ${repos_pushed} -lt ${repos_committed} ]; then
    echo -e "\n${YELLOW}⚠ Some repositories failed to push. You may need to:${NC}"
    echo -e "${YELLOW}  1. Run: ./pull.sh${NC}"
    echo -e "${YELLOW}  2. Resolve any conflicts${NC}"
    echo -e "${YELLOW}  3. Run: ./push.sh${NC}"
fi

echo -e "\n${GREEN}✓ All operations completed${NC}"