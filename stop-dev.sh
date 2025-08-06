#!/bin/bash

# Script to stop all frontend modules

echo "Stopping Portaal Frontend Development Environment..."

cd "$(dirname "$0")"

# Function to stop module
stop_module() {
    local name=$1
    local pidfile="logs/${name}.pid"
    
    if [ -f "$pidfile" ]; then
        local pid=$(cat "$pidfile")
        if kill -0 $pid 2>/dev/null; then
            echo "Stopping $name (PID: $pid)..."
            kill $pid
            rm "$pidfile"
        else
            echo "$name was not running (stale PID file)"
            rm "$pidfile"
        fi
    else
        echo "$name was not running"
    fi
}

# Stop all modules
stop_module "Dashboard Module"
stop_module "Core Module"
stop_module "Common Module"

# Also kill any remaining node processes on our ports
echo ""
echo "Cleaning up any remaining processes..."
for port in 3000 3003 3014; do
    pid=$(lsof -ti:$port)
    if [ ! -z "$pid" ]; then
        echo "Killing process on port $port (PID: $pid)"
        kill $pid 2>/dev/null
    fi
done

echo ""
echo "All modules stopped!"