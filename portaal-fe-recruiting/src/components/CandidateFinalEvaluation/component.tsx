import React, { useEffect, useState } from "react";
import Form from 'common/Form';
import { finalEvaluationForm } from "./form";
import NotificationProviderActions from "common/providers/NotificationProvider";
import { sendFinalEvaluationAddedFields } from "./customFields";
import { finalEvaluationService } from "../../services/finalEvaluationService";

const mapContactType = (rowData) => {

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

    return tipoText;
}

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

    return tipoText;
}

export function CandidateFinalEvaluation(props: { currentData: any, assignmentId: number, onChange: (data: any[]) => void }) {

    const [formData, setFormData] = useState<any>();

    useEffect(()=>{
        setFormData(props.currentData
            ?   {
                    ...props.currentData, 
                    date_log : props.currentData.date_log ? new Date(props.currentData.date_log) : undefined,
                    ContactType: props.currentData.ContactType
                    ?
                        {
                            id: props.currentData.ContactType,
                            name: mapContactType(props.currentData)
                        }
                    : {},
                    OutComeType: props.currentData.OutComeType 
                    ?
                        {
                            id: props.currentData.OutComeType,
                            name: mapOutcometype(props.currentData)
                        }
                    : {}
                }
            :   {}
        );
    },[props.currentData]);

    const handleSubmit = (data) => {

        const mappedData = {
            ...data,
            assignment_id:props.assignmentId,
            ContactType: data.ContactType.id,
            OutComeType: data.OutComeType.id
        };

        let promise: () => Promise<any> = () => finalEvaluationService.createResource(mappedData);

        if (formData.id) {
            //edit
            promise = () => finalEvaluationService.updateResource(formData.id, mappedData);
        }

        promise().then(result => {

            NotificationProviderActions.openModal(
                { icon: true, style: "success" },
                "Operazione avvenuta con successo"
            );

            props.onChange(result);
        })
    }

    return <div style={{ display: "flex", flexDirection: 'column', gap: 20, margin: 50, marginTop: 20 }}>

        <h2>Valutazione finale</h2>

        {formData && <Form
            submitText={formData.id ? 'Modifica' : 'Aggiungi'}
            showSubmit
            fields={finalEvaluationForm}
            formData={formData}
            onSubmit={handleSubmit}
            description="Dati Valutazione Finale"
            addedFields={sendFinalEvaluationAddedFields}
        />}

    </div>
}