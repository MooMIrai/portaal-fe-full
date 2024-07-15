import React from "react";
import { Link, Outlet } from "react-router-dom";
import { lookUpsRoutingPrefix } from "../routing/constants";

export function Layout() {
  return (
    <>
      <nav style={{ marginBottom: "3rem" }}>
        <Link
          to={`/${lookUpsRoutingPrefix}/page-1`}
          style={{ marginRight: "1rem" }}
        >
          App1 Page1
        </Link>
      </nav>
      <Outlet />
    </>
  );
}
