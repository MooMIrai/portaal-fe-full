#!/bin/bash
# Simple context monitoring helper

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Claude Context Monitor${NC}"
echo "========================"
echo ""

# Check if .claude directory exists
if [ ! -d ".claude" ]; then
    echo -e "${RED}❌ Error: .claude directory not found${NC}"
    echo "   Please run this script from the project root."
    exit 1
fi

# Check checkpoint directory
echo -e "${YELLOW}📁 Checkpoint Status${NC}"
echo "-------------------"

if [ -d ".claude/checkpoints" ]; then
    # Count checkpoints
    CHECKPOINT_COUNT=$(find .claude/checkpoints -maxdepth 1 -name "*.md" 2>/dev/null | grep -v example | grep -v README | wc -l)
    ARCHIVE_COUNT=$(find .claude/checkpoints/archive -name "*.md" 2>/dev/null | wc -l)
    
    echo -e "📊 Active checkpoints: ${GREEN}$CHECKPOINT_COUNT${NC}"
    echo -e "📦 Archived checkpoints: ${YELLOW}$ARCHIVE_COUNT${NC}"
    
    # Check latest checkpoint
    LATEST=$(ls -t .claude/checkpoints/*.md 2>/dev/null | grep -v example | grep -v README | head -1)
    if [ -n "$LATEST" ]; then
        LATEST_NAME=$(basename "$LATEST")
        # Get file modification time (cross-platform)
        if [[ "$OSTYPE" == "darwin"* ]]; then
            LATEST_DATE=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M" "$LATEST" 2>/dev/null)
        else
            LATEST_DATE=$(stat -c "%y" "$LATEST" 2>/dev/null | cut -d' ' -f1-2 | cut -d'.' -f1)
        fi
        
        echo -e "\n📄 Latest checkpoint:"
        echo -e "   Name: ${GREEN}$LATEST_NAME${NC}"
        echo -e "   Created: $LATEST_DATE"
        
        # Show brief summary from checkpoint
        echo -e "\n   Summary:"
        grep -A 2 "## Progress Summary" "$LATEST" 2>/dev/null | tail -2 | sed 's/^/   /'
    else
        echo -e "\n${YELLOW}⚠️  No checkpoints found${NC}"
    fi
else
    echo -e "${RED}❌ Checkpoint directory not found${NC}"
fi

# Check session summaries
echo -e "\n${YELLOW}📋 Session Summaries${NC}"
echo "-------------------"

if [ -d ".claude/sessions" ]; then
    SESSION_COUNT=$(find .claude/sessions -name "*.md" 2>/dev/null | wc -l)
    echo -e "📝 Git-tracked summaries: ${GREEN}$SESSION_COUNT${NC}"
    
    # Show recent sessions
    if [ $SESSION_COUNT -gt 0 ]; then
        echo -e "\nRecent sessions:"
        ls -t .claude/sessions/*.md 2>/dev/null | head -3 | while read session; do
            echo -e "   - $(basename "$session")"
        done
    fi
else
    echo -e "${YELLOW}⚠️  No session directory found${NC}"
fi

# Check last session info
echo -e "\n${YELLOW}🕒 Last Session Info${NC}"
echo "-------------------"

if [ -f ".claude/last-session.yaml" ]; then
    # Extract key information
    DATE=$(grep "date:" .claude/last-session.yaml | cut -d':' -f2- | xargs)
    WORK=$(grep "main_work:" .claude/last-session.yaml | cut -d':' -f2- | xargs)
    TASK=$(grep "next_task:" .claude/last-session.yaml | cut -d':' -f2- | xargs)
    FILES=$(grep "files_touched:" .claude/last-session.yaml | cut -d':' -f2 | xargs)
    
    if [ "$DATE" != "null" ] && [ -n "$DATE" ]; then
        echo -e "📅 Date: ${GREEN}$DATE${NC}"
        echo -e "💼 Last work: $WORK"
        echo -e "📝 Next task: $TASK"
        echo -e "📁 Files touched: $FILES"
    else
        echo -e "${YELLOW}No previous session recorded${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  last-session.yaml not found${NC}"
fi

# Check disk usage
echo -e "\n${YELLOW}💾 Disk Usage${NC}"
echo "-------------"

if [ -d ".claude" ]; then
    TOTAL_SIZE=$(du -sh .claude 2>/dev/null | cut -f1)
    echo -e "Total .claude directory: ${GREEN}$TOTAL_SIZE${NC}"
    
    if [ -d ".claude/checkpoints" ]; then
        CHECKPOINT_SIZE=$(du -sh .claude/checkpoints 2>/dev/null | cut -f1)
        echo -e "Checkpoints: $CHECKPOINT_SIZE"
    fi
fi

# System health check
echo -e "\n${YELLOW}🏥 System Health${NC}"
echo "---------------"

# Check if agent files exist
AGENT_COUNT=$(find .claude/agents -name "*.md" 2>/dev/null | wc -l)
echo -e "🤖 Configured agents: ${GREEN}$AGENT_COUNT${NC}"

# Check key files
echo -e "\n📋 Key files:"
[ -f ".claude/project-config.md" ] && echo -e "   ✅ project-config.md" || echo -e "   ❌ project-config.md"
[ -f ".claude/agents/portaal-fe-specialist.md" ] && echo -e "   ✅ portaal-fe-specialist.md" || echo -e "   ❌ portaal-fe-specialist.md"
[ -f ".claude/agents/context-checkpoint-agent.md" ] && echo -e "   ✅ context-checkpoint-agent.md" || echo -e "   ❌ context-checkpoint-agent.md"
[ -f ".claude.json" ] && echo -e "   ✅ .claude.json" || echo -e "   ⚠️  .claude.json (optional)"

# Tips and recommendations
echo -e "\n${BLUE}💡 Tips & Commands${NC}"
echo "==================="
echo ""
echo "📝 Manual checkpoint:"
echo -e "   ${YELLOW}\"Create a checkpoint\"${NC}"
echo ""
echo "🔄 Resume work:"
echo -e "   ${YELLOW}\"Continue from last checkpoint\"${NC}"
echo ""
echo "🧹 Clean old checkpoints:"
echo -e "   ${YELLOW}./claude/clean-checkpoints.sh${NC}"
echo ""
echo "📊 View specific checkpoint:"
echo -e "   ${YELLOW}cat .claude/checkpoints/[checkpoint-name].md${NC}"

# Show warnings if needed
echo -e "\n${YELLOW}⚠️  Warnings${NC}"
echo "----------"

WARNING_COUNT=0

if [ $CHECKPOINT_COUNT -gt 20 ]; then
    echo -e "• Too many active checkpoints ($CHECKPOINT_COUNT). Consider running cleanup."
    ((WARNING_COUNT++))
fi

if [ $ARCHIVE_COUNT -gt 100 ]; then
    echo -e "• Large archive ($ARCHIVE_COUNT files). Consider backing up important ones."
    ((WARNING_COUNT++))
fi

if [ ! -f ".claude/agents/context-checkpoint-agent.md" ]; then
    echo -e "• Checkpoint agent not installed. Automatic checkpoints won't work."
    ((WARNING_COUNT++))
fi

if [ $WARNING_COUNT -eq 0 ]; then
    echo -e "${GREEN}✅ No warnings - system healthy!${NC}"
fi

echo ""
echo -e "${GREEN}✨ Monitoring complete!${NC}"