#!/bin/bash

# Array di directory dei repository
repos=(
    "portaal-fe-common"
    "portaal-fe-core"
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

# Percorso di base dove si trovano le cartelle dei repository (modifica se necessario)
base_dir="."

# Loop per eseguire npm install e npm run build in ogni repository
for repo in "${repos[@]}"
do
    # Spostarsi nella directory del repository
    cd "${base_dir}/${repo}" || { echo "Failed to access directory ${repo}"; continue; }

    # Esegui npm install
    #echo "Installing dependencies for repository: ${repo}"
    #npm install

    # Esegui npm run build
    echo "Building repository: ${repo}"
    yarn build

    # Tornare alla directory precedente
    cd - > /dev/null
done
