# Portaal Frontend Microservices Port Configuration

This document lists all the port assignments for the Portaal frontend microservices.

## Core Application
- **portaal-fe-core**: http://localhost:3000
  - Main application shell that loads all microfrontends
  - Module Federation host application

## Microservices

| Service | Port | Module Name | Description |
|---------|------|-------------|-------------|
| portaal-fe-common | 3003 | common | Shared components and utilities |
| portaal-fe-auth | 3006 | auth | Authentication module |
| portaal-fe-lookUps | 3005 | lookups | Lookup data management |
| portaal-fe-personalarea | 3007 | personalarea | Personal area module (not referenced in core) |
| portaal-fe-sales | 3008 | sales | Sales module |
| portaal-fe-hr | 3009 | hr | Human Resources module |
| portaal-fe-recruiting | 3011 | recruiting | Recruiting module |
| portaal-fe-stock | 3012 | stock | Stock/Inventory module |
| portaal-fe-notifications | 3013 | notification | Notifications module |
| portaal-fe-reports | 3015 | reports | Reports module |
| portaal-fe-chatbot | 3018 | chatbot | Chatbot module |
| portaal-fe-dashboard | 3020 | dashboard | Dashboard module |
| portaal-fe-reporteditor | 3021 | reporteditor | Report Editor module |
| portaal-fe-dashboard-editor | 3022 | dashboardeditor | Dashboard Widget Editor module |

## Module Federation Configuration

The core application loads remote modules from the following URLs in development:

```javascript
{
  common: "common@http://localhost:3003/remoteEntry.js",
  auth: "auth@http://localhost:3006/remoteEntry.js",
  lookups: "lookups@http://localhost:3005/remoteEntry.js",
  sales: "sales@http://localhost:3008/remoteEntry.js",
  hr: "hr@http://localhost:3009/remoteEntry.js",
  recruiting: "recruiting@http://localhost:3011/remoteEntry.js",
  stock: "stock@http://localhost:3012/remoteEntry.js",
  notification: "notification@http://localhost:3013/remoteEntry.js",
  reports: "reports@http://localhost:3015/remoteEntry.js",
  chatbot: "chatbot@http://localhost:3018/remoteEntry.js",
  dashboard: "dashboard@http://localhost:3020/remoteEntry.js",
  reporteditor: "reporteditor@http://localhost:3021/remoteEntry.js",
  dashboardeditor: "dashboardeditor@http://localhost:3022/remoteEntry.js"
}
```

## Starting All Services

To start all services, you need to run `npm start` in each microservice directory. Only `portaal-fe-core` will automatically open the browser.

## Troubleshooting

If http://localhost:3000 shows an error:

1. **Check that all microservices are running** - The core application requires all remote modules to be available
2. **Verify ports are not in use** - Use `lsof -i :PORT` or `netstat -an | grep PORT` to check
3. **Check browser console** - Look for module loading errors or CORS issues
4. **Review error logs** - Enhanced error logging has been added to App.tsx and mfeInit.tsx

## Notes

- personalarea module exists but is not referenced in the core's webpack configuration
- All microservices use webpack-dev-server for development
- Module Federation is used for runtime integration of microfrontends