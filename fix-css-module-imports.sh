#\!/bin/bash

# Fix CSS module imports to use namespace import instead of default
find . -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" | while read file; do
  if grep -q "import styles from.*\.module\.scss" "$file" 2>/dev/null; then
    echo "Fixing: $file"
    sed -i "s/import styles from \(.*\.module\.scss.*\)/import * as styles from \1/" "$file"
  fi
done

echo "CSS module imports fixed\!"
