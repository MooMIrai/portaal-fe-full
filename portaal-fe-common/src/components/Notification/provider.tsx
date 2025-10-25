import { Button } from "@progress/kendo-react-buttons";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { NotificationGroup, Notification } from "@progress/kendo-react-notification";
import React, { createContext, PropsWithChildren, useState } from "react";
import LoaderComponent from "../Loader/component";

const NotificationContext = createContext({
    openModal:(type:{ icon?: boolean; style?: "none" | "info" | "success" | "warning" | "error"; },message:string)=>{},
    modal:{},
    openConfirm:(message:string,callback:()=>void,title?:string)=>{},
    confirm:{},
    openFilePreview:(url:string)=>{},
    openLoader:()=>{},
    closeLoader:()=>{}
  });
   
const NotificationProviderActions:{
  openModal:(type:{ icon?: boolean; style?: "none" | "info" | "success" | "warning" | "error"; },message:string) =>void;
  openConfirm:(message:string,callback:()=>void,title?:string,callbackFail?:()=>void)=>void,
  openFilePreview:(url:string)=>void,
  openLoader:()=>void,
  closeLoader:()=>void
} = {
  openModal:()=>{},
  openConfirm:(message:string,callback:()=>void,title?:string)=>{},
  openFilePreview:(url:string)=>{},
  openLoader:()=>{},
  closeLoader:()=>{}
}

const NotificationProvider = (props:PropsWithChildren) => {
    const [show, setShow] = useState<boolean>();
    const [modal,setModal] = useState<any>();

    const [showConfirm, setShowConfirm] = useState<boolean>();
    const [confirm,setConfirm] = useState<any>();

    const [showFile, setShowFile] = useState<boolean>();
    const [urlFile,setUrlFile] = useState<string>();

    const [showLoader, setShowLoader] = useState<boolean>(false);
    const [timeout,setTimeoutI] = useState<any>()
   
    const handleShow = (type:{ icon?: boolean; style?: "none" | "info" | "success" | "warning" | "error"; },message:string) =>{
      if(timeout){
        clearTimeout(timeout);
      }
      setModal({type,message});
      setShow(true);
      setTimeoutI(setTimeout(()=>{
        setShow(false);
      },5000))
      
    }

    const handleConfirmShow = (message:string,callback:()=>void,title?:string,callbackFail?:()=>void) =>{
      
      setConfirm({message,callback,title,callbackFail});
      setShowConfirm(true);
      
    }

    const handleFilePreview = (url:string) =>{
      
      setShowFile(true);
      setUrlFile(url);
      
    }

    const handleShowLoader = ()=>setShowLoader(true);
    const handleHideLoader = ()=>setShowLoader(false);

    NotificationProviderActions.openModal = handleShow;
    NotificationProviderActions.openConfirm = handleConfirmShow;
    NotificationProviderActions.openFilePreview = handleFilePreview;
    NotificationProviderActions.openLoader = handleShowLoader;
    NotificationProviderActions.closeLoader = handleHideLoader;

    return (
      <NotificationContext.Provider value={{ 
        openModal:handleShow,modal:modal,
         openConfirm:handleConfirmShow,
         confirm,openFilePreview:handleFilePreview,
         closeLoader:handleHideLoader,
         openLoader:handleShowLoader
          }}>
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
        {
          showLoader && <div style={{
            position:"fixed",
            top:0,bottom:0,
            left:0,right:0,
            background:'rgba(255,255,255,0.7)',
            zIndex:99999,
            display:'flex',
            alignItems:'center',
            justifyContent:'center'
            }}>
            <LoaderComponent size="large" type="infinite-spinner"/>
          </div>
        }
      </NotificationContext.Provider>
    );
   };
   
   export { NotificationProvider, NotificationContext };

   export default NotificationProviderActions;