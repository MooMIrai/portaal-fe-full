import React, { useEffect } from "react";

import Report from "./pages/Report/component";
import { reportService } from "./services/ReportService";
import Routes from 'common/Routes';
import authService from 'common/services/AuthService';

const App = () => {

  useEffect(()=>{

    if(authService.hasPermission('READ_REPORTS')){
    reportService.getAllCategories().then(data=>{

      if(data && data.length){
        const menu=data.map((catName,index)=>{
          return {
              menu:{
                id:(150+index),
                text:catName,
                level:1,
                route:'/reports/'+catName,
                parentId: 15,
              }
            }
        });
        const event = new CustomEvent("AddMenuItems", { detail: menu})
        window.dispatchEvent(event);
      }
    })
  }
    
  },[]);

  /*return (<Routes >
          <Route path={"/reports"} element={<Report />} />
          <Route path={"/reports/:category"} element={<Report />} />
        </Routes>
  );*/

  return <Routes data={[
    {
      path:"/reports",
      element:<Report />,
      permissions:["READ_REPORTS"]
    },
    {
      path:"/reports/:category",
      element:<Report />,
      permissions:["READ_REPORTS"]
    }
  ]}/>
};




export default App;
