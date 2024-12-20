import React, { useState } from "react";
import Modal from 'common/Modal';
import Form from 'common/Form';
import Loader from 'common/Loader';

export function AiTextArea(props:{
    isOpen:boolean,
    loading:boolean,
    onConfirm:(text:string)=>void,
    onAbort:()=>void
}){

    return <Modal
            title="Copia testo Richiesta"
            isOpen={props.isOpen}
            onClose={props.onAbort}
            /*width="100%"
            height="100%"*/
        >
         <Form submitText={"Conferma"}
            
            formData={{
                testo:''
            }}
            fields={[{
                name: "testo",
                label: "Testo Richiesta",
                type: "textarea",
                value: '',
                disabled:props.loading,
                required: true
            }]}
            showSubmit={true}
            extraButton={true}
            extraBtnAction={props.onAbort}
            onSubmit={(formData)=>props.onConfirm(formData.testo)}
        />
        {
            props.loading ?
            
            <div style={{
                display:'flex',
                justifyContent:'center',
                alignItems:'center',
                position:'absolute',top:0,bottom:0,left:0,right:0,background:'rgba(255, 255, 255, 0.4)'}}>
                <Loader />
            </div>
            

            :null
        }
        </Modal>
}