#!/bin/bash

# Script per ripristinare gli stash creati durante la migrazione CSS Modules

timestamp="${1:-20250808_132533}"

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Restoring CSS Modules Migration stashes${NC}"
echo -e "${BLUE}Timestamp: ${timestamp}${NC}\n"

# Restore main directory
echo -e "${YELLOW}Restoring main directory stash...${NC}"
main_stash=$(git stash list | grep "CSS_MODULES_MIGRATION_BACKUP_MAIN" | head -1 | awk -F: '{print $1}')
if [ -n "$main_stash" ]; then
    if git stash apply "$main_stash"; then
        echo -e "${GREEN}✓ Main directory restored${NC}"
    else
        echo -e "${RED}✗ Failed to restore main directory${NC}"
    fi
else
    echo -e "${YELLOW}No main directory stash found${NC}"
fi

# Array of repositories
repos=(
    "portaal-fe-common"
    "portaal-fe-core"
    "portaal-fe-dashboard"
    "portaal-fe-dashboard-editor"
    "portaal-fe-reporteditor"
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

repos_restored=0

# Restore each repository
for repo in "${repos[@]}"; do
    if [ -d "$repo" ]; then
        cd "$repo"
        echo -e "${YELLOW}Restoring ${repo}...${NC}"
        
        stash_name="CSS_MODULES_MIGRATION_${repo}_${timestamp}"
        repo_stash=$(git stash list | grep "$stash_name" | head -1 | awk -F: '{print $1}')
        
        if [ -n "$repo_stash" ]; then
            if git stash apply "$repo_stash" 2>/dev/null; then
                echo -e "${GREEN}✓ ${repo} restored${NC}"
                ((repos_restored++))
            else
                echo -e "${RED}✗ Failed to restore ${repo}${NC}"
            fi
        else
            echo -e "${YELLOW}No stash found for ${repo}${NC}"
        fi
        
        cd ..
    fi
done

echo -e "\n${GREEN}Rollback operation completed${NC}"
echo -e "${BLUE}Repositories restored: ${repos_restored}${NC}"

# Additional cleanup
echo -e "\n${YELLOW}Cleaning up backup files...${NC}"
find . -name "*.backup" -type f | while read file; do
    echo -e "Found backup: $file"
done

echo -e "\n${GREEN}Rollback completed!${NC}"
echo -e "${YELLOW}Remember to:${NC}"
echo -e "  1. Check git status: git status"
echo -e "  2. Restart services: yarn stop && yarn start:dev"
echo -e "  3. Verify no CSS conflicts in browser console"