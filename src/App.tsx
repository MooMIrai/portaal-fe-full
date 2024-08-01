import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PersonaleSection from "./component/TabPersonaleHR/component";
import PersonalePage from "./pages/Personale/component";

const App = () => {
  return (<Routes >
    <Route path={"/personale"} element={<PersonalePage></PersonalePage>}></Route>
  </Routes>
  
  );
};




export default App;
