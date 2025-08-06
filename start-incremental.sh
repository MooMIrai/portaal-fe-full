#!/bin/bash

echo "Starting modules incrementally with fixed React configuration..."
echo ""

cd "$(dirname "$0")"

# Create logs directory
mkdir -p logs

# Function to start module and wait
start_and_wait() {
    local dir=$1
    local name=$2
    local port=$3
    local wait_time=$4
    
    echo ""
    echo "Starting $name on port $port..."
    cd "$dir"
    nohup yarn start > "../logs/${name}-incremental.log" 2>&1 &
    cd ..
    
    echo "Waiting $wait_time seconds for $name to initialize..."
    sleep $wait_time
    
    # Check if port is listening
    if lsof -i :$port | grep -q LISTEN; then
        echo "✅ $name is running on port $port"
    else
        echo "❌ $name failed to start on port $port"
        echo "Check logs/${name}-incremental.log for errors"
        return 1
    fi
}

# Kill all webpack processes first
echo "Stopping all webpack processes..."
pkill -f webpack 2>/dev/null
sleep 3

# Start modules incrementally
echo "=== Phase 1: Common Module ==="
if ! start_and_wait "portaal-fe-common" "Common" 3003 15; then
    echo "Failed to start Common module. Aborting."
    exit 1
fi

echo ""
echo "=== Phase 2: Core Module (Host) ==="
if ! start_and_wait "portaal-fe-core" "Core" 3000 15; then
    echo "Failed to start Core module. Aborting."
    exit 1
fi

echo ""
echo "=== Phase 3: Auth Module ==="
if ! start_and_wait "portaal-fe-auth" "Auth" 3006 10; then
    echo "Warning: Auth module failed to start, but continuing..."
fi

echo ""
echo "=== Phase 4: Dashboard Module ==="
if ! start_and_wait "portaal-fe-dashboard" "Dashboard" 3014 10; then
    echo "Warning: Dashboard module failed to start"
fi

echo ""
echo "=== All modules started ==="
echo ""
echo "Module status:"
for port in 3003 3000 3006 3014; do
    if lsof -i :$port | grep -q LISTEN; then
        echo "✅ Port $port is active"
    else
        echo "❌ Port $port is NOT active"
    fi
done

echo ""
echo "Access the application at: http://localhost:3000"
echo ""
echo "With the new configuration:"
echo "- React is loaded eagerly only in Core (host)"
echo "- All other modules consume React from Core"
echo "- Strict version checking is enabled"
echo "- Webpack overlays are disabled"