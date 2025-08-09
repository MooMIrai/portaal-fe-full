#!/bin/bash

# Script per correggere i webpack.config.js con variabili isDevelopment/isProduction fuori scope

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
  webpack_file="$service/webpack.config.js"
  
  if [ -f "$webpack_file" ]; then
    echo "Correzione $webpack_file..."
    
    # Sostituisci isDevelopment con argv.mode === 'development'
    sed -i "s/isDevelopment ? /argv.mode === 'development' ? /g" "$webpack_file"
    
    # Sostituisci isProduction con argv.mode === 'production'
    sed -i "s/isProduction ? /argv.mode === 'production' ? /g" "$webpack_file"
    
    # Sostituisci !isDevelopment con argv.mode !== 'development'
    sed -i "s/!isDevelopment/argv.mode !== 'development'/g" "$webpack_file"
    
    # Sostituisci !isProduction con argv.mode !== 'production'
    sed -i "s/!isProduction/argv.mode !== 'production'/g" "$webpack_file"
    
    # Sostituisci isDevelopment && con argv.mode === 'development' &&
    sed -i "s/isDevelopment &&/argv.mode === 'development' \&\&/g" "$webpack_file"
    
    # Sostituisci isProduction && con argv.mode === 'production' &&
    sed -i "s/isProduction &&/argv.mode === 'production' \&\&/g" "$webpack_file"
    
    echo "  ✓ Corretto $webpack_file"
  fi
done

echo "Correzione completata!"