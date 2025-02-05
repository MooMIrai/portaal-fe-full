import React, { useEffect } from "react";
import {  Route, Routes } from "react-router-dom";
import { notificationService } from "./services/notification";
import { InboxPage } from "./pages/Inbox/component";


const App = () => {

  useEffect(()=>{//on init
    
    notificationService.tryConnect().then(id=>{

      notificationService.listen('newNotification',(data)=>{
        debugger;
      });


    });
    

   

    return ()=>{
      //ondestroy
    }
    
  },[]);

  return (<Routes >
          <Route path={"/notifications/inbox"} element={<InboxPage />} />
        </Routes>
  );
};




export default App;
