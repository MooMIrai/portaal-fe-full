# Portaal.be Development Environment

You are now working on the **Portaal.be** project, a sophisticated Module Federation-based frontend application.

## Primary Agent
**ALWAYS** use `portaal-fe-specialist` as your primary reference for any task in this project. This agent has complete knowledge of:
- Module Federation architecture
- All 15+ microservices and their interactions
- Development patterns and best practices
- Integration points with other specialists

## Project Context

### Architecture
- **Technology**: React + Module Federation + TypeScript
- **Orchestration**: PM2 process manager
- **Styling**: Tailwind CSS + Kendo UI React
- **State**: Context API + Service layer
- **Auth**: JWT with role-based permissions

### Active Microservices
Check `ENABLED_MFES` in `.env.development` to see which services are active.
Default ports range: 3000-3022

### Key Services Always Running
1. **Core** (3000) - Main container
2. **Common** (3003) - Shared components
3. **Auth** (3006) - Authentication

## Development Workflow

1. **Starting a Task**
   - Let `portaal-fe-specialist` analyze the request
   - Follow suggested patterns from the agent
   - Use recommended specialist agents for specific tasks

2. **Code Changes**
   - Follow existing patterns in the codebase
   - Use TypeScript interfaces
   - Implement proper error handling
   - Add permission checks where needed

3. **Testing**
   - Write tests for new features
   - Aim for >80% coverage
   - Test permission scenarios

4. **Review**
   - Use `code-reviewer` for quality checks
   - Use `architect-reviewer` for structural changes

## Quick Commands

```bash
# Start development
yarn start:dev

# Check logs
yarn logs

# Stop all services
yarn stop

# Run specific microservice
pm2 start ecosystem.config.js --only portaal-fe-sales
```

## Important Notes

1. **Module Federation**: Never import directly between microservices
2. **Permissions**: Always use ProtectedRoute for pages
3. **Services**: Use BEService for all API calls
4. **Components**: Prefer Common components over custom
5. **Debugging**: MCP Playwright tools are available

## Getting Help

- Architecture questions → `portaal-fe-specialist`
- React components → `frontend-developer` 
- API design → `backend-architect`
- SQL/Database → `portaal-dashboard-pro`
- Performance → `performance-engineer`
- Deployment → `deployment-engineer`

Remember: The `portaal-fe-specialist` agent is your guide. Always start there for Portaal.be tasks.