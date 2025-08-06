#!/bin/bash

# Script to start only essential modules for dashboard development

echo "Starting Dashboard Development Environment..."
echo "Backend URL: http://localhost:8081"
echo ""

cd "$(dirname "$0")"

# Function to start module in new terminal
start_module_terminal() {
    local dir=$1
    local name=$2
    
    if [ ! -d "$dir" ]; then
        echo "Error: Directory $dir not found!"
        return 1
    fi
    
    echo "Starting $name..."
    
    # Try different terminal emulators
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal --tab --title="$name" -- bash -c "cd $dir && yarn install && yarn start; exec bash"
    elif command -v konsole &> /dev/null; then
        konsole --new-tab -e bash -c "cd $dir && yarn install && yarn start; exec bash" &
    elif command -v xterm &> /dev/null; then
        xterm -title "$name" -e "cd $dir && yarn install && yarn start; bash" &
    else
        echo "No terminal emulator found. Starting in background..."
        (cd "$dir" && yarn install && yarn start) &
    fi
}

# Start only essential modules
echo "Starting Common module (required)..."
start_module_terminal "portaal-fe-common" "Common Module"

echo "Waiting for Common module to start..."
sleep 10

echo "Starting Core module..."
start_module_terminal "portaal-fe-core" "Core Module"

echo "Waiting for Core module to start..."
sleep 10

echo "Starting Dashboard module..."
start_module_terminal "portaal-fe-dashboard" "Dashboard Module"

echo ""
echo "Essential modules started!"
echo ""
echo "Access points:"
echo "- Main application: http://localhost:3000"
echo "- Dashboard: http://localhost:3000/dashboard"
echo ""
echo "Note: Other modules (auth, hr, sales, etc.) are not running."
echo "The application will show errors for missing modules, but dashboard should work."