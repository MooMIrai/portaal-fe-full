#!/bin/bash

# Script to install dependencies for all modules

echo "Installing dependencies for all Portaal Frontend Modules..."
echo ""

cd "$(dirname "$0")"

# Function to install dependencies
install_deps() {
    local dir=$1
    local name=$2
    
    if [ ! -d "$dir" ]; then
        echo "Warning: Directory $dir not found - skipping"
        return 1
    fi
    
    echo "Installing dependencies for $name..."
    cd "$dir"
    
    # Install webpack-dev-server if missing
    if ! grep -q "webpack-dev-server" package.json; then
        echo "Adding webpack-dev-server to $name..."
        yarn add --dev webpack-dev-server@^4.11.1
    fi
    
    # Clean install
    yarn install
    
    cd ..
    echo "✓ $name dependencies installed"
    echo ""
}

# Install for all modules
install_deps "portaal-fe-common" "Common"
install_deps "portaal-fe-core" "Core"
install_deps "portaal-fe-auth" "Auth"
install_deps "portaal-fe-dashboard" "Dashboard"
install_deps "portaal-fe-stock" "Stock"
install_deps "portaal-fe-notifications" "Notifications"
install_deps "portaal-fe-lookUps" "Lookups"
install_deps "portaal-fe-sales" "Sales"
install_deps "portaal-fe-hr" "HR"
install_deps "portaal-fe-recruiting" "Recruiting"
install_deps "portaal-fe-reports" "Reports"
install_deps "portaal-fe-chatbot" "Chatbot"

echo "All dependencies installed!"
echo ""
echo "You can now run ./start-dashboard-fixed.sh to start the application"