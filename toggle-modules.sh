#!/bin/bash

# Script to toggle between minimal and full module configuration

CONFIG_FILE="/home/mverde/src/taal/portaal-fe-full/portaal-fe-core/src/mfeConfig.ts"
MINIMAL_FILE="/home/mverde/src/taal/portaal-fe-full/portaal-fe-core/src/mfeConfig.minimal.ts"
FULL_FILE="/home/mverde/src/taal/portaal-fe-full/portaal-fe-core/src/mfeConfig.full.ts"

if [ "$1" = "minimal" ]; then
    echo "Switching to MINIMAL configuration (only auth + dashboard)..."
    cp "$MINIMAL_FILE" "$CONFIG_FILE"
    echo "✅ Switched to minimal configuration"
    echo "   Active modules: auth, dashboard"
    
elif [ "$1" = "full" ]; then
    echo "Switching to FULL configuration (all modules)..."
    if [ -f "$FULL_FILE" ]; then
        cp "$FULL_FILE" "$CONFIG_FILE"
        echo "✅ Switched to full configuration"
        echo "   Active modules: auth, lookups, sales, hr, recruiting, stock, notification, reports, chatbot, dashboard"
    else
        echo "❌ Full configuration file not found!"
    fi
    
else
    echo "Usage: $0 [minimal|full]"
    echo ""
    echo "minimal - Load only auth and dashboard modules (no errors)"
    echo "full    - Load all modules (requires all modules to be running)"
    echo ""
    echo "Current configuration:"
    if grep -q "lookups" "$CONFIG_FILE"; then
        echo "  ➡️  FULL (all modules)"
    else
        echo "  ➡️  MINIMAL (auth + dashboard only)"
    fi
fi