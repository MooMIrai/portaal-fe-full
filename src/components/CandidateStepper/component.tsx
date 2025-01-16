import React, { useEffect, useState } from "react";
import Stepper from 'common/Stepper'
import { Candidateinterviews } from "../CandidateInterviews/component";
import { CandidateContact } from "../CandidateContact/component";

export function CandidateStepper(props){
    
    const [step, setStep] = useState(0);
    const [data,setData] = useState<any>(props.data);
    const [steps, setSteps] = useState<Array<any>>([]);
    
    useEffect(()=>{
        setSteps([
            { label: 'Contatto', isValid: data.RecruitingContact },
            { label: 'Colloqui', isValid: data.RecruitingInterview.length },
            { label: 'Proposta economica', isValid: data.RecruitingOffer },
            { label: 'Valutazione finale', isValid: data.RecruitingFinalEvaluation },
            { label: 'Invio CV', isValid: data.RecruitingSendCv },
            { label: 'Contratto', isValid: data.RecruitingSendContract }
        ])
    },[data])

    const handleChange = (e: any) => {
        
        setStep(e.value);
    };

    const handleContactChange=(contact)=>{
        setData((prevData)=>{
            return {...prevData,RecruitingContact:contact}
        })
    }

    const handleInterviewChange=(interviews)=>{
        setData((prevData)=>{
            return {...prevData,RecruitingInterview:interviews}
        })
    }
    

    return <>
        <Stepper items={steps} value={step} onChange={handleChange} />
        <div>
        {
            step===0 && <CandidateContact onChange={handleContactChange}  currentData={data.RecruitingContact} assignmentId={props.data.id}/>
        }
        {
            step===1 && <Candidateinterviews onChange={handleInterviewChange}  currentInterviews={data.RecruitingInterview} assignmentId={props.data.id}/>
        }
        </div>
    </>
}