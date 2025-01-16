import React, { useEffect, useState } from "react";
import Form from 'common/Form';
import NotificationProviderActions from "common/providers/NotificationProvider";
import { sendContractForm } from "./form";

import { sendContractAddedFields } from "./customFields";
import { sendContractService } from "../../services/sendContractService";


export function CandidateSendContract(props: { currentData: any, assignmentId: number, onChange: (data: any[]) => void }) {

    const [formData, setFormData] = useState<any>();

    useEffect(()=>{
        setFormData(props.currentData?{
            ...props.currentData,
            date_log:props.currentData.date_log?new Date(props.currentData.date_log):undefined,
            date_start_contract: props.currentData.date_start_contract?new Date(props.currentData.date_start_contract):undefined,
            ContractType:props.currentData.contractType_id?{
                id:props.currentData.contractType_id,
                name:props.currentData.contractType_id//TODO gestione include
            }:undefined
        }:{});
    },[props.currentData])

    const handleSubmit = (data) => {

        const mappedData={
            ...data,
            RAL:data.RAL?parseFloat(data.RAL):undefined,
            Transfert:data.Transfert?parseFloat(data.Transfert):undefined,
            assignment_id:props.assignmentId,
            contractType_id:data.ContractType?data.ContractType.id:undefined
        };
        let promise: () => Promise<any> = () => sendContractService.createResource(mappedData);
        if (formData.id) {
            //edit
            promise = () => sendContractService.updateResource(formData.id, mappedData);
        }

        promise().then(result => {
            NotificationProviderActions.openModal(
                { icon: true, style: "success" },
                "Operazione avvenuta con successo"
            );
            props.onChange(result)
        })
    }

    return <div style={{ display: "flex", flexDirection: 'column', gap: 20, margin: 50, marginTop: 20 }}>
        <h2>Invio Contratto</h2>

        {formData && <Form
            submitText={formData.id ? 'Modifica' : 'Aggiungi'}
            showSubmit
            //ref={formInterview}
            fields={sendContractForm}
            formData={formData}
            onSubmit={handleSubmit}
            description="Dati contratto"
            addedFields={sendContractAddedFields}
        />}
    </div>
}