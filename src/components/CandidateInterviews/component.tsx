import React, { useRef } from "react";
import Form from 'common/Form';
import style from "./style.module.scss";
import { InterviewForm } from "./form";
import { interviewAddedFields } from "./customFields";
import { interviewService } from "../../services/interviewService";

export function Candidateinterviews(props: { currentInterviews: any[], assignmentId: number, onChange: (interviews: any[]) => void }) {

    const formInterview = useRef<any>();

    const handleSubmit = (data) => {
        const obj = {
            InterviewEvaluationType: data.InterviewEvaluationType.id,
            InterviewType: data.InterviewType.id,
            OutComeType: data.OutComeType.id,
            assignment_id: props.assignmentId,
            date_log: data.date_log,
            isExternal: !!data.isExternal,
            notes: data.notes
        }
        interviewService.createResource(obj).then(res => {
            formInterview.current?.resetForm();
            props.onChange([...props.currentInterviews, res]);
            //setCurrentInterview([...currentInterview,res]);
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

        }
        return tipoText
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
                    <th className="k-table-th k-header">Esito</th>
                    <th className="k-table-th k-header">Note</th>
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
                        <td className="k-table-td">{mapInterviewOutcometype(ci)}</td>
                        <td className="k-table-td">{ci.notes}</td>
                    </tr>)}
            </tbody>
        </table>

        <Form
            submitText={"Salva"}
            showSubmit
            ref={formInterview}
            fields={InterviewForm}
            formData={{}}
            onSubmit={handleSubmit}
            description="Aggiungi Colloquio"
            addedFields={interviewAddedFields}

        />
    </div>

}