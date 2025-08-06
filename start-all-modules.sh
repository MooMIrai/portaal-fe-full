#!/bin/bash

# Script to start ALL frontend modules

echo "Starting ALL Portaal Frontend Modules..."
echo "Backend URL: http://localhost:8081"
echo ""

cd "$(dirname "$0")"

# Function to start module in new terminal
start_module_terminal() {
    local dir=$1
    local name=$2
    local port=$3
    
    if [ ! -d "$dir" ]; then
        echo "Warning: Directory $dir not found - skipping"
        return 1
    fi
    
    echo "Starting $name on port $port..."
    
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

# Start all modules in order
echo "Starting Common module (required by all)..."
start_module_terminal "portaal-fe-common" "Common Module" 3003
sleep 5

echo "Starting Core module..."
start_module_terminal "portaal-fe-core" "Core Module" 3000
sleep 3

echo "Starting Auth module..."
start_module_terminal "portaal-fe-auth" "Auth Module" 3006
sleep 2

echo "Starting Lookups module..."
start_module_terminal "portaal-fe-lookUps" "Lookups Module" 3005
sleep 2

echo "Starting Sales module..."
start_module_terminal "portaal-fe-sales" "Sales Module" 3008
sleep 2

echo "Starting HR module..."
start_module_terminal "portaal-fe-hr" "HR Module" 3009
sleep 2

echo "Starting Recruiting module..."
start_module_terminal "portaal-fe-recruiting" "Recruiting Module" 3011
sleep 2

echo "Starting Stock module..."
start_module_terminal "portaal-fe-stock" "Stock Module" 3012
sleep 2

echo "Starting Notifications module..."
start_module_terminal "portaal-fe-notifications" "Notifications Module" 3013
sleep 2

echo "Starting Reports module..."
start_module_terminal "portaal-fe-reports" "Reports Module" 3015
sleep 2

echo "Starting Chatbot module..."
start_module_terminal "portaal-fe-chatbot" "Chatbot Module" 3018
sleep 2

echo "Starting Dashboard module..."
start_module_terminal "portaal-fe-dashboard" "Dashboard Module" 3014
sleep 2

echo "Starting Dashboard Editor module..."
start_module_terminal "portaal-fe-dashboard-editor" "Dashboard Editor Module" 3022
sleep 2

echo ""
echo "All modules starting!"
echo ""
echo "Module URLs:"
echo "- Core (Main app): http://localhost:3000"
echo "- Common: http://localhost:3003"
echo "- Auth: http://localhost:3006"
echo "- Lookups: http://localhost:3005"
echo "- Sales: http://localhost:3008"
echo "- HR: http://localhost:3009"
echo "- Recruiting: http://localhost:3011"
echo "- Stock: http://localhost:3012"
echo "- Notifications: http://localhost:3013"
echo "- Reports: http://localhost:3015"
echo "- Chatbot: http://localhost:3018"
echo "- Dashboard: http://localhost:3014"
echo "- Dashboard Editor: http://localhost:3022"
echo ""
echo "Access the application at: http://localhost:3000"
echo "Dashboard available at: http://localhost:3000/dashboard"
echo "Dashboard Editor available at: http://localhost:3000/dashboard-editor"
echo ""
echo "Backend should be running at: http://localhost:8081"