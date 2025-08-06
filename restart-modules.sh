#!/bin/bash

# Script to restart problematic modules

echo "Restarting problematic modules..."

# Kill processes on specific ports
echo "Stopping modules on ports 3012 and 3013..."
for port in 3012 3013; do
    pid=$(lsof -ti:$port)
    if [ ! -z "$pid" ]; then
        echo "Killing process on port $port (PID: $pid)"
        kill -9 $pid 2>/dev/null
    fi
done

sleep 2

cd "$(dirname "$0")"

# Function to start module in background with proper error handling
start_module() {
    local dir=$1
    local port=$2
    local name=$3
    
    if [ ! -d "$dir" ]; then
        echo "Error: Directory $dir not found!"
        return 1
    fi
    
    echo "Starting $name on port $port..."
    
    cd "$dir"
    
    # Clear cache if it exists
    if [ -d ".cache" ]; then
        echo "Clearing cache for $name..."
        rm -rf .cache
    fi
    
    # Start with error output
    nohup yarn start > "../logs/${name}.log" 2>&1 &
    echo "$name started, check logs/$(basename "$name").log for output"
    
    cd ..
}

# Create logs directory if it doesn't exist
mkdir -p logs

# Restart the problematic modules
start_module "portaal-fe-stock" 3012 "Stock Module"
sleep 3
start_module "portaal-fe-notifications" 3013 "Notifications Module"

echo ""
echo "Modules restarted. Check the logs directory for any errors."
echo ""
echo "If errors persist, try:"
echo "1. Clear node_modules and reinstall: cd portaal-fe-stock && rm -rf node_modules && yarn install"
echo "2. Check for port conflicts: lsof -i :3012,3013"
echo "3. Verify webpack configurations match other working modules"