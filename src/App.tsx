import React, { useEffect } from "react";
import {  Route, Routes } from "react-router-dom";
import { InboxPage } from "./pages/Inbox/component";
import { useSocketConnected } from "./hooks/useSocket";
import { SentPage } from "./pages/Sent/component";
import NotificationProviderActions from "common/providers/NotificationProvider";
import { notificationServiceHttp } from "./services/notificationService";

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

    notificationServiceHttp.getMyUnreadCount()
    
    return ()=>{
      //ondestroy
    }
    
  },[]); 

  return (<Routes >
          <Route path={"/notifications/inbox"} element={<InboxPage />} />
          <Route path={"/notifications/inbox/:id"} element={<InboxPage />} />
          <Route path={"/notifications/manager"} element={<SentPage />} />
        </Routes>
  );
};




export default App;
