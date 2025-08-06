#!/bin/bash

# Script to start frontend modules in development mode

echo "Starting Portaal Frontend Development Environment..."
echo "Backend URL: http://localhost:8081"
echo ""

# Change to script directory
cd "$(dirname "$0")"

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "Warning: Port $port is already in use!"
        return 1
    fi
    return 0
}

# Function to start module
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
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo "Installing dependencies for $name..."
        yarn install
    fi
    
    # Start in background
    yarn start > "../logs/${name}.log" 2>&1 &
    local pid=$!
    echo "$pid" > "../logs/${name}.pid"
    
    cd ..
    
    echo "$name started with PID $pid"
}

# Create logs directory
mkdir -p logs

# Check required ports
echo "Checking ports..."
check_port 3003 || echo "Common module port in use"
check_port 3000 || echo "Core module port in use"  
check_port 3014 || echo "Dashboard module port in use"

echo ""

# Start modules in order
start_module "portaal-fe-common" 3003 "Common Module"
sleep 5  # Common needs to be fully started first

start_module "portaal-fe-core" 3000 "Core Module"
sleep 3

start_module "portaal-fe-dashboard" 3014 "Dashboard Module"

echo ""
echo "All modules started!"
echo ""
echo "Logs are available in the 'logs' directory"
echo ""
echo "Access points:"
echo "- Main application: http://localhost:3000"
echo "- Dashboard: http://localhost:3000/dashboard"
echo "- Common module: http://localhost:3003"
echo "- Dashboard module: http://localhost:3014"
echo ""
echo "To stop all modules, run: ./stop-dev.sh"