#!/bin/bash

# Script to start ONLY the essential modules for dashboard

echo "Starting minimal setup for Dashboard..."
echo "This will start only: common, core, and dashboard modules"
echo ""

# First, kill ALL webpack processes to avoid conflicts
echo "Stopping all webpack processes..."
pkill -f webpack
sleep 2

cd "$(dirname "$0")"

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

# Start only essential modules
echo "1. Starting Common module (required)..."
start_module "portaal-fe-common" "Common" 3003
echo "   Waiting for Common to initialize..."
sleep 10

echo "2. Starting Core module..."
start_module "portaal-fe-core" "Core" 3000
echo "   Waiting for Core to initialize..."
sleep 8

echo "3. Starting Dashboard module..."
start_module "portaal-fe-dashboard" "Dashboard" 3014
sleep 5

echo ""
echo "✅ Minimal setup complete!"
echo ""
echo "Access points:"
echo "- Main app: http://localhost:3000"
echo "- Dashboard: http://localhost:3000/dashboard"
echo "- Common: http://localhost:3003"
echo "- Dashboard direct: http://localhost:3014"
echo ""
echo "⚠️  Note: Other modules (auth, hr, sales, etc.) are NOT running."
echo "   You will see errors for missing modules - this is expected."
echo ""
echo "If you still see React conflicts, try:"
echo "1. Clear browser cache and reload"
echo "2. Open browser console and disable 'Pause on exceptions'"
echo "3. Access dashboard directly: http://localhost:3014"