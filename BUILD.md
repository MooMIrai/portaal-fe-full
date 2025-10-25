# Build System Documentation

## Quick Start

### Development

```bash
# Install all dependencies
yarn install

# Start all enabled dev servers
yarn dev

# Start only core and common
yarn dev:core  # Terminal 1
yarn dev:common  # Terminal 2
```

### Production Build

```bash
# Build all modules for production
yarn build:prod

# Preview production build locally
yarn preview
```

### Clean

```bash
# Remove all build artifacts
yarn clean
```

---

## Module Configuration

### Enabling/Disabling Modules

Modules are configured via `ENABLED_MFES` in environment files:

**Development:** `portaal-fe-core/.env.development`
**Production:** `portaal-fe-core/.env.production`

```env
# Enable specific modules (comma-separated)
ENABLED_MFES=dashboard,sales,hr,recruiting

# Or leave empty to enable ALL modules
ENABLED_MFES=
```

**Note:** `common` and `auth` are always enabled (required dependencies).

### Available Modules

- `auth` - Authentication & role management (always enabled)
- `chatbot` - AI chatbot interface
- `dashboard` - Main dashboard
- `hr` - Human resources
- `lookups` - Lookup data management
- `notification` - Notifications system
- `personalarea` - Personal area (can be disabled)
- `recruiting` - Recruitment management
- `reports` - Reporting system
- `sales` - Sales management
- `stock` - Stock management

---

## VS Code Debugging

### Setup

1. Press `F5` or use **Run and Debug** panel
2. Select configuration:
   - **🎯 Debug Full Application** - Debug entire app with all modules
   - **🚀 Debug Core Only** - Debug just the core shell
   - **🔧 Debug Single Module** - Debug individual module

### Debug Configurations

| Configuration | Port | Purpose |
|--------------|------|---------|
| Debug Core App | 3000 | Main application entry point |
| Debug Auth | 3006 | Authentication module |
| Debug Sales | 3008 | Sales module |
| Debug HR | 3009 | HR module |
| Debug Common Library | 3003 | Shared components |

### Source Maps

All webpack configs have source maps enabled for development. Production builds can optionally enable them by setting:

```javascript
// webpack.config.js
devtool: 'source-map'  // For production debugging
```

---

## Railway Deployment

### Automatic Deployment

1. Push to your git repository:
   ```bash
   git add .
   git commit -m "Update application"
   git push origin production
   ```

2. Railway automatically:
   - Detects changes via `railway.json`
   - Runs `yarn railway:build`
   - Builds only enabled modules
   - Serves via `npx serve dist`

### Manual Build (Testing Railway Build Locally)

```bash
# Simulate Railway build process
yarn railway:build

# Serve the result
npx serve dist -p 3000
```

### Environment Variables on Railway

Set these in Railway dashboard:

```
ENABLED_MFES=dashboard,sales,hr,recruiting,stock,reports,notification,chatbot
NODE_ENV=production
```

### Build Performance

Railway free tier limits:
- Build time: ~10 minutes max
- Memory: 512MB during build

Our optimizations:
- Only builds enabled modules
- Yarn workspace caching
- Parallel builds where possible

---

## Build Scripts

### `build-all.js`

Builds all enabled modules in correct order (common first, then others).

**Features:**
- Reads `ENABLED_MFES` from environment
- Always builds `common` and `core` (required)
- Shows build progress and timing
- Exits with error code if any build fails

### `copy-to-dist.js`

Copies built artifacts to Railway-ready structure:

```
dist/
├── index.html          (core)
├── *.js, *.css         (core assets)
├── common/
│   └── remoteEntry.js
├── auth/
├── sales/
└── ...
```

### `dev-all.js`

Starts all enabled dev servers in parallel.

**Features:**
- Reads `ENABLED_MFES` from `.env.development`
- Launches each module on its configured port
- Aggregates logs from all servers
- Graceful shutdown with Ctrl+C

### `clean-all.js`

Removes all `dist/` directories from modules and root.

---

## Yarn Workspaces

The monorepo uses Yarn workspaces to share dependencies:

```json
{
  "workspaces": [
    "portaal-fe-*"
  ]
}
```

**Benefits:**
- Single `node_modules` in root
- Faster installs
- Deduplicated dependencies
- Easier dependency management

**Note:** Each module still has its own `package.json` for module-specific dependencies.

---

## Directory Structure

```
portaal-fe-full/
├── package.json              # Root workspace config
├── railway.json              # Railway deployment config
├── CLAUDE.md                 # Architecture documentation
├── BUILD.md                  # This file
│
├── scripts/
│   ├── build-all.js          # Production build script
│   ├── copy-to-dist.js       # Dist structure creator
│   ├── dev-all.js            # Dev server launcher
│   └── clean-all.js          # Cleanup script
│
├── .vscode/
│   ├── launch.json           # Debug configurations
│   ├── tasks.json            # VS Code tasks
│   └── extensions.json       # Recommended extensions
│
├── dist/                     # Production build output (gitignored)
│
└── portaal-fe-*/             # Individual modules
    ├── src/
    ├── dist/                 # Module build output
    ├── webpack.config.js
    ├── package.json
    └── .env.production
```

---

## Troubleshooting

### Build fails with "Module not found"

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Check if module exists in filesystem

3. Verify module is in `ENABLED_MFES`

### Dev servers won't start

1. Check ports aren't already in use:
   ```bash
   lsof -i :3000
   lsof -i :3003
   ```

2. Kill existing processes:
   ```bash
   pkill -f webpack-dev-server
   ```

3. Restart:
   ```bash
   yarn dev
   ```

### Railway build timeout

1. Reduce enabled modules in production
2. Check Railway build logs
3. Optimize webpack configs (split chunks, reduce bundle size)

### Debug breakpoints not hitting

1. Ensure source maps are enabled in webpack config
2. Check `webRoot` in `.vscode/launch.json` matches your module
3. Verify dev server is running
4. Try restarting VS Code debugger

---

## Performance Tips

### Development

- Start only modules you're working on
- Use `yarn dev:core` + `yarn dev:common` for minimal setup
- Disable modules via `ENABLED_MFES` in `.env.development`

### Production

- Enable only necessary modules
- Use production builds for testing
- Monitor Railway build times
- Consider CDN for static assets

---

## Further Reading

- [CLAUDE.md](./CLAUDE.md) - Architecture documentation
- [Railway Docs](https://docs.railway.app/)
- [Module Federation](https://webpack.js.org/concepts/module-federation/)
