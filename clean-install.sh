#!/bin/bash

echo "Cleaning and reinstalling all modules..."
echo ""

cd "$(dirname "$0")"

# Stop all webpack processes
echo "Stopping all webpack processes..."
pkill -f webpack 2>/dev/null
sleep 2

# Function to clean and install
clean_install() {
    local dir=$1
    local name=$2
    
    if [ ! -d "$dir" ]; then
        echo "Warning: Directory $dir not found - skipping"
        return 1
    fi
    
    echo ""
    echo "=== Cleaning $name ==="
    cd "$dir"
    
    # Remove node_modules and lock files
    echo "Removing node_modules and lock files..."
    rm -rf node_modules
    rm -f yarn.lock package-lock.json
    
    # Clean yarn cache
    yarn cache clean
    
    # Install fresh
    echo "Installing dependencies..."
    yarn install
    
    cd ..
}

# Clean and install all modules
clean_install "portaal-fe-common" "Common Module"
clean_install "portaal-fe-core" "Core Module"
clean_install "portaal-fe-auth" "Auth Module"
clean_install "portaal-fe-dashboard" "Dashboard Module"

echo ""
echo "All modules cleaned and reinstalled!"
echo ""
echo "Run ./restart-clean.sh to start the modules"