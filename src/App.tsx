import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PersonaleSection from "./pages/Personale/component";
import Rapportino from "./pages/Rapportino/component";
import Clienti from "./pages/Clienti/component";

const App = () => {
  return (
    <Routes>
      <Route
        path={"/personale"}
        element={<PersonaleSection></PersonaleSection>}
      ></Route>
      <Route path={"/rapportino"} element={<Rapportino />}></Route>
      <Route path={"/clienti"} element={<Clienti />}></Route>
    </Routes>
  );
};

export default App;
