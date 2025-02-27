import React from 'react';
import DevicePage from './pages/Device/component';
import Routes from 'common/Routes';

export default function(){
    return <Routes data={[
      {
        path:"/device",
        element:<DevicePage />,
        permissions:["READ_STOCK"]
      }
    ]}></Routes>
    /*<Routes>
    <Route
      path={"/device"}
      element={<DevicePage /> }
    ></Route>
    
    
  </Routes>*/
}