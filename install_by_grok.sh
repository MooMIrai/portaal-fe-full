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
)

# Percorso di base dove si trovano le cartelle dei repository (modifica se necessario)
base_dir="."

# Loop per eseguire yarn install e altre operazioni in ogni repository
for repo in "${repos[@]}"
do
    # Spostarsi nella directory del repository
    cd "${base_dir}/${repo}" || { echo "Failed to access directory ${repo}"; continue; }

    # Esegui yarn install
    echo "Installing dependencies for repository: ${repo}"
    yarn install || { echo "yarn install failed for ${repo}"; cd - > /dev/null; continue; }

    # Esegui attivazione licenza Kendo solo per portaal-fe-common
    if [ "$repo" = "portaal-fe-common" ]; then
        echo "Activating Kendo license for ${repo}"
        yarn run activate || { echo "yarn run activate failed for ${repo}"; cd - > /dev/null; continue; }
    fi

    # Esegui yarn build (scommentalo se necessario)
    # echo "Building repository: ${repo}"
    # yarn build || { echo "yarn build failed for ${repo}"; cd - > /dev/null; continue; }

    # Tornare alla directory precedente
    cd - > /dev/null
done
