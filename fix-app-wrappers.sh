#!/bin/bash

# Script per ripristinare i file App.tsx originali
# Il wrapper CSS non è necessario per Module Federation

services=(
  "portaal-fe-reporteditor"
  "portaal-fe-lookUps"
  "portaal-fe-sales"
  "portaal-fe-hr"
  "portaal-fe-recruiting"
  "portaal-fe-stock"
  "portaal-fe-notifications"
  "portaal-fe-reports"
  "portaal-fe-chatbot"
  "portaal-fe-personalarea"
)

for service in "${services[@]}"; do
  app_file="$service/src/App.tsx"
  original_file="$service/src/OriginalApp.tsx"
  
  if [ -f "$original_file" ]; then
    echo "Ripristinando $service..."
    
    # Rimuovi il wrapper App.tsx
    rm -f "$app_file"
    
    # Ripristina il file originale
    mv "$original_file" "$app_file"
    
    echo "  ✓ Ripristinato App.tsx originale per $service"
  else
    echo "  - Nessun OriginalApp.tsx trovato per $service"
  fi
done

echo ""
echo "✅ Ripristino completato!"
echo "I wrapper CSS non sono necessari perché PostCSS applica già i prefix a livello globale."