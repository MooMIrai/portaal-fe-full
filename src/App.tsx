import React, { useEffect } from "react";
import { InboxPage } from "./pages/Inbox/component";
import { useSocketConnected } from "./hooks/useSocket";
import { SentPage } from "./pages/Sent/component";
import NotificationProviderActions from "common/providers/NotificationProvider";
import { notificationServiceHttp } from "./services/notificationService";
import Routes from 'common/Routes';
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

  return (
    <Routes data={[
      {
        path:"/notifications/inbox",
        element:<InboxPage />,
        permissions:["READ_NOTIFICATION_INBOX"]
      },
      {
        path:"/notifications/inbox/:id",
        element:<InboxPage />,
        permissions:["READ_NOTIFICATION_INBOX"]
      },
      {
        path:"/notifications/inviate",
        element:<SentPage />,
        permissions:["READ_NOTIFICATION_MANAGER"]
      }
    ]}></Routes>
    /*<Routes >
          <Route path={"/notifications/inbox"} element={<InboxPage />} />
          <Route path={"/notifications/inbox/:id"} element={<InboxPage />} />
          <Route path={"/notifications/manager"} element={<SentPage />} />
        </Routes>*/
  );
};




export default App;
