import React, { useEffect } from "react";
import {  Route, Routes } from "react-router-dom";
import Report from "./pages/Report/component";
import { reportService } from "./services/ReportService";

const App = () => {

  useEffect(()=>{

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
    
  },[]);

  return (<Routes >
          <Route path={"/reports"} element={<Report />} />
          <Route path={"/reports/:category"} element={<Report />} />
        </Routes>
  );
};




export default App;
