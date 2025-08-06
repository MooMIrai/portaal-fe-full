#!/bin/bash

# Script to start dashboard with webpack overlay fixes

echo "Starting Dashboard with webpack overlay fixes..."
echo "Backend URL: http://localhost:8081"
echo ""

# Kill all webpack processes
echo "Stopping all webpack processes..."
pkill -f webpack
sleep 2

cd "$(dirname "$0")"

# Clear caches
echo "Clearing module caches..."
find portaal-fe-* -name ".cache" -type d -exec rm -rf {} + 2>/dev/null
find portaal-fe-* -name "dist" -type d -exec rm -rf {} + 2>/dev/null

# Create logs directory
mkdir -p logs

# Function to start module
start_module() {
    local dir=$1
    local name=$2
    local port=$3
    
    if [ ! -d "$dir" ]; then
        echo "Error: Directory $dir not found!"
        return 1
    fi
    
    echo "Starting $name on port $port..."
    
    # Start in new terminal
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal --tab --title="$name" -- bash -c "cd $dir && yarn start 2>&1 | tee ../logs/${name}.log; exec bash"
    elif command -v xterm &> /dev/null; then
        xterm -title "$name" -e "cd $dir && yarn start 2>&1 | tee ../logs/${name}.log; bash" &
    else
        echo "Starting $name in background..."
        (cd "$dir" && yarn start > "../logs/${name}.log" 2>&1) &
    fi
}

# Start modules in order
echo "1. Starting Common module..."
start_module "portaal-fe-common" "Common" 3003
echo "   Waiting for Common to initialize..."
sleep 10

echo "2. Starting Core module (with overlay fix)..."
start_module "portaal-fe-core" "Core" 3000
echo "   Waiting for Core to initialize..."
sleep 10

echo "3. Starting Auth module (required for login)..."
start_module "portaal-fe-auth" "Auth" 3006
sleep 5

echo "4. Starting Dashboard module..."
start_module "portaal-fe-dashboard" "Dashboard" 3014
sleep 5

echo "5. Starting Stock module (with overlay disabled)..."
start_module "portaal-fe-stock" "Stock" 3012
sleep 5

# Optional: Start other modules if needed
echo ""
echo "✅ Core modules started with webpack overlay fixes!"
echo ""
echo "Access points:"
echo "- Main app: http://localhost:3000"
echo "- Dashboard: http://localhost:3000/dashboard (after login)"
echo ""
echo "To access the dashboard:"
echo "1. Go to http://localhost:3000"
echo "2. Login with your credentials"
echo "3. Navigate to Dashboard from the menu or go to http://localhost:3000/dashboard"
echo ""
echo "If you still see errors:"
echo "1. Clear browser cache (Ctrl+Shift+Delete)"
echo "2. Open DevTools and disable 'Pause on exceptions'"
echo "3. Try accessing dashboard directly: http://localhost:3014"