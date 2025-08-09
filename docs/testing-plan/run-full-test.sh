#!/bin/bash

# Full Test Suite per Portaal Frontend
# Esegue test completi del sistema

echo "🧪 PORTAAL FULL TEST SUITE"
echo "=========================="
echo "Started: $(date)"
echo ""

# Setup colori e variabili
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

REPORT_FILE="./TEST_RESULTS_$(date +%Y%m%d_%H%M%S).txt"
PASSED=0
FAILED=0
SKIPPED=0

# Funzione per logging
log() {
    echo "$1" | tee -a $REPORT_FILE
}

# Funzione test generico
test_generic() {
    local test_name=$1
    local command=$2
    local expected=$3
    
    log -n "  Testing $test_name... "
    
    result=$(eval $command 2>&1)
    
    if [[ $result == *"$expected"* ]]; then
        log "✅ PASS"
        ((PASSED++))
        return 0
    else
        log "❌ FAIL"
        log "    Expected: $expected"
        log "    Got: ${result:0:100}..."
        ((FAILED++))
        return 1
    fi
}

# Header report
log "======================================"
log "PORTAAL FRONTEND TEST REPORT"
log "Date: $(date)"
log "Environment: Development"
log "======================================"
log ""

# SEZIONE 1: Environment Check
log "1️⃣  ENVIRONMENT CHECK"
log "--------------------"

log -n "  Node.js version... "
node_version=$(node -v)
if [[ $node_version == v1[89]* ]] || [[ $node_version == v2* ]]; then
    log "✅ $node_version"
    ((PASSED++))
else
    log "❌ $node_version (requires >= v18)"
    ((FAILED++))
fi

log -n "  Yarn version... "
yarn_version=$(yarn -v 2>/dev/null)
if [ $? -eq 0 ]; then
    log "✅ $yarn_version"
    ((PASSED++))
else
    log "❌ Not installed"
    ((FAILED++))
fi

log -n "  PM2 version... "
pm2_version=$(pm2 -v 2>/dev/null)
if [ $? -eq 0 ]; then
    log "✅ $pm2_version"
    ((PASSED++))
else
    log "❌ Not installed"
    ((FAILED++))
fi

log ""

# SEZIONE 2: PM2 Services
log "2️⃣  PM2 SERVICES STATUS"
log "----------------------"

services=("core" "common" "auth" "dashboard" "lookups" "sales" "hr" "recruiting" "stock" "notifications" "reports" "chatbot")

for service in "${services[@]}"; do
    log -n "  $service... "
    status=$(pm2 list | grep "$service" | grep -o "online\|stopped\|errored" | head -1)
    
    if [ "$status" = "online" ]; then
        log "✅ online"
        ((PASSED++))
    elif [ "$status" = "stopped" ]; then
        log "⚠️  stopped"
        ((SKIPPED++))
    else
        log "❌ $status"
        ((FAILED++))
    fi
done

log ""

# SEZIONE 3: Port Testing
log "3️⃣  PORT AVAILABILITY"
log "-------------------"

ports=(3000 3003 3005 3006 3008 3009 3011 3012 3013 3015 3018 3020)
port_names=("Core" "Common" "Lookups" "Auth" "Sales" "HR" "Recruiting" "Stock" "Notifications" "Reports" "Chatbot" "Dashboard")

for i in "${!ports[@]}"; do
    port=${ports[$i]}
    name=${port_names[$i]}
    
    log -n "  Port $port ($name)... "
    
    if timeout 1 bash -c "cat < /dev/null > /dev/tcp/localhost/$port" 2>/dev/null; then
        log "✅ open"
        ((PASSED++))
    else
        log "❌ closed"
        ((FAILED++))
    fi
done

log ""

# SEZIONE 4: HTTP Response Testing
log "4️⃣  HTTP RESPONSE TESTING"
log "-----------------------"

for i in "${!ports[@]}"; do
    port=${ports[$i]}
    name=${port_names[$i]}
    
    log -n "  $name (http://localhost:$port)... "
    
    http_code=$(curl -s -o /dev/null -w "%{http_code}" -m 2 http://localhost:$port)
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "304" ]; then
        log "✅ $http_code"
        ((PASSED++))
    elif [ "$http_code" = "000" ]; then
        log "❌ timeout"
        ((FAILED++))
    else
        log "⚠️  $http_code"
        ((FAILED++))
    fi
done

log ""

# SEZIONE 5: Module Federation
log "5️⃣  MODULE FEDERATION"
log "-------------------"

for i in "${!ports[@]}"; do
    if [ "${ports[$i]}" = "3000" ]; then
        continue  # Skip core, no remoteEntry
    fi
    
    port=${ports[$i]}
    name=${port_names[$i]}
    
    log -n "  $name remoteEntry.js... "
    
    response=$(curl -s -m 2 http://localhost:$port/remoteEntry.js | head -c 100)
    
    if [[ $response == *"var"* ]] || [[ $response == *"function"* ]]; then
        log "✅ available"
        ((PASSED++))
    else
        log "❌ not found"
        ((FAILED++))
    fi
done

log ""

# SEZIONE 6: Build Test (Optional - takes time)
read -t 5 -p "Run build tests? (y/N - auto skip in 5s): " run_build
log ""

if [ "$run_build" = "y" ]; then
    log "6️⃣  BUILD TESTS"
    log "-------------"
    
    test_dirs=("portaal-fe-dashboard" "portaal-fe-lookUps" "portaal-fe-sales" "portaal-fe-hr" "portaal-fe-recruiting" "portaal-fe-stock" "portaal-fe-notifications" "portaal-fe-reports" "portaal-fe-chatbot")
    
    for dir in "${test_dirs[@]}"; do
        log -n "  Building $dir... "
        
        cd "$dir" 2>/dev/null
        if [ $? -ne 0 ]; then
            log "❌ directory not found"
            ((FAILED++))
            continue
        fi
        
        # Try build with timeout
        timeout 60 yarn build > /dev/null 2>&1
        result=$?
        
        if [ $result -eq 0 ]; then
            if [ -d "dist" ] && [ "$(ls -A dist)" ]; then
                size=$(du -sh dist | cut -f1)
                log "✅ success ($size)"
                ((PASSED++))
            else
                log "⚠️  no dist"
                ((FAILED++))
            fi
        elif [ $result -eq 124 ]; then
            log "⚠️  timeout"
            ((SKIPPED++))
        else
            log "❌ failed"
            ((FAILED++))
        fi
        
        cd - > /dev/null
    done
    
    log ""
else
    log "6️⃣  BUILD TESTS - SKIPPED"
    log ""
fi

# SEZIONE 7: Browser Test (usando curl per verificare contenuto)
log "7️⃣  CONTENT VERIFICATION"
log "----------------------"

log -n "  Core HTML structure... "
curl -s http://localhost:3000 | grep -q "core-root" && log "✅ found" && ((PASSED++)) || (log "❌ missing" && ((FAILED++)))

log -n "  Menu structure... "
# Questo richiede un browser reale, quindi facciamo solo check base
log "⚠️  requires browser"
((SKIPPED++))

log ""

# SEZIONE 8: Error Analysis
log "8️⃣  ERROR ANALYSIS"
log "----------------"

log -n "  PM2 error logs (last 100 lines)... "
error_count=$(pm2 logs --nostream --lines 100 2>/dev/null | grep -i "error" | wc -l)

if [ $error_count -eq 0 ]; then
    log "✅ no errors"
    ((PASSED++))
elif [ $error_count -lt 10 ]; then
    log "⚠️  $error_count errors"
    ((PASSED++))
else
    log "❌ $error_count errors"
    ((FAILED++))
fi

log ""

# SEZIONE 9: Performance Metrics
log "9️⃣  PERFORMANCE METRICS"
log "--------------------"

log -n "  Memory usage... "
mem_usage=$(free -m | awk 'NR==2{printf "%.1f", $3*100/$2}')
log "${mem_usage}%"

log -n "  CPU idle... "
cpu_idle=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print $1}')
log "${cpu_idle}%"

log -n "  Load average... "
load_avg=$(uptime | awk -F'load average:' '{print $2}')
log "$load_avg"

log ""

# RISULTATI FINALI
log "======================================"
log "📊 TEST RESULTS SUMMARY"
log "======================================"

total=$((PASSED + FAILED + SKIPPED))
pass_rate=0
if [ $total -gt 0 ]; then
    pass_rate=$((PASSED * 100 / total))
fi

log "Total tests: $total"
log -e "Passed:  ${GREEN}$PASSED${NC}"
log -e "Failed:  ${RED}$FAILED${NC}"
log -e "Skipped: ${YELLOW}$SKIPPED${NC}"
log ""
log "Pass rate: ${pass_rate}%"

# Determina stato finale
if [ $pass_rate -ge 90 ]; then
    log -e "Status: ${GREEN}EXCELLENT ✨${NC}"
    final_status=0
elif [ $pass_rate -ge 75 ]; then
    log -e "Status: ${GREEN}GOOD ✅${NC}"
    final_status=0
elif [ $pass_rate -ge 60 ]; then
    log -e "Status: ${YELLOW}ACCEPTABLE ⚠️${NC}"
    final_status=1
else
    log -e "Status: ${RED}NEEDS ATTENTION ❌${NC}"
    final_status=2
fi

log ""
log "======================================"
log "Report saved to: $REPORT_FILE"
log "Completed: $(date)"
log "======================================"
log ""

# Suggerimenti se ci sono fallimenti
if [ $FAILED -gt 0 ]; then
    log "💡 RECOMMENDATIONS:"
    log "  1. Check failed services: pm2 logs [service-name]"
    log "  2. Restart services: pm2 restart all"
    log "  3. Check troubleshooting guide: ./TROUBLESHOOTING_GUIDE.md"
    log "  4. Verify .env files configuration"
    log "  5. Clear cache and rebuild if needed"
    log ""
fi

exit $final_status