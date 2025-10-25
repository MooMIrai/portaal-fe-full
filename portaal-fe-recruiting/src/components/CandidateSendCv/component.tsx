import React, { useEffect, useState } from "react";
import Form from 'common/Form';
import NotificationProviderActions from "common/providers/NotificationProvider";
import { sendCvForm } from "./form";
import { sendCvService } from "../../services/sendCvService";
import { sendCvAddedFields } from "./customFields";

const mapOutcometype = (rowData) => {
    let tipoText = "";
    switch (rowData.OutComeType) {
        case "P":
            tipoText = 'Positivo';
            break;
        case "N":
            tipoText = 'Negativo';
            break;
        case "R":
            tipoText = 'Rimandato';
            break;
        case "A":
            tipoText = 'Annullato';
            break;

    }
    return tipoText
}

export function CandidateSendCv(props:{currentData:any,assignmentId: number, onChange: (interviews: any[]) => void }){

    const [formData,setFormData] = useState<any>();

    useEffect(()=>{
        setFormData(props.currentData?{
            ...props.currentData,
            date_log:props.currentData.date_log?new Date(props.currentData.date_log):undefined,
            OutComeType:props.currentData.OutComeType?{
                id:props.currentData.OutComeType,
                name:mapOutcometype(props.currentData)
            }:{}
        }:{});
    },[props.currentData])

    const handleSubmit = (data)=>{
        //create
        
        const mappedData = {
            ...data,
            assignment_id:props.assignmentId,
            OutComeType: data.OutComeType.id
        }
        let promise:()=>Promise<any> = ()=>sendCvService.createResource(mappedData);
        if(formData.id){
            //edit
            promise = ()=>sendCvService.updateResource(formData.id,mappedData);
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
                <h2>Invio Cv</h2>
                
                {formData && <Form
                    submitText={formData.id?'Modifica':'Aggiungi'}
                    showSubmit
                    //ref={formInterview}
                    fields={sendCvForm}
                    formData={formData}
                    onSubmit={handleSubmit}
                    description="Dati Contatto"
                    addedFields={sendCvAddedFields}
        
                />}
            </div>

}