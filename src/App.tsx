import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PersonaleSection from "./pages/Personale/component";
import Rapportino from "./pages/Rapportino/component";

const App = () => {
  return (
    <Routes>
      <Route
        path={"/personale"}
        element={<PersonaleSection></PersonaleSection>}
      ></Route>
      <Route path={"/rapportino"} element={<Rapportino />}></Route>
    </Routes>
  );
};

export default App;
