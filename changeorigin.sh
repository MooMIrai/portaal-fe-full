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
)

# Percorso di base dove si trovano le cartelle dei repository (modifica se necessario)
base_dir="."

# Loop per eseguire git pull in ogni repository
for repo in "${repos[@]}"
do
    # Spostarsi nella directory del repository
    cd "${base_dir}/${repo}" || { echo "Failed to access directory ${repo}"; continue; }

    # Esegui git pull
    echo "Updating repository: ${repo}"
    git remote set-url origin "taal@vs-ssh.visualstudio.com:v3/taal/Portaal.js/${repo}"

    # Tornare alla directory precedente
    cd - > /dev/null
done
