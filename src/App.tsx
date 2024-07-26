import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PersonaleSection from "./pages/Personale/component";

const App = () => {
  return (<Routes >
    <Route path={"/personale"} element={<PersonaleSection></PersonaleSection>}></Route>
  </Routes>
  
  );
};




export default App;
