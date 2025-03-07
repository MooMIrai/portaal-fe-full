import React from "react";
import Routes from "common/Routes";
import Profile from "./pages/ProfilePage/component";
import { RolePage } from "./pages/Role/component";

export default function VisibleRoutes() {
  return (<Routes data={[
    {
      path:"profile",
      element:<Profile />,
      permissions:[]
    },
    {
      path:"/role",
      element:<RolePage />,
      permissions:["READ_ROLE"]
    }
  ]}></Routes>);
}
