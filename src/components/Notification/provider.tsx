import { Button } from "@progress/kendo-react-buttons";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { NotificationGroup, Notification } from "@progress/kendo-react-notification";
import React, { createContext, PropsWithChildren, useState } from "react";

const NotificationContext = createContext({
    openModal:(type:{ icon?: boolean; style?: "none" | "info" | "success" | "warning" | "error"; },message:string)=>{},
    modal:{},
    openConfirm:(message:string,callback:()=>void,title?:string)=>{},
    confirm:{},
    openFilePreview:(url:string)=>{}
  });
   
const NotificationProviderActions:{
  openModal:(type:{ icon?: boolean; style?: "none" | "info" | "success" | "warning" | "error"; },message:string) =>void;
  openConfirm:(message:string,callback:()=>void,title?:string,callbackFail?:()=>void)=>void,
  openFilePreview:(url:string)=>void
} = {
  openModal:()=>{},
  openConfirm:(message:string,callback:()=>void,title?:string)=>{},
  openFilePreview:(url:string)=>{}
}

const NotificationProvider = (props:PropsWithChildren) => {
    const [show, setShow] = useState<boolean>();
    const [modal,setModal] = useState<any>();

    const [showConfirm, setShowConfirm] = useState<boolean>();
    const [confirm,setConfirm] = useState<any>();

    const [showFile, setShowFile] = useState<boolean>();
    const [urlFile,setUrlFile] = useState<string>();
   
    const handleShow = (type:{ icon?: boolean; style?: "none" | "info" | "success" | "warning" | "error"; },message:string) =>{
      
      setModal({type,message});
      setShow(true);
      
    }

    const handleConfirmShow = (message:string,callback:()=>void,title?:string,callbackFail?:()=>void) =>{
      
      setConfirm({message,callback,title,callbackFail});
      setShowConfirm(true);
      
    }

    const handleFilePreview = (url:string) =>{
      
      setShowFile(true);
      setUrlFile(url);
      
    }

    NotificationProviderActions.openModal = handleShow;
    NotificationProviderActions.openConfirm = handleConfirmShow;
    NotificationProviderActions.openFilePreview = handleFilePreview;

    return (
      <NotificationContext.Provider value={{ openModal:handleShow,modal:modal, openConfirm:handleConfirmShow,confirm,openFilePreview:handleFilePreview }}>
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
            
            <Button type="button" themeColor={"primary"} onClick={()=>{
              if(confirm.callbackFail)
                confirm.callbackFail();
              setShowConfirm(false)
              }}>
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
        
        {showFile && <Dialog title={"Anteprima File"} width={"100%"} height={'100%'} onClose={()=>setShowFile(false)} >
            <iframe src={urlFile}  width={'100%'} height={'100%'}>
            </iframe>
          </Dialog>
        }
      </NotificationContext.Provider>
    );
   };
   
   export { NotificationProvider, NotificationContext };

   export default NotificationProviderActions;