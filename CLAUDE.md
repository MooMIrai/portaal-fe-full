# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Portaal is a modular enterprise application built using **Webpack Module Federation** to enable micro-frontend architecture. The application consists of a core shell application (`portaal-fe-core`) that dynamically loads independent micro-frontend modules at runtime.

### Module Federation Architecture

- **Core Application (`portaal-fe-core`)**: The shell application running on port 3000 that orchestrates all microfrontends
- **Common Library (`portaal-fe-common`)**: Shared component library and services exposed via Module Federation on port 3003
- **Feature Modules**: Independent microfrontends with their own development servers:
  - `portaal-fe-auth` (port 3006) - Authentication and role management
  - `portaal-fe-sales` (port 3008) - Sales management (Clienti, Offerte, Progetti, Sal)
  - `portaal-fe-hr` (port 3009) - Human resources
  - `portaal-fe-recruiting` (port 3011) - Recruitment
  - `portaal-fe-stock` (port 3012) - Stock management
  - `portaal-fe-notification` (port 3013) - Notifications
  - `portaal-fe-reports` (port 3015) - Reporting
  - `portaal-fe-chatbot` (port 3018) - AI chatbot
  - `portaal-fe-dashboard` (port 3020) - Dashboard
  - `portaal-fe-lookUps` (port 3005) - Lookup data

Each module exposes specific components, services, and routes via `webpack.config.js` using `ModuleFederationPlugin`.

## Development Commands

### Starting the Application

Development requires running multiple dev servers simultaneously:

1. **Core application** (required):
   ```bash
   cd portaal-fe-core
   yarn start
   ```

2. **Common library** (required):
   ```bash
   cd portaal-fe-common
   yarn start
   ```

3. **Feature modules** (as needed):
   ```bash
   cd portaal-fe-[module-name]
   yarn start
   ```

The core application dynamically imports microfrontends based on the `ENABLED_MFES` environment variable in `portaal-fe-core/.env.development`.

### Building for Production

From each module directory:
```bash
yarn build        # Production build
yarn build:dev    # Development build
```

Production builds output to the `dist/` folder in each module.

### Configuration

Each module has environment-specific configuration:
- `.env.development` - Used with `--mode development`
- `.env.production` - Used with `--mode production`

The webpack config dynamically loads the appropriate env file based on the mode.

## Key Architectural Patterns

### Module Federation Integration

1. **Core Application** (`portaal-fe-core/webpack.config.js`):
   - Defines all remote microfrontends in the `remotes` configuration
   - Uses `PrebuildPlugin` to dynamically generate `src/mfeConfig.ts` with imports based on enabled modules
   - Filters modules based on `ENABLED_MFES` environment variable

2. **Common Library** (`portaal-fe-common/webpack.config.js`):
   - Exposes shared components via the `exposes` configuration
   - Components like `Drawer`, `Table`, `Form`, `Calendar` are federated
   - Services like `AuthService`, `BEService`, `BaseHTTPService` are exposed
   - HOCs and adapters are also shared

3. **Feature Modules**: Each module's webpack config exposes:
   - `./Index` - Menu items (MfeInit function)
   - `./Routes` - Route definitions (App component)

### Dynamic Menu and Route Loading

The core application loads menus and routes dynamically:

```typescript
// portaal-fe-core/src/mfeInit.tsx
export const mfeInitMenu = () => {
  return Promise.allSettled(menuToImport).then(menuFunctions => {
    // Loads menu items from all modules
  });
};
```

Each feature module exports menu configuration:
```typescript
// Example: portaal-fe-sales/src/MfeInit.tsx
export default function () {
  return {
    menuItems: [
      {
        id: 6,
        text: "Vendite",
        route: "/clienti",
        permissions: ["READ_SALES_CUSTOMER"]
      }
    ]
  };
}
```

### Authentication and Authorization

- **Token Management**: JWT tokens stored in cookies via `CookieRepo`
- **AuthService** (`portaal-fe-common/src/services/AuthService.ts`):
  - `getToken()` - Retrieves JWT from cookies
  - `hasPermission(permission)` - Permission-based access control
  - `getTenant(index)` - Multi-tenant support
- Routes and menu items include `permissions` arrays for role-based access control

### HTTP Service Architecture

**BEService** (`portaal-fe-common/src/services/BEService.ts`):
- Axios client with caching via `axios-cache-interceptor`
- Automatically adds Bearer token to all requests
- Intercepts 401 responses to trigger logout
- Intercepts 452 responses for user confirmation flows
- Integrates with `NotificationProvider` for loading states and error messages

### Component Structure

Each feature module typically follows this structure:
```
src/
├── adapters/         # Data adapters for API responses
├── component/        # Feature-specific components
│   └── [Feature]Crud/
├── pages/            # Page components
│   └── [Feature]/
│       └── component.tsx
├── services/         # Module-specific API services
├── App.tsx           # Route definitions
├── MfeInit.tsx       # Menu configuration
└── bootstrap.tsx     # Module entry point
```

### Shared Components from Common Library

Import common components using Module Federation syntax:
```typescript
import Drawer from "common/Drawer";
import Theme from "common/Theme";
import Table from "common/Table";
import Form from "common/Form";
import authService from "common/services/AuthService";
import client from "common/services/BEService";
```

Available components are defined in `portaal-fe-common/webpack.config.js` under `exposes`.

## Technology Stack

- **Build Tool**: Webpack 5 with Module Federation
- **Framework**: React 18 with TypeScript
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS with PostCSS
- **UI Library**: Kendo React UI components (@progress/kendo-react-*)
- **HTTP Client**: Axios with caching
- **Package Manager**: Yarn (v1.22.22)

## Adding a New Microfrontend

1. Create the module structure (see existing modules for reference)
2. Configure webpack with Module Federation:
   - Set unique `name` and `filename` for `remoteEntry.js`
   - Expose `./Index` (menu) and `./Routes` (routing)
3. Add the module to `portaal-fe-core/webpack.config.js`:
   - Add remote entry in `allRemotes` object
   - Add port mapping in webpack config's port mapping
4. Update `portaal-fe-core/.env.development` to include the new module in `ENABLED_MFES`
5. Create `MfeInit.tsx` with menu configuration
6. Create `App.tsx` with route definitions using `common/Routes`

## Common Development Patterns

### Creating Protected Routes

Use the `Routes` component from common with permissions:
```typescript
import Routes from 'common/Routes';

<Routes data={[
  {
    path: "/example",
    element: <ExamplePage />,
    permissions: ["READ_EXAMPLE"]
  }
]} />
```

### Adding Menu Items with Permissions

```typescript
export default function () {
  return {
    menuItems: [
      {
        id: 1,
        parentId: 0, // Top level if no parent
        text: "Menu Item",
        level: 0,
        route: "/path",
        iconKey: "iconName",
        permissions: ["REQUIRED_PERMISSION"]
      }
    ]
  };
}
```

### Error Handling

The core application uses `ErrorBoundary` components to gracefully handle module loading failures. Each microfrontend is wrapped in error boundaries in `mfeInit.tsx`.

## Monorepo Build System

This repository uses **Yarn Workspaces** for dependency management and custom build scripts for production deployment.

### Quick Commands

```bash
# Development
yarn dev              # Start all enabled dev servers
yarn dev:core         # Start only core
yarn dev:common       # Start only common library

# Production
yarn build:prod       # Build all modules → dist/
yarn preview          # Test production build locally

# Maintenance
yarn clean            # Remove all dist/ directories
```

### Module Selection

Configure which modules to build/run via `ENABLED_MFES` in:
- **Development**: `portaal-fe-core/.env.development`
- **Production**: `portaal-fe-core/.env.production`

```env
# Enable specific modules
ENABLED_MFES=dashboard,sales,hr,recruiting,stock

# Or enable ALL (leave empty)
ENABLED_MFES=
```

**Note**: `common` and `auth` are always enabled (required dependencies).

### Production Build Structure

The build system creates a Railway-ready structure:

```
dist/
├── index.html          # Core application (RELEASE_PATH=/)
├── *.js, *.css         # Core assets
├── common/             # RELEASE_PATH=common/
│   └── remoteEntry.js
├── auth/               # RELEASE_PATH=auth/
├── sales/              # RELEASE_PATH=sales/
└── ...                 # Other enabled modules
```

### VS Code Debugging

Pre-configured debug configurations in `.vscode/launch.json`:

- **🎯 Debug Full Application** - All modules with auto-start
- **🚀 Debug Core Only** - Just the shell application
- **🔧 Debug Single Module** - Individual module debugging

Press `F5` to start debugging with source maps enabled.

### Railway Deployment

The application is configured for automatic deployment on Railway:

1. **Push to git** → Railway detects changes
2. **Build**: Runs `yarn railway:build` (builds only enabled modules)
3. **Deploy**: Serves `dist/` via static server

Configuration files:
- `railway.json` - Build and deploy settings
- `.railwayignore` - Files excluded from deployment

See [BUILD.md](./BUILD.md) for detailed documentation.

## Repository Structure

This was originally a multi-repository project, now consolidated into a monorepo:

- **Root**: Workspace configuration and build scripts
- **`portaal-fe-*`**: Individual modules (previously separate repos)
- **`scripts/`**: Build automation (`build-all.js`, `dev-all.js`, etc.)
- **`dist/`**: Production build output (gitignored)

The `clone.sh` script is now legacy (was used to clone separate repos from Azure DevOps).
