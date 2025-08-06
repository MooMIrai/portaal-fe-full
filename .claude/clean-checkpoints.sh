#!/bin/bash
# Archive old checkpoints (older than 30 days)

CHECKPOINT_DIR=".claude/checkpoints"
ARCHIVE_DIR=".claude/checkpoints/archive"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🧹 Claude Checkpoint Cleanup Script"
echo "=================================="

# Check if checkpoint directory exists
if [ ! -d "$CHECKPOINT_DIR" ]; then
    echo -e "${RED}❌ Checkpoint directory not found at $CHECKPOINT_DIR${NC}"
    echo "   Please run this script from the project root."
    exit 1
fi

# Create archive directory if it doesn't exist
if [ ! -d "$ARCHIVE_DIR" ]; then
    echo -e "${YELLOW}📁 Creating archive directory...${NC}"
    mkdir -p "$ARCHIVE_DIR"
fi

# Find and archive old checkpoints
echo -e "${YELLOW}🔍 Looking for checkpoints older than 30 days...${NC}"

OLD_COUNT=0
ARCHIVED_FILES=""

while IFS= read -r -d '' file; do
    if [[ ! "$file" =~ "archive" ]] && [[ ! "$file" =~ "example_checkpoint.md" ]]; then
        filename=$(basename "$file")
        echo -e "  📦 Archiving: $filename"
        mv "$file" "$ARCHIVE_DIR/"
        ((OLD_COUNT++))
        ARCHIVED_FILES="$ARCHIVED_FILES\n  - $filename"
    fi
done < <(find "$CHECKPOINT_DIR" -maxdepth 1 -name "*.md" -mtime +30 -print0 2>/dev/null)

if [ $OLD_COUNT -gt 0 ]; then
    echo -e "${GREEN}✅ Archived $OLD_COUNT checkpoint(s)${NC}"
    echo -e "${GREEN}Files moved:$ARCHIVED_FILES${NC}"
else
    echo -e "${GREEN}✅ No checkpoints older than 30 days found${NC}"
fi

# Count current checkpoints
CURRENT_COUNT=$(find "$CHECKPOINT_DIR" -maxdepth 1 -name "*.md" ! -name "example_checkpoint.md" 2>/dev/null | wc -l)
echo -e "\n📊 Current checkpoint status:"
echo -e "  - Active checkpoints: ${GREEN}$CURRENT_COUNT${NC}"

# Check archive size
ARCHIVE_COUNT=$(find "$ARCHIVE_DIR" -name "*.md" 2>/dev/null | wc -l)
echo -e "  - Archived checkpoints: ${YELLOW}$ARCHIVE_COUNT${NC}"

# Remove very old archives (>90 days)
echo -e "\n${YELLOW}🗑️  Checking for archives older than 90 days...${NC}"

DELETED_COUNT=0
while IFS= read -r -d '' file; do
    filename=$(basename "$file")
    echo -e "  🗑️  Deleting: $filename"
    rm "$file"
    ((DELETED_COUNT++))
done < <(find "$ARCHIVE_DIR" -name "*.md" -mtime +90 -print0 2>/dev/null)

if [ $DELETED_COUNT -gt 0 ]; then
    echo -e "${GREEN}✅ Deleted $DELETED_COUNT old archive(s)${NC}"
else
    echo -e "${GREEN}✅ No archives older than 90 days found${NC}"
fi

# Show disk usage
echo -e "\n💾 Disk usage:"
CHECKPOINT_SIZE=$(du -sh "$CHECKPOINT_DIR" 2>/dev/null | cut -f1)
echo -e "  - Total checkpoint directory: ${GREEN}$CHECKPOINT_SIZE${NC}"

# Recommendations
echo -e "\n💡 Recommendations:"

if [ $CURRENT_COUNT -gt 20 ]; then
    echo -e "  ${YELLOW}⚠️  You have many active checkpoints. Consider manual review.${NC}"
fi

if [ $ARCHIVE_COUNT -gt 50 ]; then
    echo -e "  ${YELLOW}⚠️  Archive is getting large. Consider backing up important ones.${NC}"
fi

# Find most recent checkpoint
LATEST=$(ls -t "$CHECKPOINT_DIR"/*.md 2>/dev/null | grep -v example_checkpoint | head -1)
if [ -n "$LATEST" ]; then
    LATEST_NAME=$(basename "$LATEST")
    LATEST_DATE=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M" "$LATEST" 2>/dev/null || stat -c "%y" "$LATEST" 2>/dev/null | cut -d' ' -f1-2)
    echo -e "\n📄 Most recent checkpoint:"
    echo -e "  - File: ${GREEN}$LATEST_NAME${NC}"
    echo -e "  - Date: $LATEST_DATE"
fi

echo -e "\n✨ Cleanup complete!"
echo -e "\n💡 Tip: Add this to cron for automatic monthly cleanup:"
echo -e "   ${YELLOW}0 0 1 * * cd $(pwd) && ./claude/clean-checkpoints.sh${NC}"