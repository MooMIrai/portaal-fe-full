#!/bin/bash

# Health Check Script per Portaal Frontend
# Esegue verifiche rapide del sistema

echo "🏥 PORTAAL HEALTH CHECK"
echo "======================="
echo "Data: $(date)"
echo ""

# Colori
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contatori
PASSED=0
FAILED=0
WARNINGS=0

# Funzione per test
check() {
    local name=$1
    local command=$2
    local expected=$3
    
    echo -n "Checking $name... "
    
    result=$(eval $command 2>&1)
    
    if [[ $result == *"$expected"* ]]; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        echo "  Expected: $expected"
        echo "  Got: $result" | head -1
        ((FAILED++))
        return 1
    fi
}

# Funzione per test porta
check_port() {
    local name=$1
    local port=$2
    
    echo -n "Port $port ($name)... "
    
    if timeout 1 bash -c "cat < /dev/null > /dev/tcp/localhost/$port" 2>/dev/null; then
        echo -e "${GREEN}✅ OPEN${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}❌ CLOSED${NC}"
        ((FAILED++))
        return 1
    fi
}

# Test PM2
echo "1️⃣  PM2 Services Check"
echo "----------------------"
pm2_services=$(pm2 list | grep portaal-fe | grep online | wc -l)
pm2_total=$(pm2 list | grep portaal-fe | wc -l)
echo "Services online: $pm2_services/$pm2_total"

if [ $pm2_services -ge 10 ]; then
    echo -e "${GREEN}✅ PM2 services OK${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  Some services not online${NC}"
    ((WARNINGS++))
    pm2 list | grep portaal-fe | grep -v online
fi
echo ""

# Test Porte
echo "2️⃣  Port Availability Check"
echo "--------------------------"
check_port "Core" 3000
check_port "Common" 3003
check_port "Auth" 3006
check_port "Dashboard" 3020
check_port "Lookups" 3005
check_port "Sales" 3008
check_port "HR" 3009
check_port "Recruiting" 3011
check_port "Stock" 3012
check_port "Notifications" 3013
check_port "Reports" 3015
check_port "Chatbot" 3018
echo ""

# Test HTTP Response
echo "3️⃣  HTTP Response Check"
echo "----------------------"
http_code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
echo -n "Core application (http://localhost:3000)... "
if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ $http_code OK${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ $http_code${NC}"
    ((FAILED++))
fi

# Test Module Federation
echo ""
echo "4️⃣  Module Federation Check"
echo "--------------------------"
for port in 3003 3006 3020 3005 3008 3009 3011 3012 3013 3015 3018; do
    service_name=""
    case $port in
        3003) service_name="Common" ;;
        3006) service_name="Auth" ;;
        3020) service_name="Dashboard" ;;
        3005) service_name="Lookups" ;;
        3008) service_name="Sales" ;;
        3009) service_name="HR" ;;
        3011) service_name="Recruiting" ;;
        3012) service_name="Stock" ;;
        3013) service_name="Notifications" ;;
        3015) service_name="Reports" ;;
        3018) service_name="Chatbot" ;;
    esac
    
    echo -n "$service_name remoteEntry.js... "
    
    if curl -s http://localhost:$port/remoteEntry.js | head -1 | grep -q "var"; then
        echo -e "${GREEN}✅${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC}"
        ((FAILED++))
    fi
done

# Check Logs per errori
echo ""
echo "5️⃣  Error Log Check"
echo "------------------"
error_count=$(pm2 logs --nostream --lines 100 2>/dev/null | grep -i "error" | wc -l)
echo -n "Recent errors in logs: "
if [ $error_count -lt 10 ]; then
    echo -e "${GREEN}$error_count (OK)${NC}"
    ((PASSED++))
elif [ $error_count -lt 50 ]; then
    echo -e "${YELLOW}$error_count (Warning)${NC}"
    ((WARNINGS++))
else
    echo -e "${RED}$error_count (Critical)${NC}"
    ((FAILED++))
fi

# Memory check
echo ""
echo "6️⃣  System Resources"
echo "-------------------"
mem_usage=$(free -m | awk 'NR==2{printf "%.1f", $3*100/$2}')
echo -n "Memory usage: ${mem_usage}%... "
if (( $(echo "$mem_usage < 80" | bc -l) )); then
    echo -e "${GREEN}OK${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}High${NC}"
    ((WARNINGS++))
fi

# Risultati finali
echo ""
echo "======================================"
echo "📊 HEALTH CHECK RESULTS"
echo "======================================"
echo -e "Passed:   ${GREEN}$PASSED${NC}"
echo -e "Failed:   ${RED}$FAILED${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"

# Calcola score
total=$((PASSED + FAILED))
if [ $total -gt 0 ]; then
    score=$((PASSED * 100 / total))
else
    score=0
fi

echo ""
echo -n "Health Score: $score% - "

if [ $score -ge 90 ]; then
    echo -e "${GREEN}EXCELLENT ✨${NC}"
    exit_code=0
elif [ $score -ge 70 ]; then
    echo -e "${GREEN}GOOD ✅${NC}"
    exit_code=0
elif [ $score -ge 50 ]; then
    echo -e "${YELLOW}FAIR ⚠️${NC}"
    exit_code=1
else
    echo -e "${RED}POOR ❌${NC}"
    exit_code=2
fi

# Suggerimenti
if [ $FAILED -gt 0 ]; then
    echo ""
    echo "💡 Suggestions:"
    echo "  - Run: pm2 logs --lines 100"
    echo "  - Check: ./docs/testing-plan/TROUBLESHOOTING_GUIDE.md"
    echo "  - Try: pm2 restart all"
fi

echo ""
echo "======================================"
echo "Check completed at $(date +%H:%M:%S)"
echo ""

exit $exit_code