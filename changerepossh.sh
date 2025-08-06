#!/bin/bash

# Lista delle directory dei repository
repositories=("portaal-fe-auth" "portaal-fe-common" "portaal-fe-core" "portaal-fe-hr" "portaal-fe-lookUps" "portaal-fe-personalarea" "portaal-fe-recruiting" "portaal-fe-sales")

# Base URL per i repository SSH
base_url="taal@vs-ssh.visualstudio.com:v3/taal/Portaal.js/"

# Loop attraverso ogni directory di repository
for repo in "${repositories[@]}"; do
  # Cambia directory nel repository
  cd "$repo" || exit
  
  # Cambia l'URL del remote 'origin'
  git remote set-url origin "${base_url}${repo}"
  
  # Stampa conferma della modifica
  echo "URL di ${repo} è stato cambiato in SSH."
  
  # Torna alla directory di partenza
  cd ..
done

echo "Tutti gli URL sono stati aggiornati."
