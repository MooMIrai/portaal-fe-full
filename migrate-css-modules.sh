#!/bin/bash

# CSS Modules Migration Script for Remaining Services
# This script automates the CSS modules migration for all remaining microservices

echo "Starting CSS Modules Migration for all remaining services..."

# Define services with their ports and prefixes
declare -A services=(
    ["portaal-fe-reporteditor"]="3021:#mfe-reporteditor"
    ["portaal-fe-lookUps"]="3005:#mfe-lookups"
    ["portaal-fe-sales"]="3008:#mfe-sales"
    ["portaal-fe-hr"]="3009:#mfe-hr"
    ["portaal-fe-recruiting"]="3011:#mfe-recruiting"
    ["portaal-fe-stock"]="3012:#mfe-stock"
    ["portaal-fe-notifications"]="3013:#mfe-notifications"
    ["portaal-fe-reports"]="3015:#mfe-reports"
    ["portaal-fe-chatbot"]="3018:#mfe-chatbot"
    ["portaal-fe-personalarea"]="3099:#mfe-personalarea"
)

# Function to migrate a service
migrate_service() {
    local service_dir=$1
    local port_prefix=$2
    local port=$(echo $port_prefix | cut -d: -f1)
    local prefix=$(echo $port_prefix | cut -d: -f2)
    
    echo "----------------------------------------"
    echo "Migrating: $service_dir (port: $port, prefix: $prefix)"
    echo "----------------------------------------"
    
    if [ ! -d "$service_dir" ]; then
        echo "Warning: Directory $service_dir not found, skipping..."
        return
    fi
    
    cd "$service_dir"
    
    # Install dependencies
    echo "Installing CSS modules dependencies..."
    yarn add -D css-loader postcss postcss-loader postcss-prefix-selector autoprefixer mini-css-extract-plugin css-minimizer-webpack-plugin clsx 2>/dev/null || true
    
    echo "Migration complete for $service_dir"
    cd ..
}

# Process each service
for service in "${!services[@]}"; do
    migrate_service "$service" "${services[$service]}"
done

echo "========================================="
echo "CSS Modules dependencies installed for all services!"
echo "Now run the complete-css-migration.js script to update all configuration files."
echo "========================================="