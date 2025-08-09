# CSS Modules Migration - Rollback Procedure

## Backup Information

### Stash Created
- **Main Directory Stash**: `CSS_MODULES_MIGRATION_BACKUP_MAIN_20250808_132447`
- **Timestamp**: 2025-08-08 13:24:47

### Microservices Stashes
- **portaal-fe-dashboard-editor**: `CSS_MODULES_MIGRATION_portaal-fe-dashboard-editor_20250808_132533`
- **portaal-fe-reporteditor**: `CSS_MODULES_MIGRATION_portaal-fe-reporteditor_20250808_132533`
- **Timestamp**: 2025-08-08 13:25:33

## Rollback Procedures

### Method 1: Complete Rollback (Recommended)

Execute the rollback script:
```bash
./restore-stash.sh 20250808_132533
```

Or manually restore:

1. **Restore main directory**:
```bash
git stash list  # Find the stash with CSS_MODULES_MIGRATION_BACKUP_MAIN
git stash apply stash@{n}  # Replace n with the stash index
```

2. **Restore each microservice**:
```bash
cd portaal-fe-dashboard-editor
git stash list
git stash apply stash@{n}  # Apply the CSS_MODULES_MIGRATION stash
cd ..

cd portaal-fe-reporteditor
git stash list
git stash apply stash@{n}  # Apply the CSS_MODULES_MIGRATION stash
cd ..
```

### Method 2: Selective Rollback

To rollback only specific services:

1. **Identify the service to rollback**
2. **Navigate to service directory**:
```bash
cd portaal-fe-[service-name]
```

3. **Restore webpack.config.js**:
```bash
mv webpack.config.js.backup webpack.config.js
```

4. **Remove postcss.config.js**:
```bash
rm postcss.config.js
```

5. **Revert CSS modules**:
```bash
# Find all .module.css files and rename back
find src -name "*.module.css" -exec bash -c 'mv "$0" "${0%.module.css}.css"' {} \;
find src -name "*.module.scss" -exec bash -c 'mv "$0" "${0%.module.scss}.scss"' {} \;
```

6. **Remove TypeScript definitions**:
```bash
rm src/css-modules.d.ts
```

7. **Reinstall original dependencies**:
```bash
npm uninstall clsx postcss-prefix-selector mini-css-extract-plugin css-minimizer-webpack-plugin
npm install
```

### Method 3: Git Reset (Nuclear Option)

⚠️ **WARNING**: This will lose all uncommitted changes

```bash
# In main directory
git reset --hard HEAD

# In each microservice
for repo in portaal-fe-*; do
  cd $repo
  git reset --hard HEAD
  cd ..
done
```

## Restore Script

Create `restore-stash.sh`:

```bash
#!/bin/bash

timestamp="${1:-20250808_132533}"

# Restore main directory
echo "Restoring main directory stash..."
git stash list | grep "CSS_MODULES_MIGRATION_BACKUP_MAIN" | head -1 | awk -F: '{print $1}' | xargs git stash apply

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

# Restore each repository
for repo in "${repos[@]}"; do
    if [ -d "$repo" ]; then
        cd "$repo"
        echo "Restoring $repo..."
        stash_name="CSS_MODULES_MIGRATION_${repo}_${timestamp}"
        git stash list | grep "$stash_name" | head -1 | awk -F: '{print $1}' | xargs git stash apply 2>/dev/null
        cd ..
    fi
done

echo "Rollback completed!"
```

## Verification After Rollback

1. **Check git status**:
```bash
git status
./git-all.sh status
```

2. **Verify services start correctly**:
```bash
yarn stop
yarn start:dev
```

3. **Check for CSS conflicts**:
- Open browser developer tools
- Check console for CSS errors
- Verify styles are applied correctly

## Emergency Contacts

If rollback fails, backup files are preserved:
- All `webpack.config.js.backup` files in each service
- Git stashes remain available until explicitly dropped

## Notes

- Migration started: 2025-08-08 13:24
- Services modified will have `.backup` files
- CSS Module TypeScript definitions can be safely removed
- Dependencies added during migration can be uninstalled without breaking existing code

---

**Document created**: 2025-08-08
**Migration ID**: CSS_MODULES_MIGRATION_20250808