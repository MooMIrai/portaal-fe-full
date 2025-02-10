import React, { useEffect } from "react";
import {  Route, Routes } from "react-router-dom";
import { InboxPage } from "./pages/Inbox/component";
import { useSocketConnected } from "./hooks/useSocket";
import { SentPage } from "./pages/Sent/component";
import NotificationProviderActions from "common/providers/NotificationProvider";

const App = () => {

  useSocketConnected();

  useEffect(()=>{//on init
    
    if(Notification.permission!=='granted'){
      Notification.requestPermission().then((result) => {
          if(result==='denied'){
            NotificationProviderActions.openModal(
              { icon: true, style: "warning" },
              "Attenzione hai disabilitato le notifiche del browser, se vuoi essere al corrente dei messaggi in arrivo riattivale dalle impostazioni del browser."
          );
            
          }
      });
    }
    
    return ()=>{
      //ondestroy
    }
    
  },[]); 

  return (<Routes >
          <Route path={"/notifications/inbox"} element={<InboxPage />} />
          <Route path={"/notifications/inbox/:id"} element={<InboxPage />} />
          <Route path={"/notifications/sent"} element={<SentPage />} />
        </Routes>
  );
};




export default App;
