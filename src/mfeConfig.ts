
          import React from 'react';

          export const menuToImport = [
            import("lookups/Index"),
			import("sales/Index"),
			import("hr/Index"),
			import("stock/Index"),
			import("notification/Index")
          ];
          
          export const routesToImport = [
             React.lazy(()=> import("auth/VisibleRoutes")),
             React.lazy(() => import("lookups/Routes")),
			React.lazy(() => import("sales/Routes")),
			React.lazy(() => import("hr/Routes")),
			React.lazy(() => import("stock/Routes")),
			React.lazy(() => import("notification/Routes"))
          ];

          export const routesLoginToImport = [
            React.lazy(() => import("auth/Routes"))
          ];
          