import React from "react";
import { Route, Routes } from "react-router-dom";
import Profile from "./pages/ProfilePage/component";

export default function VisibleRoutes() {
  return (
    <Routes>
      <Route path="/profile" element={<Profile />}></Route>
    </Routes>
  );
}
