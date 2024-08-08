import { NotificationGroup, Notification } from "@progress/kendo-react-notification";
import React, { createContext, PropsWithChildren, useState } from "react";

const NotificationContext = createContext({
    openModal:(type:{ icon?: boolean; style?: "none" | "info" | "success" | "warning" | "error"; },message:string)=>{},
    modal:{}
  });
   
const NotificationProviderActions:{
  openModal:(type:{ icon?: boolean; style?: "none" | "info" | "success" | "warning" | "error"; },message:string) =>void;
} = {
  openModal:()=>{}
}

const NotificationProvider = (props:PropsWithChildren) => {
    const [show, setShow] = useState<boolean>();
    const [modal,setModal] = useState<any>();
   
    const handleShow = (type:{ icon?: boolean; style?: "none" | "info" | "success" | "warning" | "error"; },message:string) =>{
      
      setModal({type,message});
      setShow(true);
      
    }

    NotificationProviderActions.openModal = handleShow;

    return (
      <NotificationContext.Provider value={{ openModal:handleShow,modal:modal }}>
        {props.children}
        <NotificationGroup
            
            style={{
              top: 20,
              right: 20,
              alignItems: "flex-start",
              flexWrap: "wrap",
              zIndex:999999
            }}
          >

            {
              (show && modal) && <Notification
              type={modal.type}
              closable={true}
              onClose={() => setShow(false)}
            >
              {modal.message}
            </Notification>
            }

        </NotificationGroup>
      </NotificationContext.Provider>
    );
   };
   
   export { NotificationProvider, NotificationContext };

   export default NotificationProviderActions;