# Portaal.be Project Configuration

## Project Overview
Portaal.be is a Module Federation-based frontend application consisting of 15+ microservices orchestrated by PM2. Each microservice is independently developed and deployed while sharing common components and services.

## Default Agent
`portaal-fe-specialist`

## Auto-routing Rules

### Primary Context Detection
Any mention of the following triggers `portaal-fe-specialist`:
- Module Federation, webpack federation, remoteEntry.js
- Microservices, microservizi, MFE
- PM2, ecosystem.config.js
- Portaal, portaal-fe-*, portaal.be
- ENABLED_MFES, mfeConfig
- Ports 3000-3022
- Common components, shared services

### Task-Specific Routing
After initial context from `portaal-fe-specialist`, route to:

1. **Frontend Tasks** → `portaal-fe-specialist` → `frontend-developer`
2. **Backend Tasks** → `portaal-fe-specialist` → `backend-architect`
3. **Database/SQL** → `portaal-fe-specialist` → `portaal-dashboard-pro` or `sql-pro`
4. **Testing** → `portaal-fe-specialist` → `test-automator`
5. **Deployment** → `portaal-fe-specialist` → `deployment-engineer`
6. **Performance** → `portaal-fe-specialist` → `performance-engineer`
7. **Security** → `portaal-fe-specialist` → `security-auditor`

## Project Structure

```
Portaal.be/
├── portaal-fe-core/          # Main container (3000)
├── portaal-fe-common/        # Shared components (3003)
├── portaal-fe-auth/          # Authentication (3006)
├── portaal-fe-sales/         # Sales module (3008)
├── portaal-fe-hr/            # HR module (3009)
├── portaal-fe-recruiting/    # Recruiting (3011)
├── portaal-fe-stock/         # Inventory (3012)
├── portaal-fe-notifications/ # Notifications (3013)
├── portaal-fe-reports/       # Reports (3015)
├── portaal-fe-chatbot/       # AI Chat (3018)
├── portaal-fe-dashboard/     # Dashboard (3020)
├── portaal-fe-lookups/       # Master data (3005)
├── ecosystem.config.js       # PM2 configuration
└── package.json             # Root package
```

## Critical Files to Monitor

1. **ecosystem.config.js** - PM2 service definitions
2. **mfeConfig.ts** - Module Federation imports
3. **MfeInit.tsx** - Menu configuration per service
4. **.env.development** - ENABLED_MFES configuration
5. **webpack.config.js** - Module Federation setup

## Development Commands

```bash
# Start all services in development
yarn start:dev

# Start production mode
yarn start:live

# View logs
yarn logs

# Stop all services
yarn stop

# Restart all services
yarn restart
```

## Architecture Principles

1. **Module Independence**: Each microservice can be developed independently
2. **Shared Dependencies**: Common and Auth are always required
3. **Dynamic Loading**: Modules are loaded at runtime via Module Federation
4. **Permission-Based**: All features are gated by permissions
5. **Service Communication**: Via shared services, not direct module imports

## Code Standards

- **TypeScript**: Required for all new code
- **React Hooks**: Preferred over class components
- **Tailwind CSS**: For styling with Kendo UI components
- **Testing**: Minimum 80% coverage
- **Accessibility**: WCAG 2.1 AA compliance

## Integration Points

- **Backend API**: RESTful services via BEService
- **Authentication**: JWT tokens with automatic refresh
- **File Storage**: Integrated file service with progress tracking
- **Real-time**: WebSocket support in Notifications service
- **Theming**: Light/dark mode with persistence

## Security Requirements

- All routes must use ProtectedRoute component
- Permissions checked on both frontend and backend
- Input validation on all forms
- XSS prevention in user-generated content
- Regular dependency updates

## Performance Targets

- Module load time < 2 seconds
- Time to interactive < 3 seconds
- Lighthouse score > 90
- Bundle size < 250KB per microservice
- API response time < 200ms