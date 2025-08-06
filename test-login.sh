#!/bin/bash

# Test login and dashboard access

echo "Testing login and dashboard access..."
echo ""

# Base URL
BASE_URL="http://localhost:3000"
AUTH_URL="http://localhost:3006"

# Login credentials
USERNAME="mverde@taal.it"
PASSWORD="Karazan\$123"

# Test if services are up
echo "1. Checking services..."
for port in 3000 3003 3006 3014; do
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:$port | grep -q "200\|304"; then
        echo "   ✅ Port $port is responding"
    else
        echo "   ❌ Port $port is NOT responding"
    fi
done

echo ""
echo "2. Testing main page..."
MAIN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL)
echo "   Main page status: $MAIN_STATUS"

echo ""
echo "3. Testing dashboard route..."
DASHBOARD_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/dashboard)
echo "   Dashboard route status: $DASHBOARD_STATUS"

echo ""
echo "To login manually:"
echo "1. Go to $BASE_URL"
echo "2. Use credentials:"
echo "   Username: $USERNAME"
echo "   Password: $PASSWORD"
echo "3. After login, go to $BASE_URL/dashboard"