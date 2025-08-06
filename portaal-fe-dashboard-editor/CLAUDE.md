# Project Configuration for Intelligent Agent Selection

## CRITICAL: Agent Selection Policy

**ALWAYS use the selector-agent FIRST for any technical request before proceeding with implementation.**

### Workflow Requirements

1. **For ANY technical task**, coding request, or problem-solving:
   - FIRST: Use `Task` tool with `subagent_type="selector-agent"`
   - SECOND: Use the agent recommended by selector-agent
   - THIRD: Only proceed with direct implementation if no specialized agent applies

2. **Exceptions** (when you can skip selector-agent):
   - Simple information queries (e.g., "What time is it?")
   - File reading/writing without logic changes
   - Basic explanations that don't require specialized knowledge

### Implementation Pattern

```
User: "Help me optimize my Python code"
You: 
1. Task(subagent_type="selector-agent", prompt="User wants to optimize Python code")
2. [Receive: "Agent: python-pro"]
3. Task(subagent_type="python-pro", prompt="[Original user request]")
```

### Priority Overrides

These situations ALWAYS require immediate specialized agents:
- Production issues → `incident-responder` (skip selector, go direct)
- Security vulnerabilities → `security-auditor`
- Active bugs/errors → `debugger`

### Available Specialized Agents

The selector-agent (available as a subagent) has knowledge of 45+ specialized agents including:
- Language experts (Python, JavaScript, Go, Rust, C/C++)
- Domain experts (Frontend, Backend, ML, DevOps, Cloud)
- Task specialists (Testing, Security, Performance, Database)
- Business tools (Analytics, Sales, Marketing, Support)

### Remember

- The selector-agent ensures optimal expert selection
- Using the right specialist improves quality and efficiency
- Two-step process (select then execute) is worth the precision
- When in doubt, let selector-agent decide

## Project Rules

1. **Always show your agent selection process** to the user
2. **Explain which agent was selected** and why
3. **Never skip the selector** for complex technical tasks
4. **Document agent interactions** in responses

This configuration ensures that every request gets routed to the most qualified specialist agent.