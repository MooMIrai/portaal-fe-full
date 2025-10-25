import React from "react";

import LookUps from "./pages/Main/component";
import Routes from 'common/Routes';

const App = () => {

  {/*return <Routes >
          <Route path={"/lookups"} element={<LookUps />} />
        </Routes> */}
  return (
    <Routes data={[
      {
        path:"/lookups",
        element:<LookUps />,
        permissions:["READ_LOOKUPS"]
      }
    ]} />
  
  );
};




export default App;
