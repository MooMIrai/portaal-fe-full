#!/bin/bash

echo "Fixing and starting all modules..."
echo ""

# Kill all webpack processes first
echo "Stopping all webpack processes..."
pkill -f webpack
sleep 2

cd "$(dirname "$0")"

# Function to fix and start module
fix_and_start() {
    local dir=$1
    local name=$2
    local port=$3
    
    if [ ! -d "$dir" ]; then
        echo "Warning: Directory $dir not found - skipping"
        return 1
    fi
    
    echo ""
    echo "=== Fixing $name module ==="
    cd "$dir"
    
    # Check if node_modules exists, if not install
    if [ ! -d "node_modules" ] || [ ! -f "node_modules/.bin/webpack" ]; then
        echo "Installing dependencies for $name..."
        yarn install
    fi
    
    # Start in background
    echo "Starting $name on port $port..."
    nohup yarn start > "../logs/${name}-fixed.log" 2>&1 &
    
    cd ..
    sleep 5
}

# Create logs directory
mkdir -p logs

# Fix and start modules in order
fix_and_start "portaal-fe-common" "Common" 3003
fix_and_start "portaal-fe-core" "Core" 3000
fix_and_start "portaal-fe-auth" "Auth" 3006
fix_and_start "portaal-fe-dashboard" "Dashboard" 3014

echo ""
echo "Waiting for modules to start..."
sleep 10

echo ""
echo "Checking module status..."
echo ""

# Check which ports are listening
for port in 3003 3000 3006 3014; do
    if lsof -i :$port | grep -q LISTEN; then
        echo "✅ Port $port is active"
    else
        echo "❌ Port $port is NOT active"
    fi
done

echo ""
echo "To access the application:"
echo "1. Go to http://localhost:3000"
echo "2. Login with your credentials"
echo "3. Access dashboard at http://localhost:3000/dashboard"
echo ""
echo "Check logs in the 'logs' directory if any module fails to start."