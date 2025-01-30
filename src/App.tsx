import React, { useEffect } from "react";
import {  Route, Routes } from "react-router-dom";
import { MainPage } from "./pages/Main/component";
import { notificationService } from "./services/notification";


const App = () => {

  useEffect(()=>{//on init
    
    notificationService.tryConnect().then(id=>{

    });
    
   

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
