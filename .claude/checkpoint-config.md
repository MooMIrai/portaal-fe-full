# Context Checkpoint System Configuration

## Overview

This system automatically creates session summaries when Claude approaches context limits, ensuring no work is lost during conversation compression.

## Directory Structure

```
.claude/
├── agents/
│   ├── context-checkpoint-agent.md    # Checkpoint specialist
│   └── ...
├── checkpoints/                       # Session checkpoints
│   ├── 20240115_1430_checkpoint.md
│   └── archive/                       # Old checkpoints
├── sessions/                          # Git-friendly summaries
│   └── 2024-01-15_customer-feature.md
├── last-session.yaml                  # Quick resume file
└── checkpoint-config.md               # This file
```

## Setup Instructions

### 1. Create Required Directories

```bash
mkdir -p .claude/checkpoints/archive
mkdir -p .claude/sessions
```

### 2. Update .gitignore

Add these lines to `.gitignore`:

```gitignore
# Claude checkpoint system
.claude/checkpoints/
.claude/last-session.yaml
# Keep session summaries for team
!.claude/sessions/
```

### 3. Update selector-agent

Add context checkpoint detection to the selector-agent rules:

```markdown
# Add to Selection Rules in selector-agent:

X. **Check for checkpoint keywords** (checkpoint, save progress, session summary, context limit)
   → Return `context-checkpoint-agent`
```

## Automatic Checkpoint Triggers

### Token Count Monitoring
- At ~8,000 tokens (80% of context): Automatic checkpoint
- At ~9,500 tokens (95% of context): Forced checkpoint + compression

### Activity-Based Triggers
- After 10+ file modifications
- After 2+ hours of continuous work
- Before major architectural changes
- When switching between microservices

### Event-Based Triggers
- Before running `yarn build:all`
- After completing a feature
- When errors require context reset
- Before complex refactoring

## Integration with portaal-fe-specialist

The checkpoint system integrates seamlessly with the main agent:

```yaml
checkpoint_integration:
  trigger: "context_limit_approaching"
  handoff:
    from: "portaal-fe-specialist"
    to: "context-checkpoint-agent"
    return_to: "portaal-fe-specialist"
  data_preserved:
    - current_microservice
    - files_modified
    - pending_tasks
    - active_decisions
```

## Usage Patterns

### Automatic Checkpoint

```
[During development work]
Claude: "⚠️ Context approaching limit (8,000+ tokens). Creating automatic checkpoint..."

[Generates checkpoint file]

Claude: "✅ Checkpoint saved: `.claude/checkpoints/20240115_1430_customer-crud_partial.md`
You can resume with: 'Continue from checkpoint 20240115_1430'"
```

### Manual Checkpoint

```
User: "Save our progress before moving to the next feature"
Claude: [Activates context-checkpoint-agent]
[Creates comprehensive checkpoint]
"Checkpoint created with all changes documented. Ready for next feature!"
```

### Resume from Checkpoint

```
User: "Continue from last session"
Claude: [Reads last-session.yaml]
"Found session from [date]: We were implementing customer CRUD in Sales microservice.
Completed: API integration, form validation
Pending: Unit tests, error handling
Shall we continue with the unit tests?"
```

## Checkpoint File Template

```markdown
# Session Checkpoint - [YYYY-MM-DD HH:MM]

## Quick Resume
- **Project**: Portaal.be
- **Working in**: [microservice name]
- **Branch**: [if mentioned]
- **Main task**: [what was being done]

## Progress Summary
[2-3 sentences of what was accomplished]

## Files Modified
### Created (X files)
[List with purpose]

### Updated (Y files)
[List with changes]

## Key Decisions
[Important architectural or implementation decisions]

## Code Patterns Established
[Any new patterns or conventions created]

## Current State
- Services running: [list]
- Last command: [command]
- Working directory: [path]

## To Resume
1. Run: `yarn start:dev`
2. Navigate to: [URL]
3. Continue with: [next task]

## Blockers/Issues
[Any pending problems]

## Notes
[Important reminders]
```

## Team Collaboration

### Sharing Checkpoints

Session summaries in `.claude/sessions/` are tracked in Git:

```bash
# After significant work
git add .claude/sessions/2024-01-15_feature-complete.md
git commit -m "docs: AI session summary for customer feature"
```

### Checkpoint Naming Convention

```
Individual work: YYYYMMDD_HHMM_checkpoint.md
Team sharing: YYYY-MM-DD_feature-name.md
Milestones: YYYY-MM-DD_v1.0_release.md
```

## Best Practices

1. **Let it run automatically** - Don't wait for manual triggers
2. **Review checkpoints** - Ensure critical info is captured
3. **Clean old checkpoints** - Archive after 30 days
4. **Share important ones** - Commit session summaries to Git
5. **Use for handoffs** - Great for team collaboration

## Maintenance

### Archive Old Checkpoints

```bash
# Monthly cleanup (keep last 30 days)
find .claude/checkpoints -name "*.md" -mtime +30 -exec mv {} .claude/checkpoints/archive/ \;
```

### Consolidate Session Summaries

```bash
# Quarterly consolidation
cat .claude/sessions/2024-Q1*.md > .claude/sessions/2024-Q1-consolidated.md
```

## Troubleshooting

### Checkpoint Not Created
- Check directory permissions
- Verify `.claude/checkpoints/` exists
- Ensure enough disk space

### Can't Resume from Checkpoint
- Verify checkpoint file exists
- Check file isn't corrupted
- Try the previous checkpoint

### Too Many Checkpoints
- Run archive script
- Increase cleanup frequency
- Only keep milestone checkpoints