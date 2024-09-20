import { Button } from "@progress/kendo-react-buttons";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { NotificationGroup, Notification } from "@progress/kendo-react-notification";
import React, { createContext, PropsWithChildren, useState } from "react";

const NotificationContext = createContext({
    openModal:(type:{ icon?: boolean; style?: "none" | "info" | "success" | "warning" | "error"; },message:string)=>{},
    modal:{},
    openConfirm:(message:string,callback:()=>void,title?:string)=>{},
    confirm:{}
  });
   
const NotificationProviderActions:{
  openModal:(type:{ icon?: boolean; style?: "none" | "info" | "success" | "warning" | "error"; },message:string) =>void;
  openConfirm:(message:string,callback:()=>void,title?:string)=>void
} = {
  openModal:()=>{},
  openConfirm:(message:string,callback:()=>void,title?:string)=>{}
}

const NotificationProvider = (props:PropsWithChildren) => {
    const [show, setShow] = useState<boolean>();
    const [modal,setModal] = useState<any>();

    const [showConfirm, setShowConfirm] = useState<boolean>();
    const [confirm,setConfirm] = useState<any>();
   
    const handleShow = (type:{ icon?: boolean; style?: "none" | "info" | "success" | "warning" | "error"; },message:string) =>{
      
      setModal({type,message});
      setShow(true);
      
    }

    const handleConfirmShow = (message:string,callback:()=>void,title?:string) =>{
      
      setConfirm({message,callback,title});
      setShowConfirm(true);
      
    }

    NotificationProviderActions.openModal = handleShow;
    NotificationProviderActions.openConfirm = handleConfirmShow;

    return (
      <NotificationContext.Provider value={{ openModal:handleShow,modal:modal, openConfirm:handleConfirmShow,confirm }}>
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
        {
          showConfirm && <Dialog title={confirm.title} width={350} onClose={()=>setShowConfirm(false)} >
            <div>
              <p>{confirm.message}</p>
            </div>
            <DialogActionsBar layout={"stretched"}>
            
            <Button type="button" themeColor={"primary"} onClick={()=>setShowConfirm(false)}>
              No
            </Button>
            <Button type="button" onClick={()=>{
              confirm.callback();
              setShowConfirm(false)
            }}>
              Si
            </Button>
          </DialogActionsBar>
          </Dialog>
        }
      </NotificationContext.Provider>
    );
   };
   
   export { NotificationProvider, NotificationContext };

   export default NotificationProviderActions;