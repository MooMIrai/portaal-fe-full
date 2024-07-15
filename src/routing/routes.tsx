import React, { lazy, Suspense } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import { Layout } from "../pages/Layout";
import { lookUpsRoutingPrefix } from "./constants";

const LookUpsLazy = lazy(() => import("../pages/LookUps"));

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to={`/${lookUpsRoutingPrefix}`} />,
      },
      {
        path: `/${lookUpsRoutingPrefix}/*`,
        element: (
          <Suspense fallback="Loading LookUps...">
            <LookUpsLazy />
          </Suspense>
        ),
      },
    ],
  },
];
