import React from "react";
import { Navigate, Route, RouteProps, Routes } from "react-router-dom";
import AuthService from "../../services/AuthService";

type PRouteProps  = RouteProps & {
  permissions?: string[]; // Permessi richiesti per accedere alla rotta
}

const ProtectedRoute: React.FC<PRouteProps> = (props) => {
  // Verifica se l'utente ha i permessi necessari
  const granted = !props.permissions || props.permissions.length === 0 || props.permissions.some(AuthService.hasPermission);

  // Se non ha permessi, lo reindirizza alla pagina di accesso negato
  if (!granted) {
    return  <Route path={props.path} element={<Navigate to="/unauthorized" replace />} />;
  }

  // Se ha i permessi, renderizza il contenuto dell'outlet
  return <Route {...props} />;
};

export default ProtectedRoute;
