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
                const data = formRef.current.values;
                const mappedObj = {};
                    Object.keys(data).forEach(key => {
                        const v = data[key];
                        mappedObj[key] = v.id ? v.id : v;
                });
               notificationServiceHttp.updateResponse(props.id,JSON.stringify(mappedObj)).then(()=>{
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
                    fields={props.responseType?.validations ? props.responseType.validations : null} 
                    onSubmit={handleSubmit}
                />
            </Modal>
            
}