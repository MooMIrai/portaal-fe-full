import React from "react";
import {  Route, Routes } from "react-router-dom";
import LookUps from "./pages/Main/component";

const App = () => {
  return (<Routes >
          <Route path={"/lookups"} element={<LookUps />} />
        </Routes>
  );
};




export default App;
