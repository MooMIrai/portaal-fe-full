import Form from "common/Form";
import { WaitingProjectCustomFields, WaitingProjectFormFields } from "./form";
import React, { useEffect, useState } from "react";
import { CrudGenericService } from "../../services/personaleServices";
import NotificationActions from 'common/providers/NotificationProvider';

export function WaitingProjectCrud(props:any){
    
    const [formCompanyData,setformCompanyData] = useState<any>();

    useEffect(()=>{
        if(props.row){
            setformCompanyData({...props.row.Person,...props.row})
        }
    },[props.row])

    if(!formCompanyData){
        return <>Loading...</>
    }

    const handleSubmit= (data)=>{
        const d={...data};
        if(data.Company){
            d.company_id=data.Company.id
        }
        if(data.dailyCost && data.dailyCost.length){
            d.dailyCost=parseFloat(d.dailyCost);
        }
        CrudGenericService.upadateResourceAlignment(props.row.id,d).then(()=>{
            NotificationActions.openModal(
                { icon: true, style: "success" },
                "Operazione avvenuta con successo "
              );
            props.onClose();
        })
    }

    return <Form
            
            addedFields={WaitingProjectCustomFields}      
            fields={WaitingProjectFormFields.map(f=>{
                return {...f,disabled:props.type==='view'}
            })}
            formData={formCompanyData}
            onSubmit={props.type!=='view'?handleSubmit:()=>{}}
            showSubmit={props.type!=='view'}
            submitText={'Modifica'}
            />

}