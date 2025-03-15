import React from "react";

import PersonaleSection from "./pages/Personale/component";
import Rapportino from "./pages/Rapportino/component";
import GestioneFeriePermessi from "./pages/GestioneFeriePermessi/component";
import Societa from "./pages/Società/component";
import Routes from 'common/Routes';
import { WaitingProject } from "./pages/Waitingproject/component";


const App = () => {
  return (
    <Routes data={[
      {
        path:"/personale",
        element:<PersonaleSection />,
        permissions:["READ_HR_EMPLOYEE"]
      },
      {
        path:"/rapportino",
        element:<Rapportino />,
        permissions:["READ_HR_TIMESHEET"]
      },
      {
        path:"/gestioneFeriePermessi",
        element:<GestioneFeriePermessi />,
        permissions:["READ_HR_HOLIDAY"]
      },
      {
        path:"/societa",
        element:<Societa />,
        permissions:["READ_HR_COMPANY"]
      },
      {
        path:"/attesaprogetto",
        element:<WaitingProject />,
        permissions:["READ_RESOURCE_ALIGNMENT"]
      }
    ]} />
    /*<Routes>
      <Route
        path={"/personale"}
        element={<PersonaleSection></PersonaleSection>}
      ></Route>
      <Route path={"/rapportino"} element={<Rapportino />}></Route>
      <Route path={"/gestioneFeriePermessi"} element={<GestioneFeriePermessi />}></Route>
      <Route path={"/societa"} element={<Societa/>}></Route>
    </Routes>*/
  );
};

export default App;
