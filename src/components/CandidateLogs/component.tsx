import Timeline from 'common/Timeline'
import React from 'react';

const mapInterviewtype = (InterviewType) => {
    let tipoText = "";
    switch (InterviewType) {
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
const mapInterviewEvaluationtype = (InterviewEvaluationType) => {
    let tipoText = "";
    switch (InterviewEvaluationType) {
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

const mapContactType = rowData=>{
    let tipoText = "";
    switch (rowData) {
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

// Funzione per estrarre i dati (come mostrato prima)
const extractTimelineData=(data)=> {

    const timeline:any[] = [];

    [data].forEach((entry) => {

        const candidateName = entry.Candidate
        ? `${entry.Candidate.Person.firstName} ${entry.Candidate.Person.lastName}`
        : entry.Person
            ? `${entry.Person.firstName} ${entry.Person.lastName}`
            : ''
        ;

        // Aggiungi gli eventi RecruitingContact
        if (entry.RecruitingContact?.length > 0) {

            timeline.push(...entry.RecruitingContact.map(contact => ({
                date: new Date(contact.date_log),
                title: "Contatto",
                subtitle: candidateName,
                description: `(${mapContactType(contact.ContactType)}): ${contact.notes || "Nessuna nota"}`,
            })));

        }

        // Aggiungi gli eventi RecruitingInterview
        if (entry.RecruitingInterview && entry.RecruitingInterview.length > 0) {
            entry.RecruitingInterview.forEach((interview) => {
                timeline.push({
                    date: new Date(interview.date_log),
                    title: "Colloquio",
                    subtitle: candidateName,
                    description: `(${mapInterviewtype(interview.InterviewType)}, ${mapInterviewEvaluationtype(interview.InterviewEvaluationType)}): ${
                        interview.notes || "Nessuna nota"
                    }`,
                });
            });
        }

        // Aggiungi gli eventi RecruitingOffer
        if (entry.RecruitingOffer) {
            timeline.push({
                date: new Date(entry.RecruitingOffer.date_log),
                title: "Offerta",
                subtitle: candidateName,
                description: `RAL: ${entry.RecruitingOffer.RAL || "Nessun RAL"}, Note: ${entry.RecruitingOffer.notes || "Nessuna nota"}`,
            });
        }

        // Aggiungi gli eventi RecruitingSendCv
        if (entry.RecruitingSendCv) {
            timeline.push({
                date: new Date(entry.RecruitingSendCv.date_log),
                title: "CV Inviato",
                subtitle: candidateName,
                description: `Note: ${entry.RecruitingSendCv.notes || "Nessuna nota"}`,
            });
        }

        // Aggiungi gli eventi RecruitingSendContract
        if (entry.RecruitingSendContract) {
            timeline.push({
                date: new Date(entry.RecruitingSendContract.date_log),
                title: "Contratto Inviato",
                subtitle: candidateName,
                description: `Note: ${entry.RecruitingSendContract.notes || "Nessuna nota"}`,
            });
        }

        // Aggiungi eventuale hiring_date
        if (entry.hiring_date) {
            timeline.push({
                date: new Date(entry.hiring_date),
                title: "Assunzione",
                subtitle: candidateName,
                description: "Data di assunzione",
            });
        }
    });

    return timeline;
}

export function CandidateLogs(props:{data}){

    return <Timeline events={extractTimelineData(props.data)} alterMode collapsibleEvents></Timeline>
}