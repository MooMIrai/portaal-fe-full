# Intelligent Agent Selection Configuration

This directory contains configuration files to enable intelligent agent selection in any Claude project.

## 🚀 Quick Start

To enable intelligent agent selection in your project:

```bash
# Set the path to your agents directory (default: ~/.claude/agents)
AGENTS_DIR="${AGENTS_DIR:-$HOME/.claude/agents}"

# From your project root directory
cp "$AGENTS_DIR/custom/CLAUDE.md" .
cp "$AGENTS_DIR/custom/agent-selection-policy.md" .
cp -r "$AGENTS_DIR/custom/.claude" .

# Alternative: If you're in the agents/custom directory
# cp CLAUDE.md /path/to/your/project/
# cp agent-selection-policy.md /path/to/your/project/
# cp -r .claude /path/to/your/project/

# Alternative: Using relative paths from agents repository
# cd /path/to/your/project
# cp ../agents/custom/CLAUDE.md .
# cp -r ../agents/custom/.claude .
```

## 📁 Files Included

### `CLAUDE.md`
Main configuration file that Claude reads automatically. Contains:
- Agent selection policy directives
- Workflow requirements
- Priority overrides for emergencies
- Available agents list

**Location**: Place in project root

### `.claude/settings.json`
Technical configuration for Claude's behavior:
- Enables proactive agent use
- Sets selector-agent as default
- Configures tool behaviors
- Lists all available agents

**Location**: `.claude/` directory in project root

### `agent-selection-policy.md`
Comprehensive documentation of:
- How the selection system works
- All available agents by category
- Selection logic and priorities
- Examples and best practices

**Location**: Project root (for reference)

## 🔧 How It Works

1. **User makes request** → "Help me optimize my Python code"
2. **Claude uses selector-agent** → Analyzes request, returns "python-pro"
3. **Claude uses python-pro** → Executes the optimization task
4. **User gets expert result** → Optimized code from Python specialist

## 📋 Available Specialists

The system includes 45+ specialized agents:

- **🚨 Emergency**: incident-responder, security-auditor, debugger
- **💻 Languages**: python-pro, javascript-pro, golang-pro, rust-pro, c-pro, cpp-pro
- **🎨 Development**: frontend-developer, backend-architect, mobile-developer
- **☁️ Infrastructure**: cloud-architect, deployment-engineer, devops-troubleshooter
- **📊 Data/ML**: data-scientist, ml-engineer, ai-engineer
- **📈 Business**: business-analyst, sales-automator, content-marketer
- **🔧 Specialized**: api-documenter, test-automator, performance-engineer

## 📍 Installation Examples

### From Git Clone
```bash
git clone https://github.com/your-org/claude-agents.git
cd your-project
cp claude-agents/custom/CLAUDE.md .
cp -r claude-agents/custom/.claude .
```

### From Downloaded Archive
```bash
# Extract the agents archive
tar -xzf claude-agents.tar.gz
# Or: unzip claude-agents.zip

# Copy to your project
cd your-project
cp path/to/extracted/agents/custom/CLAUDE.md .
cp -r path/to/extracted/agents/custom/.claude .
```

### Using Environment Variable
```bash
# Add to your .bashrc or .zshrc (optional, default is ~/.claude/agents)
export CLAUDE_AGENTS_DIR="$HOME/my-custom-agents-location"

# Then use in any project
cd your-project
AGENTS_DIR="${CLAUDE_AGENTS_DIR:-$HOME/.claude/agents}"
cp "$AGENTS_DIR/custom/CLAUDE.md" .
cp -r "$AGENTS_DIR/custom/.claude" .
```

## ⚙️ Customization

### Modify Agent Priority
Edit `CLAUDE.md` to change when certain agents are used:
```markdown
### Priority Overrides
- Production issues → `incident-responder`
- Your custom priority → `your-preferred-agent`
```

### Add New Agents
1. Create new agent file: `new-agent.md`
2. Add to `.claude/settings.json` available agents list
3. Update selector-agent.md with new agent mapping

### Disable for Specific Tasks
In `CLAUDE.md`, add exceptions:
```markdown
### Exceptions
- Simple calculations
- Your custom exception
```

## 🎯 Best Practices

1. **Copy all files** - Don't skip any configuration files
2. **Test the setup** - Try: "Use selector agent to [any task]"
3. **Monitor behavior** - Claude should show agent selection process
4. **Allow overrides** - Users can still request specific agents

## 🔍 Verification

After setup, test with:
```
"Help me debug this error" 
→ Should use selector → debugger

"Optimize my SQL query"
→ Should use selector → sql-pro or database-optimizer

"Production is down!"
→ Should immediately use incident-responder
```

## 📝 Troubleshooting

If agent selection isn't working:

1. **Check file locations**:
   - `CLAUDE.md` in project root
   - `.claude/settings.json` in `.claude/` directory

2. **Verify Claude reads files**:
   - Ask: "What does CLAUDE.md say about agent selection?"

3. **Test selector directly**:
   - Ask: "Use selector-agent to analyze: [your request]"

## 🤝 Contributing

To improve the agent selection system:
1. Test with various requests
2. Note any incorrect selections
3. Update selector-agent.md mappings
4. Share improvements with the team

## 📌 Important Notes

- **Two-step process** is intentional for precision
- **Emergency overrides** bypass selector for critical issues
- **User can override** by requesting specific agents
- **Transparency** - Claude shows its agent selection reasoning

---

For questions or improvements, check the `agent-selection-policy.md` for detailed documentation.