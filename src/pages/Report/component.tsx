import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ReportsSelector } from "../../components/reportSelector/component";
import { ReportForm } from "../../components/reportForm/component";
import { reportService } from "../../services/ReportService";
import Stepper from 'common/Stepper';
import { ReportPreview } from "../../components/reportpreview/component";

import styles from './style.module.scss';
export default function(){

    const {category } = useParams();
    const [report,setReport] = useState<{id:string,name:string}>();
    const [step,setStep] = useState<number>(0);
    const [fileBlob, setFileBlob] = useState<Blob>()

    useEffect(()=>{
        setStep(0);
    },[category])

    const handleChangeStep = (e: any) => {
        if(e.value<step)
            setStep(e.value);
    };

    const handleGenerate = (data:any) =>{
        if(report){
            reportService.generate(report.id,data).then((file)=>{
                setFileBlob(file);
                setStep(step+1);
            });
        }
    }

    return <div className={styles.page}>

        <Stepper items={[
            { label: 'Seleziona Report' },
            { label: 'Inserisci Parametri' },
            { label: 'Anteprima' }
        ]} value={step} onChange={handleChangeStep} linear={true} >

       

    </Stepper>
    <div className={styles.container}>

    
        {step == 0 && <ReportsSelector category={category} onChange={(val)=>{
                setReport(val);
                setStep(step+1);
            }} />}
        {step == 1 && <ReportForm report={report?.id} reportName={report?.name} onSubmit={handleGenerate} />}
        {step == 2 && <ReportPreview excelFile={fileBlob} />}
    </div>
    
     {/* <div className={styles.reportSelector}>
        <label className="k-label">Report</label>
        <ReportsSelector category={category} onChange={(val)=>setReport(val)} />
     </div>
     <div className={styles.formContainer}>
        
     </div> */}
     
    </div>
}