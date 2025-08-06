#!/bin/bash

# Setup script for Claude Context Checkpoint System
# Run from Portaal.be project root

echo "🔄 Setting up Claude Context Checkpoint System"
echo "============================================="

# 1. Create checkpoint directories
echo "📁 Creating checkpoint directories..."
mkdir -p .claude/checkpoints/archive
mkdir -p .claude/sessions

# 2. Create initial last-session.yaml
echo "📝 Creating last-session.yaml template..."
cat > .claude/last-session.yaml << 'EOF'
# This file is automatically updated by context-checkpoint-agent
last_session:
  date: null
  main_work: "No previous session"
  files_touched: 0
  next_task: "Start new development"
  blockers: []
  resume_in: "portaal-fe-core"
EOF

# 3. Update .gitignore if needed
echo "📝 Updating .gitignore..."
if ! grep -q ".claude/checkpoints/" .gitignore 2>/dev/null; then
    cat >> .gitignore << 'EOF'

# Claude checkpoint system
.claude/checkpoints/
.claude/last-session.yaml
# Keep session summaries for team
!.claude/sessions/
EOF
    echo "✅ .gitignore updated"
else
    echo "ℹ️  .gitignore already configured"
fi

# 4. Create checkpoint cleaner script
echo "🧹 Creating checkpoint maintenance script..."
cat > .claude/clean-checkpoints.sh << 'EOF'
#!/bin/bash
# Archive old checkpoints (older than 30 days)

CHECKPOINT_DIR=".claude/checkpoints"
ARCHIVE_DIR=".claude/checkpoints/archive"

if [ -d "$CHECKPOINT_DIR" ]; then
    echo "Archiving checkpoints older than 30 days..."
    find "$CHECKPOINT_DIR" -maxdepth 1 -name "*.md" -mtime +30 -exec mv {} "$ARCHIVE_DIR/" \; 2>/dev/null
    
    COUNT=$(find "$ARCHIVE_DIR" -name "*.md" 2>/dev/null | wc -l)
    echo "Archived $COUNT old checkpoints"
    
    # Remove archives older than 90 days
    find "$ARCHIVE_DIR" -name "*.md" -mtime +90 -delete 2>/dev/null
fi
EOF

chmod +x .claude/clean-checkpoints.sh

# 5. Create example checkpoint
echo "📄 Creating example checkpoint..."
TIMESTAMP=$(date +"%Y%m%d_%H%M")
cat > .claude/checkpoints/example_checkpoint.md << 'EOF'
# Session Checkpoint - Example

## Quick Resume
- **Project**: Portaal.be
- **Working in**: portaal-fe-sales (port 3008)
- **Branch**: feature/customer-management
- **Main task**: Implementing customer CRUD operations

## Progress Summary
Successfully implemented customer list view and create form in the Sales microservice. 
Integrated with Common components and added permission-based access control.

## Files Modified
### Created (4 files)
- `portaal-fe-sales/src/pages/ClientiPage.tsx` - Main customer list page
- `portaal-fe-sales/src/components/ClienteForm.tsx` - Customer creation/edit form
- `portaal-fe-sales/src/services/ClienteService.ts` - API service layer
- `portaal-fe-sales/src/adapters/ClienteAdapter.ts` - Data transformation

### Updated (3 files)
- `portaal-fe-sales/src/MfeInit.tsx` - Added menu items for customer section
- `portaal-fe-sales/src/App.tsx` - Added new routes
- `portaal-fe-core/.env.development` - Enabled sales in ENABLED_MFES

## Key Decisions
1. **Data Structure**: Used adapter pattern for API/Frontend data transformation
2. **Permissions**: Implemented granular permissions (READ_SALES_CUSTOMER, WRITE_SALES_CUSTOMER)
3. **UI Components**: Leveraged Common/Table and Common/Form instead of custom

## Code Patterns Established
```typescript
// Service pattern with typed responses
class ClienteService {
  static async getAll(): Promise<Cliente[]> {
    const response = await BEService.get('/api/clienti');
    return ClienteAdapter.fromAPI(response.data);
  }
}

// Adapter pattern for data transformation
class ClienteAdapter {
  static fromAPI(data: any): Cliente {
    return {
      id: data.id,
      name: data.ragione_sociale,
      // ... mapping
    };
  }
}
```

## Current State
- Services running: All via `yarn start:dev`
- Last command: `yarn start:dev`
- Working directory: `portaal-fe-sales`
- Browser open at: http://localhost:3008/clienti

## To Resume
1. Run: `yarn start:dev`
2. Navigate to: http://localhost:3008/clienti
3. Continue with: Adding edit functionality and unit tests

## Blockers/Issues
- Backend API endpoint for DELETE not yet implemented
- Need to add loading states to the form
- Pagination component from Common needs update

## Notes
- Remember to update permissions in the backend
- The ClienteForm component is reusable for both create and edit
- Consider adding a confirmation dialog for delete operations
- Test with a user that has only READ permissions
EOF

# 6. Create a monitoring script
echo "📊 Creating context monitor script..."
cat > .claude/monitor-context.sh << 'EOF'
#!/bin/bash
# Simple context monitoring helper

echo "🔍 Claude Context Monitor"
echo "========================"

# Check checkpoint directory
CHECKPOINT_COUNT=$(find .claude/checkpoints -name "*.md" 2>/dev/null | grep -v example | wc -l)
echo "📁 Active checkpoints: $CHECKPOINT_COUNT"

# Check latest checkpoint
LATEST=$(ls -t .claude/checkpoints/*.md 2>/dev/null | grep -v example | head -1)
if [ -n "$LATEST" ]; then
    echo "📄 Latest checkpoint: $(basename $LATEST)"
    echo "   Created: $(stat -f "%Sm" -t "%Y-%m-%d %H:%M" "$LATEST" 2>/dev/null || stat -c "%y" "$LATEST" 2>/dev/null | cut -d' ' -f1-2)"
fi

# Check session summaries
SESSION_COUNT=$(find .claude/sessions -name "*.md" 2>/dev/null | wc -l)
echo "📋 Session summaries: $SESSION_COUNT"

# Check last session
if [ -f ".claude/last-session.yaml" ]; then
    echo "🕒 Last session info:"
    grep -E "date:|main_work:|next_task:" .claude/last-session.yaml | sed 's/^/   /'
fi

echo ""
echo "💡 Tips:"
echo "   - Say 'create checkpoint' to manually save progress"
echo "   - Say 'continue from last checkpoint' to resume"
echo "   - Run './claude/clean-checkpoints.sh' monthly"
EOF

chmod +x .claude/monitor-context.sh

# 7. Create integration with selector-agent update
echo "🔧 Creating selector-agent update..."
cat > .claude/agents/selector-agent-checkpoint-update.txt << 'EOF'
# Add this to the Selection Rules in selector-agent.md:

X. **Check for checkpoint keywords** (checkpoint, save progress, session summary, context limit, resume session)
   → Return `context-checkpoint-agent`

# Also add to Agent Directory under Project-Specific Specialists:

- **context-checkpoint-agent**: Session checkpointing, progress saving, context management. Auto-activates near context limits.
EOF

# 8. Summary
echo ""
echo "✅ Context Checkpoint System Setup Complete!"
echo ""
echo "📋 What was created:"
echo "   - .claude/checkpoints/ - For storing session checkpoints"
echo "   - .claude/sessions/ - For team-shareable summaries"
echo "   - .claude/last-session.yaml - Quick resume file"
echo "   - .claude/clean-checkpoints.sh - Maintenance script"
echo "   - .claude/monitor-context.sh - Context monitoring"
echo ""
echo "🚀 How to use:"
echo "   1. Work normally - checkpoints create automatically"
echo "   2. Say 'create checkpoint' for manual saves"
echo "   3. Say 'continue from last checkpoint' to resume"
echo "   4. Run './claude/monitor-context.sh' to check status"
echo ""
echo "⚠️  Next steps:"
echo "   1. Copy context-checkpoint-agent.md to .claude/agents/"
echo "   2. Update selector-agent.md with checkpoint detection"
echo "   3. Commit the checkpoint system configuration"
echo ""
echo "💡 The system will automatically save your work when:"
echo "   - Context approaches 8,000 tokens"
echo "   - You modify 10+ files"
echo "   - You complete major features"
echo "   - Before any context compression"