import React, { forwardRef, useState } from "react";
import { RecipientsSelector } from "../RecipientsSelector/component";
import Button from 'common/Button';
import styles from './style.module.scss';
import Form from 'common/Form';
import { MessageRecipientFormCustomFields } from "./fields";
import { MessageRecipientForm } from "./form";

export const RecipientsManager=forwardRef<any, any>(({  }, ref) => {

    const [to,setTo] = useState<any[]>([]);
    const [cc,setCc] = useState<any[]>([]);
    const [bcc,setBcc] = useState<any[]>([]);

   /* const [selectAll, setSelecAll]= useState<string>();


    const handleChangeSelectAll = (type:string)=>{
        if(selectAll===type){
            setSelecAll(undefined)
        }else{
            setSelecAll(type);
        }
    }*/

    return <div className={styles.container}>
        <Form
            ref={ref}
            fields={MessageRecipientForm}
            formData={{}}
            addedFields={MessageRecipientFormCustomFields}
            onSubmit={(data)=>data}
        />
        
        
    </div>

})