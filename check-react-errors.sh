#!/bin/bash

echo "Checking for React errors in running modules..."
echo ""

# Function to check logs for React errors
check_module_errors() {
    local log_file=$1
    local module_name=$2
    
    if [ -f "$log_file" ]; then
        echo "=== $module_name ==="
        # Check for React-related errors in last 100 lines
        if tail -100 "$log_file" | grep -iE "(react|React-DOM|Script error|conflict|singleton)" | grep -v "compiled successfully" | head -5 | grep -q .; then
            tail -100 "$log_file" | grep -iE "(react|React-DOM|Script error|conflict|singleton)" | grep -v "compiled successfully" | head -5
        else
            echo "✅ No React errors found"
        fi
        echo ""
    fi
}

# Check all module logs
check_module_errors "logs/Common-incremental.log" "Common Module"
check_module_errors "logs/Core-incremental.log" "Core Module"
check_module_errors "logs/Auth-incremental.log" "Auth Module"
check_module_errors "logs/Dashboard-incremental.log" "Dashboard Module"

# Check if modules are sharing React correctly
echo "=== Module Federation Status ==="
echo "Checking React singleton configuration..."

# Look for React loading in Core
if grep -q "eager: true" portaal-fe-core/webpack.config.js; then
    echo "✅ Core loads React eagerly (correct)"
else
    echo "❌ Core should load React eagerly"
fi

# Look for React eager:false in other modules
for module in common auth dashboard; do
    if grep -q "eager: false" portaal-fe-$module/webpack.config.js; then
        echo "✅ $module consumes React (correct)"
    else
        echo "❌ $module should consume React with eager: false"
    fi
done