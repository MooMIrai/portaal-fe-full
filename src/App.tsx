import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NonMain from "./pages/nonMain";
import Main from "./pages/main";

const App = () => {
  return (<Routes>
          <Route path={"/"} element={<Main />} />
          <Route path={"/nonmain"} element={<NonMain />} />
        </Routes>
  );
};

export default App;
