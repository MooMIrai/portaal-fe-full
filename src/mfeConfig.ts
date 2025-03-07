
          import React from 'react';

          export const menuToImport = [
            import("auth/Index"),
			import("lookups/Index"),
			import("sales/Index"),
			import("hr/Index"),
			import("recruiting/Index"),
			import("stock/Index"),
			import("notification/Index"),
			import("reports/Index")
          ];
          
          export const routesToImport = [
             React.lazy(()=> import("auth/VisibleRoutes")),
             React.lazy(() => import("lookups/Routes")),
			React.lazy(() => import("sales/Routes")),
			React.lazy(() => import("hr/Routes")),
			React.lazy(() => import("recruiting/Routes")),
			React.lazy(() => import("stock/Routes")),
			React.lazy(() => import("notification/Routes")),
			React.lazy(() => import("reports/Routes"))
          ];

          export const routesLoginToImport = [
            React.lazy(() => import("auth/Routes"))
          ];
          