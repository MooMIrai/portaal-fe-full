import React from "react";
import { Route, Routes } from "react-router-dom";
import Clienti from "./pages/Clienti/component";
import OffertePage from "./pages/Offerte/component";
import ProgettiPage from "./pages/Progetti/component";
import SalPage from "./pages/Sal/component";

const App = () => {
  return (
    <Routes>
      <Route path={"/clienti"} element={<Clienti />}></Route>
      <Route path={"/offerte"} element={<OffertePage />}></Route>
      <Route path={"/progetti"} element={<ProgettiPage />}></Route>
      <Route path={"/sal"} element={<SalPage />}></Route>
    </Routes>
  );
};

export default App;
