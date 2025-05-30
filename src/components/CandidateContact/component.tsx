import React, { useEffect, useRef, useState } from "react";
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

    const [currentContacts, setCurrentContacts] = useState<any>();
    const formContact = useRef<any>();

    useEffect(()=>{
        setCurrentContacts(
            props.currentData
            ? 
                props.currentData.map(data => ({
                    ...data,
                    date_log: data.date_log ? new Date(data.date_log) : undefined,
                    ContactType: data.ContactType
                    ?
                        {
                            id: data.ContactType,
                            name: mapContactType(data)
                        }
                    : {}
                }))
            : []
        );
    }, [props.currentData]);

    const handleSubmit = (data)=>{
        //create
        
        const mappedData = {
            ...data,
            assignment_id: props.assignmentId,
            ContactType: data.ContactType.id
        };

        let promise: ()=> Promise<any> = () => contactService.createResource(mappedData);
        
        promise().then(result => {

            NotificationProviderActions.openModal(
                { icon: true, style: "success" },
                "Operazione avvenuta con successo"
            );

            formContact.current?.resetForm();
            props.onChange(result);
        });
    }

    return  (

        <div style={{ display: "flex", flexDirection: 'column', gap: 20, margin: 50, marginTop: 20 }}>

            <h2>Contatto</h2>

            <table className="k-table k-grid-header-table k-table-md">
                <thead className="k-table-thead">
                    <tr className="k-table-row">
                        <th className="k-table-th k-header">Data</th>
                        <th className="k-table-th k-header">Tipo Contatto</th>
                        <th className="k-table-th k-header">Note</th>
                    </tr>
                </thead>
                <tbody className="k-table-tbody">
                    {currentContacts?.map(ci => 
                        <tr className="k-table-row" key={ci.id}>
                            <td className="k-table-td">{new Date(ci.date_log).toLocaleDateString()}</td>
                            <td className="k-table-td">{ci.ContactType.name}</td>
                            <td className="k-table-td">{ci.notes}</td>
                        </tr>
                    )}
                </tbody>
            </table>
            
            <Form
                submitText={'Aggiungi'}
                showSubmit
                ref={formContact}
                fields={contactForm}
                formData={{}}
                onSubmit={handleSubmit}
                description="Dati Contatto"
                addedFields={contactAddedFields}
    
            />

        </div>
    );
}