import React, { useRef } from "react";
import Modal from 'common/Modal';
import { MessageResponseForm } from "./form";
import { notificationServiceHttp } from "../../services/notificationService";

export function MessageResponse(props:{id:number,responseType:any, onClose:()=>void}){

    const formRef = useRef<any>();
    
    const handleSubmit = ()=>{

        if(formRef.current){
            formRef.current.onSubmit();
            if (formRef.current.isValid()) {

               notificationServiceHttp.updateResponse(props.id,JSON.stringify(formRef.current.values)).then(()=>{
                    props.onClose();
               });
              
            }
        }
    }

    return <Modal 
                isOpen={props.responseType} 
                title={"Rispondi alla Notifica"}
                callToAction={"Invia Risposta"} 
                onClose={props.onClose}
                onSubmit={handleSubmit}
                width={'60%'}
                showModalFooter={true}>

                <MessageResponseForm 
                    ref={formRef} 
                    fields={props.responseType?.validations ? JSON.parse(props.responseType.validations) : null} 
                    onSubmit={handleSubmit}
                />
            </Modal>
            
}