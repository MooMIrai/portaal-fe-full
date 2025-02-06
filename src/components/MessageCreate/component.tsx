import React, { useState } from 'react';
import { RecipientsManager } from '../RecipientsManager/component';
import { MessageBody } from '../MessageBody/component';
import Stepper from 'common/Stepper';
import Button from 'common/Button';
import SvgIcon from 'common/SvgIcon';
import {arrowRightIcon,arrowLeftIcon} from 'common/icons';

export function MessageCreate(){
    
    const [step, setStep] = useState(0);

    const handleChange = (e: any) => {
        
        setStep(e.value);
    };

    return <>
        <Stepper items={[
            { label: 'Dati Contatto'},
            { label: 'Contenuto'},
            { label: 'Tipo risposta'},
        ]} value={step} onChange={handleChange} />
        <div style={{height:1, background:'var(--kendo-color-border)', marginTop:10, marginBottom:10}}></div>
       { step ===0 &&  <RecipientsManager />}
       { step ===1 &&  <MessageBody />}
        
        <div style={{display:'flex', justifyContent:'space-between', marginTop:15}}>
            {step>0 ?<Button onClick={()=>handleChange({value:step-1})} svgIcon={arrowLeftIcon} themeColor="primary" fillMode="link" size="large">Indietro</Button>:<div></div>}
            {step<2 && <Button onClick={()=>handleChange({value:step+1})} endIcon={<SvgIcon icon={arrowRightIcon} />} size="large" themeColor="success" fillMode="link">Avanti</Button>}
        </div>

    </>

}