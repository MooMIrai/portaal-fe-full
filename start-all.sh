#!/bin/bash

# Script to start all frontend modules for development

echo "Starting all frontend modules..."

# Array of modules to start
modules=(
    "portaal-fe-common:3003"
    "portaal-fe-core:3000"
    "portaal-fe-dashboard:3014"
)

# Function to start a module
start_module() {
    local module_dir=$(echo $1 | cut -d':' -f1)
    local port=$(echo $1 | cut -d':' -f2)
    
    echo "Starting $module_dir on port $port..."
    
    # Check if directory exists
    if [ -d "$module_dir" ]; then
        # Start the module in a new terminal tab/window
        gnome-terminal --tab --title="$module_dir" -- bash -c "cd $module_dir && yarn install && yarn start; exec bash" 2>/dev/null || \
        xterm -title "$module_dir" -e "cd $module_dir && yarn install && yarn start; bash" &
    else
        echo "Error: Directory $module_dir not found!"
    fi
}

# Change to the correct directory
cd "$(dirname "$0")"

# Start each module
for module in "${modules[@]}"; do
    start_module "$module"
    sleep 2  # Give each module time to start
done

echo "All modules started!"
echo ""
echo "Access the application at: http://localhost:3000"
echo "Dashboard available at: http://localhost:3000/dashboard"
echo ""
echo "Backend should be running at: http://localhost:8081"