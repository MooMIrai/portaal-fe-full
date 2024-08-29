import React from "react";
import { Route, Routes } from "react-router-dom";
import PersonaleSection from "./pages/Personale/component";
import Rapportino from "./pages/Rapportino/component";
import Clienti from "./pages/Clienti/component";
import GestioneFeriePermessi from "./pages/GestioneFeriePermessi/component";
import OffertePage from "./pages/Offerte/component";
import ProgettiPage from "./pages/Progetti/component";

const App = () => {
  return (
    <Routes>
      <Route
        path={"/personale"}
        element={<PersonaleSection></PersonaleSection>}
      ></Route>
      <Route path={"/rapportino"} element={<Rapportino />}></Route>
      <Route path={"/clienti"} element={<Clienti />}></Route>
      <Route path={"/offerte"} element={<OffertePage />}></Route>
      <Route path={"/gestioneFeriePermessi"} element={<GestioneFeriePermessi />}></Route>
      <Route path={"/progetti"} element={<ProgettiPage />}></Route>
    </Routes>
  );
};

export default App;
