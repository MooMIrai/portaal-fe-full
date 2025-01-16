import React, { useEffect, useState } from "react";
import Form from 'common/Form';
import { contactForm } from "./form";
import { contactAddedFields } from "./customFields";
import { contactService } from "../../services/contactService";
import NotificationProviderActions from "common/providers/NotificationProvider";

const mapContactType = rowData=>{
    let tipoText = "";
    switch (rowData.ContactType) {
        case "SCREENING":
            tipoText = 'Screening Telefonico';
            break;
        case "EMAIL":
            tipoText = 'Email';
            break;
        case "IN_PERSON":
            tipoText = 'Di persona';
            break;
    }
    return tipoText
}

export function CandidateContact(props:{currentData:any,assignmentId: number, onChange: (interviews: any[]) => void }){

    const [formData,setFormData] = useState<any>();

    useEffect(()=>{
        debugger;
        setFormData(props.currentData?{
            ...props.currentData,
            date_log:props.currentData.date_log?new Date(props.currentData.date_log):undefined,
            ContactType:props.currentData.ContactType?{
                id:props.currentData.ContactType,
                name:mapContactType(props.currentData)
            }:{}
        }:{});
    },[props.currentData])

    const handleSubmit = (data)=>{
        //create
        
        const mappedData = {
            ...data,
            assignment_id:props.assignmentId,
            ContactType: data.ContactType.id
        }
        let promise:()=>Promise<any> = ()=>contactService.createResource(mappedData);
        if(formData.id){
            //edit
            promise = ()=>contactService.updateResource(formData.id,mappedData);
        }
        
        promise().then(result=>{
            NotificationProviderActions.openModal(
                { icon: true, style: "success" },
                "Operazione avvenuta con successo"
              );
              props.onChange(result)
        })
    }

    return  <div style={{ display: "flex", flexDirection: 'column', gap: 20, margin: 50, marginTop: 20 }}>
                <h2>Contatto</h2>
                
                {formData && <Form
                    submitText={formData.id?'Modifica':'Aggiungi'}
                    showSubmit
                    //ref={formInterview}
                    fields={contactForm}
                    formData={formData}
                    onSubmit={handleSubmit}
                    description="Dati Contatto"
                    addedFields={contactAddedFields}
        
                />}
            </div>

}