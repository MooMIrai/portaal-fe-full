import React from "react";
import {  Route, Routes } from "react-router-dom";
import { MainPage } from "./pages/Main/component";


const App = () => {
  return (<Routes >
          <Route path={"/notifications"} element={<MainPage />} />
          <Route path={"/notifications/inner"} element={<MainPage />} />
        </Routes>
  );
};




export default App;
