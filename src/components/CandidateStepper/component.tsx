import React, { useEffect, useState } from "react";
import Stepper from 'common/Stepper'
import { Candidateinterviews } from "../CandidateInterviews/component";
import { CandidateContact } from "../CandidateContact/component";
import { CandidateOffer } from "../CandidateOffer/component";
import { CandidateSendCv } from "../CandidateSendCv/component";
import { CandidateSendContract } from "../CandidateSendContract/component";
import CandidateCreateAccount from "../CandidateCreateAccount/component";
import { isEmpty } from "lodash";

export function CandidateStepper(props) {

    const [step, setStep] = useState(0);
    const [data, setData] = useState<any>(props.data);
    const [steps, setSteps] = useState<Array<any>>([]);

    useEffect(() => {
        if (data) {
            if (data.Candidate) {
                setSteps([
                    { label: 'Contatto', isValid: data.RecruitingContact.length },
                    { label: 'Colloqui', isValid: data.RecruitingInterview.length },
                    { label: 'Proposta economica', isValid: data.RecruitingOffer },
                    //{ label: 'Valutazione finale', isValid: data.RecruitingFinalEvaluation },
                    { label: 'Invio CV', isValid: data.RecruitingSendCv },
                    { label: 'Contratto', isValid: data.RecruitingSendContract },
                    { label: "Creazione account", isValid: !isEmpty(data.Candidate.Person.Accounts)}
                ])
            } else {
                setSteps([
                    { label: 'Contatto', isValid: data.RecruitingContact.length },
                    { label: 'Invio CV', isValid: data.RecruitingSendCv },
                ])
            }
        }

    }, [data])

    const handleChange = (e: any) => {

        setStep(e.value);
    };

    const handleContactChange = (contact) => {
        setData((prevData) => {
            return { ...prevData, RecruitingContact: [...prevData.RecruitingContact, contact] }
        })
    }

    const handleInterviewChange = (interviews) => {
        setData((prevData) => {
            return { ...prevData, RecruitingInterview: interviews }
        })
    }

    const handleOfferChange = (interviews) => {
        setData((prevData) => {
            return { ...prevData, RecruitingOffer: interviews }
        })
    }

    const handleSendCvChange = (interviews) => {
        setData((prevData) => {
            return { ...prevData, RecruitingSendCv: interviews }
        })
    }

    const handleSendContractChange = (interviews) => {
        setData((prevData) => {
            return { ...prevData, RecruitingSendContract: interviews }
        })
    }

    const handleCreateAccountChange = (account) => {
        setData((prevData) => ({
            ...prevData, 
            Candidate: {
                ...prevData.Candidate, 
                Person: {
                    ...prevData.Candidate.Person, 
                    Accounts: [...(prevData.Candidate.Person?.Accounts || []), account]
                }
            }
        }));
    };

    return <>
        <Stepper items={steps} value={step} onChange={handleChange}/>
        <div>
            {
                data.Candidate ? <>
                    {
                        step === 0 && <CandidateContact onChange={handleContactChange} currentData={data.RecruitingContact} assignmentId={props.data.id} />
                    }
                    {
                        step === 1 && <Candidateinterviews onChange={handleInterviewChange} currentInterviews={data.RecruitingInterview} assignmentId={props.data.id} />
                    }
                    {
                        step === 2 && <CandidateOffer onChange={handleOfferChange} currentData={data.RecruitingOffer} assignmentId={props.data.id} />
                    }
                    {
                        step === 3 && <CandidateSendCv onChange={handleSendCvChange} currentData={data.RecruitingSendCv} assignmentId={props.data.id} />
                    }
                    {
                        step === 4 && <CandidateSendContract onChange={handleSendContractChange} currentData={data.RecruitingSendContract} assignmentId={props.data.id} />
                    }
                    {
                        step === 5 && <CandidateCreateAccount onChange={handleCreateAccountChange} currentData={data.Candidate.Person?.Accounts?.[0]} person_id={data.Candidate.person_id}/>
                    }
                </> : <>
                    {
                        step === 0 && <CandidateContact onChange={handleContactChange} currentData={data.RecruitingContact} assignmentId={props.data.id} />
                    }
                    {
                        step === 1 && <CandidateSendCv onChange={handleSendCvChange} currentData={data.RecruitingSendCv} assignmentId={props.data.id} />
                    }

                </>
            }

        </div>
    </>
}