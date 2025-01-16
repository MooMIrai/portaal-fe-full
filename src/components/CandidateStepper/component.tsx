import React, { useState } from "react";
import Stepper from 'common/Stepper'
import { Candidateinterviews } from "../CandidateInterviews/component";

export function CandidateStepper(props){
    const [step, setStep] = useState(0);
    const [data,setData] = useState<any>(props.data);

    console.log(props.data)

    const [steps, setSteps] = React.useState<Array<any>>([
        { label: 'Contatto', isValid: data.RecruitingContact },
        { label: 'Colloqui', isValid: data.RecruitingInterview.length },
        { label: 'Proposta economica', isValid: data.RecruitingOffer },
        { label: 'Valutazione finale', isValid: data.RecruitingFinalEvaluation },
        { label: 'Invio CV', isValid: data.RecruitingSendCv },
        { label: 'Contratto', isValid: data.RecruitingSendContract }
    ]);

    const handleChange = (e: any) => {
        const isValid = step % 2 === 0;

        /*const currentSteps = steps.map((currentStep, index) => ({
            ...currentStep,
            isValid: index === step ? isValid : currentStep.isValid
        }));

        setSteps(currentSteps);*/
        setStep(e.value);
    };

    const handleInterviewChange=(interviews)=>{
        setData((prevData)=>{
            return {...prevData,RecruitingInterview:interviews}
        })
    }
    

    return <>
        <Stepper items={steps} value={step} onChange={handleChange} />
        <div>
        {
            step===1 && <Candidateinterviews onChange={handleInterviewChange}  currentInterviews={data.RecruitingInterview} assignmentId={props.data.id}/>
        }
        </div>
    </>
}