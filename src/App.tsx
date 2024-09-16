import React from "react";
import { Route, Routes } from "react-router-dom";
import PersonaleSection from "./pages/Personale/component";
import Rapportino from "./pages/Rapportino/component";
import GestioneFeriePermessi from "./pages/GestioneFeriePermessi/component";


const App = () => {
  return (
    <Routes>
      <Route
        path={"/personale"}
        element={<PersonaleSection></PersonaleSection>}
      ></Route>
      <Route path={"/rapportino"} element={<Rapportino />}></Route>
      <Route path={"/gestioneFeriePermessi"} element={<GestioneFeriePermessi />}></Route>
    </Routes>
  );
};

export default App;
