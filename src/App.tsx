import React, { useEffect } from "react";
import {  Route, Routes } from "react-router-dom";
import { MainPage } from "./pages/Main/component";
import { notificationService } from "./services/notification";


const App = () => {

  useEffect(()=>{//on init
    
    notificationService.tryConnect().then(id=>{

    });
    
    const event = new CustomEvent("AddMenuItems", { detail: [
      {
        menu:{
          id:122,
          text:'categoria 4',
          level:1,
          route:'/notifications/cat/4',
          parentId: 12,
        },
        //route:<Route path={"/pippo"} element={<div>pippo</div>} />
      }
    ] });
    window.dispatchEvent(event);

    return ()=>{
      //ondestroy
    }

    
  },[]);

  return (<Routes >
          <Route path={"/notifications"} element={<MainPage />} />
          <Route path={"/notifications/inner"} element={<MainPage />} />
          <Route path={"/notifications/cat/:id"} element={<MainPage />} />
        </Routes>
  );
};




export default App;
