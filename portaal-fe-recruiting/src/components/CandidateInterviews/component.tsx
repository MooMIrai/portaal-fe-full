import React, { useRef, useState } from "react";
import Form from 'common/Form';
import Button from 'common/Button';
import Modal from "common/Modal";
import {trashIcon} from "common/icons";
import style from "./style.module.scss";
import { InterviewForm } from "./form";
import { interviewAddedFields } from "./customFields";
import { interviewService } from "../../services/interviewService";
import { cloneDeep } from "lodash";

export function Candidateinterviews(props: { currentInterviews: any[], assignmentId: number, onChange: (interviews: any[]) => void }) {

    const [editingId, setEditingId] = useState<{id: number, interview: any}>();
    const [deleteModal, setDeleteModal] = useState<boolean>();
    const formInterview = useRef<any>();

    const handleSubmit = (data) => {

        const obj = {
            InterviewEvaluationType: data.InterviewEvaluationType.id,
            InterviewType: data.InterviewType.id,
            OutComeType: data.OutComeType.id,
            assignment_id: props.assignmentId,
            technical_referent_id: data.technical_referent_id?.id || null,
            date_log: data.date_log,
            isExternal: !!data.isExternal,
            notes: data.notes
        };

        if (editingId?.id) {
            interviewService.updateResource(editingId.id, obj).then(res => {
                const currentInterviews = cloneDeep(props.currentInterviews);
                const newInterviews = currentInterviews.map(interview => {
                    if (interview.id === res.id) return res;
                    else return interview;
                });
                props.onChange(newInterviews);
            });
        }

        else {
            interviewService.createResource(obj).then(res => {
                formInterview.current?.resetForm();
                props.onChange([...props.currentInterviews, res]);
            });
        }
        

    }

    const handleDelete = () => {
        interviewService.deleteResource(editingId?.id).then(res => {
            const currentInterviews = cloneDeep(props.currentInterviews);
            const newInterviews = currentInterviews.filter(interview => interview.id !== res.id);
            setEditingId(undefined);
            setDeleteModal(false);
            props.onChange(newInterviews);
        })
    }


    const mapInterviewtype = (rowData) => {
        let tipoText = "";
        switch (rowData.InterviewType) {
            case "VIDEO_CALL":
                tipoText = 'Video Conferenza';
                break;
            case "TELEPHONE":
                tipoText = 'Telefonico';
                break;
            case "IN_PERSON":
                tipoText = 'In sede';
                break;
            case "AT_CUSTOMER":
                tipoText = 'Dal cliente';
                break;
        }
        return tipoText
    }
    const mapInterviewEvaluationtype = (rowData) => {
        let tipoText = "";
        switch (rowData.InterviewEvaluationType) {
            case "HR":
                tipoText = 'Valutazione Hr';
                break;
            case "TECHNICAL":
                tipoText = 'Valutazione Tecnica';
                break;
            case "TECHNICAL_CUSTOMER":
                tipoText = 'Valutazione Tecnica del cliente';
                break;

        }
        return tipoText
    }

    const getFullName = (accountData) => accountData ? `${accountData.Person.firstName} ${accountData.Person.lastName}`: '';

    const mapInterviewOutcometype = (rowData) => {
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
            case 'W':
                tipoText = 'In Attesa';
                break;

        }
        return tipoText;
    }

    const mapInitialData = (interview: any) => {
        return {
            ...interview,
            date_log: new Date(interview.date_log),
            InterviewEvaluationType: {id: interview.InterviewEvaluationType, name: mapInterviewEvaluationtype(interview)},
            InterviewType: {id: interview.InterviewType, name: mapInterviewtype(interview)},
            technical_referent_id: {id: interview.technical_referent_id, name: getFullName(interview.technical_referent)},
            OutComeType: {id: interview.OutComeType, name: mapInterviewOutcometype(interview)}
        };
    }

    const editComponent = (interview: any) => {
        return (

            <div className={style.editContainer}>

                <div className={style.editCheckbox}>
                    <input
                    style={{height: "20px"}}
                    id="edit-checkbox"
                    type="checkbox" 
                    checked={editingId?.id === interview.id} 
                    onChange={() => {
                        if (editingId?.id === interview.id) setEditingId(undefined);
                        else setEditingId({id: interview.id, interview});
                    }} />
                </div>

                <Button
                svgIcon={trashIcon}
                fillMode={"link"}
                themeColor={"error"}
                onClick={() => {
                    setEditingId({id: interview.id, interview});
                    setDeleteModal(true);
                }}
                ></Button>
                
            </div>
            
        );
    }


    return <div style={{ display: "flex", flexDirection: 'column', gap: 20, margin: 50, marginTop: 20 }}>
        <h2>Colloqui</h2>
        <table className="k-table k-grid-header-table k-table-md">
            <thead className="k-table-thead">
                <tr className="k-table-row">
                    <th className="k-table-th k-header">Data</th>
                    <th className="k-table-th k-header">Colloquio esterno</th>
                    <th className="k-table-th k-header">Tipo</th>
                    <th className="k-table-th k-header">Valutazione</th>
                    <th className="k-table-th k-header">Referente</th>
                    <th className="k-table-th k-header">Esito</th>
                    <th className="k-table-th k-header">Note</th>
                    <th className="k-table-th k-header"></th>
                </tr>
            </thead>
            <tbody className="k-table-tbody">
                {props.currentInterviews.sort((a, b) => {
                    const dateA = new Date(a.date_log).getTime(); // Converte in timestamp
                    const dateB = new Date(b.date_log).getTime(); // Converte in timestamp
                    return dateA - dateB; // Ordina in ordine crescente
                })
                    .map(ci => <tr className={`k-table-row ${style.recruitingInterview}`} key={ci.id}>
                        <td className="k-table-td">{new Date(ci.date_log).toLocaleDateString()}</td>
                        <td className="k-table-td">{ci.isExternal ? 'Si' : 'No'}</td>
                        <td className="k-table-td">{mapInterviewtype(ci)}</td>
                        <td className="k-table-td">{mapInterviewEvaluationtype(ci)}</td>
                        <td className="k-table-td">{getFullName(ci.technical_referent)}</td>
                        <td className="k-table-td">{mapInterviewOutcometype(ci)}</td>
                        <td className="k-table-td">{ci.notes}</td>
                        <td className="k-table-td">{editComponent(ci)}</td>
                    </tr>)}
            </tbody>
        </table>

        <div>

            {editingId
                ?   <div className={style.editTitle}>
                        Colloquio {new Date(editingId.interview.date_log).toLocaleDateString()}
                    </div>
                : null
            }

            <Form
                key={editingId?.id}
                submitText={editingId?.id ? "Modifica": "Salva"}
                showSubmit
                ref={formInterview}
                fields={InterviewForm}
                formData={editingId ? mapInitialData(editingId.interview) : {}}
                onSubmit={handleSubmit}
                description="Aggiungi Colloquio"
                addedFields={interviewAddedFields}

            />

            <Modal 
            isOpen={deleteModal} 
            title="Cancellazione colloquio" 
            onSubmit={handleDelete} 
            onClose={() => setDeleteModal(false)}
            callToAction="Confirm"
            showModalFooter
            height={200}
            >
                <div>Sei sicuro di voler cancellare il colloquio?</div>
            </Modal>

        </div>
    </div>

}