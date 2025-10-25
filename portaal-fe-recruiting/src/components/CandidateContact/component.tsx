import React, { useEffect, useRef, useState } from "react";
import { sortBy, cloneDeep } from "lodash";
import Form from 'common/Form';
import Button from 'common/Button';
import Modal from "common/Modal";
import {trashIcon} from "common/icons";
import { contactForm } from "./form";
import { contactAddedFields } from "./customFields";
import { contactService } from "../../services/contactService";
import NotificationProviderActions from "common/providers/NotificationProvider";
import style from "./style.module.scss";

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
    const [editingId, setEditingId] = useState<{id: number, contact: any}>();
    const [deleteModal, setDeleteModal] = useState<boolean>();
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

        if (editingId?.id) {

            let promise: () => Promise<any> = () => contactService.updateResource(editingId.id, mappedData);

            promise().then(result => {

                NotificationProviderActions.openModal(
                    { icon: true, style: "success" },
                    "Operazione avvenuta con successo"
                );

                const currentContacts = cloneDeep(props.currentData);
                const newContacts = currentContacts.map(contact => {
                    if (contact.id === result.id) return result;
                    else return contact;
                });

                props.onChange(newContacts);
            });
        }

        else {

            let promise: () => Promise<any> = () => contactService.createResource(mappedData);
        
            promise().then(result => {
    
                NotificationProviderActions.openModal(
                    { icon: true, style: "success" },
                    "Operazione avvenuta con successo"
                );
    
                formContact.current?.resetForm();
                props.onChange([...props.currentData, result]);
            });

        }

    }

    const editComponent = (contact: any) => {
        return (

            <div className={style.editContainer}>

                <div className={style.editCheckbox}>
                    <input
                    style={{height: "20px"}}
                    id="edit-checkbox"
                    type="checkbox" 
                    checked={editingId?.id === contact.id} 
                    onChange={() => {
                        if (editingId?.id === contact.id) setEditingId(undefined);
                        else setEditingId({id: contact.id, contact});
                    }} />
                </div>
                
                <Button
                svgIcon={trashIcon}
                fillMode={"link"}
                themeColor={"error"}
                onClick={() => {
                    setEditingId({id: contact.id, contact});
                    setDeleteModal(true);
                }}
                ></Button>
            
            </div>
           
        );
    }

    const mapInitialData = (contact: any) => {
        return {
            ...contact,
            date_log: new Date(contact.date_log)
        };
    }

    const handleDelete = () => {
        contactService.deleteResource(editingId?.id).then(res => {
            const currentContacts = cloneDeep(props.currentData);
            const newContacts = currentContacts.filter(interview => interview.id !== res.id);
            setEditingId(undefined);
            setDeleteModal(false);
            props.onChange(newContacts);
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
                        <th className="k-table-th k-header"></th>
                    </tr>
                </thead>
                <tbody className="k-table-tbody">
                    {sortBy(currentContacts, ["date_log"]).map(ci => 
                        <tr className={`k-table-row ${style.recruitingContactRow}`} key={ci.id}>
                            <td className="k-table-td">{new Date(ci.date_log).toLocaleDateString()}</td>
                            <td className="k-table-td">{ci.ContactType.name}</td>
                            <td className="k-table-td">{ci.notes}</td>
                            <td className="k-table-td">{editComponent(ci)}</td>
                        </tr>
                    )}
                </tbody>
            </table>
            
            <div>

                {editingId
                    ?   <div className={style.editTitle}>
                            Contatto {new Date(editingId.contact.date_log).toLocaleDateString()}
                        </div>
                    : null
                }
                
                <Form
                key={editingId?.id}
                submitText={editingId?.id ? "Modifica": "Aggiungi"}
                showSubmit
                ref={formContact}
                fields={contactForm}
                formData={editingId ? mapInitialData(editingId.contact) : {}}
                onSubmit={handleSubmit}
                description="Dati Contatto"
                addedFields={contactAddedFields} 
                />

                <Modal 
                isOpen={deleteModal} 
                title="Cancellazione contatto" 
                onSubmit={handleDelete} 
                onClose={() => setDeleteModal(false)}
                callToAction="Confirm"
                showModalFooter
                height={200}
                >
                    <div>Sei sicuro di voler cancellare il contatto?</div>
                </Modal>

            </div>
           

        </div>
    );
}