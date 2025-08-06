#!/bin/bash

echo "=== Final Test for React Conflicts ==="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if all services are running
echo "1. Checking Module Status:"
for port in 3000 3003 3006 3014; do
    if lsof -i :$port | grep -q LISTEN; then
        echo -e "   ${GREEN}✓${NC} Port $port is active"
    else
        echo -e "   ${RED}✗${NC} Port $port is NOT active"
    fi
done

echo ""
echo "2. Checking Main Application:"
MAIN_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$MAIN_RESPONSE" = "200" ]; then
    echo -e "   ${GREEN}✓${NC} Main application is responding (HTTP $MAIN_RESPONSE)"
else
    echo -e "   ${RED}✗${NC} Main application error (HTTP $MAIN_RESPONSE)"
fi

echo ""
echo "3. Checking Module Federation Configuration:"
# Check if minimal config is active
if grep -q "lookups" /home/mverde/src/taal/portaal-fe-full/portaal-fe-core/src/mfeConfig.ts; then
    echo -e "   ${RED}✗${NC} Full config active (may cause errors for missing modules)"
else
    echo -e "   ${GREEN}✓${NC} Minimal config active (only auth + dashboard)"
fi

echo ""
echo "4. Checking Webpack Configurations:"
# Check React eager loading
if grep -q "eager: true" /home/mverde/src/taal/portaal-fe-full/portaal-fe-core/webpack.config.js; then
    echo -e "   ${GREEN}✓${NC} Core loads React eagerly"
else
    echo -e "   ${RED}✗${NC} Core missing eager React loading"
fi

# Check overlay disabled
OVERLAY_COUNT=$(grep -l "overlay: false" /home/mverde/src/taal/portaal-fe-full/portaal-fe-*/webpack.config.js | wc -l)
echo -e "   ${GREEN}✓${NC} Webpack overlay disabled in $OVERLAY_COUNT modules"

echo ""
echo "5. Testing Dashboard Route:"
DASHBOARD_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/dashboard)
if [ "$DASHBOARD_RESPONSE" = "200" ]; then
    echo -e "   ${GREEN}✓${NC} Dashboard route is accessible (HTTP $DASHBOARD_RESPONSE)"
else
    echo -e "   ${RED}✗${NC} Dashboard route error (HTTP $DASHBOARD_RESPONSE)"
fi

echo ""
echo "6. Checking for Script Errors:"
# Check if dashboard HTML contains error patterns
ERRORS=$(curl -s http://localhost:3000/dashboard | grep -i "error\|failed" | wc -l)
if [ "$ERRORS" -eq 0 ]; then
    echo -e "   ${GREEN}✓${NC} No error patterns in dashboard HTML"
else
    echo -e "   ${RED}✗${NC} Found $ERRORS error patterns in dashboard HTML"
fi

echo ""
echo "=== Summary ==="
echo "To access the dashboard:"
echo "1. Go to http://localhost:3000"
echo "2. Login with: mverde@taal.it / Karazan\$123"
echo "3. Navigate to http://localhost:3000/dashboard"
echo ""
echo "If you see React errors in the browser console:"
echo "- Clear browser cache (Ctrl+Shift+Delete)"
echo "- Disable 'Pause on exceptions' in DevTools"
echo "- Try incognito/private mode"