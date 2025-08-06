import React from "react";
import { Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard/component";
import AuthService from "common/services/AuthService";

const DashboardRoutes = () => {
  // Check permissions (empty array means accessible to all authenticated users)
  const permissions: string[] = [];
  const granted = permissions.length === 0 || permissions.some(p => AuthService.hasPermission(p));
  
  if (!granted) {
    return (
      <Routes>
        <Route path="/dashboard/*" element={<div>Accesso negato</div>} />
      </Routes>
    );
  }
  
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
    </Routes>
  );
};

export default DashboardRoutes;