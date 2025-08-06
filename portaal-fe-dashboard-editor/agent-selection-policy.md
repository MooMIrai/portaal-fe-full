# Agent Selection Policy Documentation

## Overview

This document describes the intelligent agent selection system that ensures every technical request is handled by the most qualified specialist agent.

## Core Principle

**Every technical task should be routed through the selector-agent first** to ensure optimal expert selection. This two-step process guarantees that specialized knowledge is applied to every problem.

## How It Works

### Step 1: Selection
When a user makes a request, Claude first invokes the selector-agent:
```
Task(
  subagent_type="selector-agent",
  prompt="[User's request]"
)
```

### Step 2: Execution
Based on selector-agent's response, Claude then invokes the recommended specialist:
```
Task(
  subagent_type="[recommended-agent]",
  prompt="[Original user request with context]"
)
```

## Agent Categories

### 🚨 Priority 1: Critical Response
- **incident-responder**: Production emergencies
- **security-auditor**: Security vulnerabilities
- **debugger**: Active bugs and errors

### 🔍 Priority 2: Code Quality
- **code-reviewer**: Code review and best practices
- **architect-reviewer**: Architecture consistency
- **performance-engineer**: Performance optimization

### 💻 Priority 3: Language Specialists
- **python-pro**: Python expertise
- **javascript-pro**: JavaScript/Node.js
- **golang-pro**: Go programming
- **rust-pro**: Rust systems programming
- **c-pro**: C programming
- **cpp-pro**: C++ programming

### 🛠️ Priority 3: Development Specialists
- **frontend-developer**: UI/UX and React
- **backend-architect**: APIs and microservices
- **mobile-developer**: Mobile app development
- **graphql-architect**: GraphQL APIs

### ☁️ Priority 3: Infrastructure
- **cloud-architect**: Cloud infrastructure
- **deployment-engineer**: CI/CD pipelines
- **devops-troubleshooter**: Production debugging
- **network-engineer**: Network configuration
- **terraform-specialist**: Infrastructure as Code

### 📊 Priority 4: Data & ML
- **data-scientist**: Data analysis and SQL
- **data-engineer**: ETL pipelines
- **ml-engineer**: ML deployment
- **mlops-engineer**: ML operations
- **ai-engineer**: LLM applications

### 🗄️ Priority 4: Database
- **database-admin**: DB operations
- **database-optimizer**: Query optimization
- **sql-pro**: Complex SQL

### ✅ Priority 4: Quality & Testing
- **test-automator**: Test automation
- **legacy-modernizer**: Code refactoring
- **dx-optimizer**: Developer experience

### 📈 Priority 5: Business & Support
- **business-analyst**: Business metrics
- **quant-analyst**: Financial analysis
- **risk-manager**: Risk management
- **sales-automator**: Sales automation
- **content-marketer**: Marketing content
- **customer-support**: Customer support

### 🔧 Priority 5: Specialized Tools
- **api-documenter**: API documentation
- **payment-integration**: Payment systems
- **prompt-engineer**: Prompt optimization
- **search-specialist**: Research tasks
- **error-detective**: Log analysis
- **context-manager**: Long-running tasks

## Selection Logic

The selector-agent uses a multi-tier approach:

1. **Urgency Detection**: Scans for critical keywords
2. **Language Detection**: Identifies programming languages
3. **Technology Matching**: Maps frameworks and tools
4. **Task Analysis**: Understands the type of work
5. **Priority Weighting**: Applies agent priorities

## Benefits

1. **Expertise**: Every task gets the right specialist
2. **Consistency**: Standardized approach to all requests
3. **Quality**: Higher quality outputs from domain experts
4. **Efficiency**: Faster resolution with specialized knowledge
5. **Learning**: Each agent improves in their domain

## Examples

### Example 1: Bug Fix
```
User: "There's an error in my Python code"
Claude → selector-agent → "Agent: debugger"
Claude → debugger → [Fixes the bug]
```

### Example 2: Architecture Review
```
User: "Review my microservice design"
Claude → selector-agent → "Agent: architect-reviewer"
Claude → architect-reviewer → [Reviews architecture]
```

### Example 3: Emergency
```
User: "Production is down!"
Claude → selector-agent → "Agent: incident-responder"
Claude → incident-responder → [Handles incident]
```

## Best Practices

1. **Always show the selection process** to maintain transparency
2. **Include context** when invoking the selected agent
3. **Allow overrides** if user specifically requests a different agent
4. **Document decisions** for future reference
5. **Monitor effectiveness** and adjust as needed

## Configuration

This policy is enforced through:
- `CLAUDE.md`: Project-level instructions
- `.claude/settings.json`: Technical configuration
- System prompts: Behavioral reinforcement

## Exceptions

Skip selector-agent only for:
- Simple information queries
- Non-technical requests
- Direct file operations without logic
- When user explicitly specifies an agent