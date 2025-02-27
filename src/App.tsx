import React from "react";

import Clienti from "./pages/Clienti/component";
import OffertePage from "./pages/Offerte/component";
import ProgettiPage from "./pages/Progetti/component";
import SalPage from "./pages/Sal/component";
import Routes from 'common/Routes';

const App = () => {
  return (

    <Routes data={[
      {
        path:"/clienti",
        element:<Clienti />,
        permissions:["READ_SALES_CUSTOMER"]
      },
      {
        path:"/offerte",
        element:<OffertePage />,
        permissions:["READ_SALES_OFFER"]
      },
      {
        path:"/progetti",
        element:<ProgettiPage />,
        permissions:["READ_SALES_PROJECT"]
      },
      {
        path:"/sal",
        element:<SalPage />,
        permissions:["READ_SALES_SAL"]
      }
    ]}></Routes>
    /*<Routes>
      <Route path={"/clienti"} element={<Clienti />}></Route>
      <Route path={"/offerte"} element={<OffertePage />}></Route>
      <Route path={"/progetti"} element={<ProgettiPage />}></Route>
      <Route path={"/sal"} element={<SalPage />}></Route>
    </Routes>*/
  );
};

export default App;
