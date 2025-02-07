import React, { useRef, useState } from 'react';
import { RecipientsManager } from '../RecipientsManager/component';
import { MessageBody } from '../MessageBody/component';
import Stepper from 'common/Stepper';
import Button from 'common/Button';
import SvgIcon from 'common/SvgIcon';
import { arrowRightIcon, arrowLeftIcon, paperPlaneIcon } from 'common/icons';
import { MessageResponseTypeSelector } from '../MessageResponseTypeSelector/component';

export function MessageCreate() {
    const [step, setStep] = useState(0);
    const [data,setData] = useState<any>({});
    const formRecipients = useRef<any>(null);
    const formBody = useRef<any>(null);

    const handleChange = (newStep: number) => {
        setStep(newStep);
    };

    const mergeData = (newData)=>setData((p)=>({...p,newData}))

    const handleNextStep = () => {
        if(step===0 && formRecipients.current){
            formRecipients.current.onSubmit(); // Esegue il submit del form
           if(formRecipients.current.isValid()){
                mergeData(formRecipients.current.values);
                handleChange(step + 1);
           }  
        }else if (step === 1 && formBody.current) {
           formBody.current.onSubmit(); // Esegue il submit del form
           if(formBody.current.isValid()){
                mergeData(formBody.current.values);
                handleChange(step + 1);
           }  
        } else{
            handleChange(step+1)
        }
    };

    return (
        <>
            <Stepper
                items={[
                    { label: 'Dati Contatto' },
                    { label: 'Contenuto' },
                    { label: 'Tipo risposta' },
                ]}
                value={step}
                //onChange={(e: any) => handleChange(e.value)}
            />
            <div
                style={{ height: 1, background: 'var(--kendo-color-border)', marginTop: 10, marginBottom: 10 }}
            ></div>

            {<div style={{display:step===0?'block':'none'}}><RecipientsManager ref={formRecipients} /></div>}
            {<div style={{display:step===1?'block':'none'}}><MessageBody ref={formBody}  /></div>}
            {<div style={{display:step===2?'block':'none'}}><MessageResponseTypeSelector onChange={(e)=>mergeData({responseType:e})} /></div>}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 15 }}>
                {step > 0 ? (
                    <Button
                        onClick={() => handleChange(step - 1)}
                        svgIcon={arrowLeftIcon}
                        themeColor="primary"
                        fillMode="link"
                        size="large"
                    >
                        Indietro
                    </Button>
                ) : 
                (
                    <div></div>
                )}
                {step < 2 && (
                    <Button
                        onClick={handleNextStep}
                        endIcon={<SvgIcon icon={arrowRightIcon} />}
                        size="large"
                        themeColor="success"
                        fillMode="link"
                    >
                        Avanti
                    </Button>
                )}
                {step === 2 && (
                    <Button
                        onClick={()=>{
                            alert('appp')
                        }}
                        endIcon={<SvgIcon icon={paperPlaneIcon} />}
                        size="large"
                        themeColor="success"
                        fillMode="link"
                    >
                        Invia notifica
                    </Button>
                )}
            </div>
        </>
    );
}
