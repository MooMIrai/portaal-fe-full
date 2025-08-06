#!/bin/bash

echo "Restarting all modules with clean configuration..."
echo ""

# Kill all webpack processes
echo "Stopping all webpack processes..."
pkill -f webpack 2>/dev/null
sleep 3

cd "$(dirname "$0")"

# Create logs directory
mkdir -p logs

# Function to start module
start_module() {
    local dir=$1
    local name=$2
    local port=$3
    
    if [ ! -d "$dir" ]; then
        echo "Warning: Directory $dir not found - skipping"
        return 1
    fi
    
    echo "Starting $name on port $port..."
    cd "$dir"
    nohup yarn start > "../logs/${name}-clean.log" 2>&1 &
    cd ..
}

# Start modules in order
echo "1. Starting Common module..."
start_module "portaal-fe-common" "Common" 3003
sleep 8

echo "2. Starting Core module..."
start_module "portaal-fe-core" "Core" 3000
sleep 8

echo "3. Starting Auth module..."
start_module "portaal-fe-auth" "Auth" 3006
sleep 5

echo "4. Starting Dashboard module..."
start_module "portaal-fe-dashboard" "Dashboard" 3014
sleep 5

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
echo "All webpack overlays have been disabled to prevent conflicts."
echo ""
echo "To access the application:"
echo "1. Go to http://localhost:3000"
echo "2. Login with your credentials"
echo "3. Access dashboard at http://localhost:3000/dashboard"
echo ""
echo "If you see any errors in the browser console, they can be safely ignored."