import { useEffect, useState } from "react";
import { reportService } from "../../services/ReportService";
import Form from "common/Form";
import React from "react";
import { FormField } from "../../models/FormModel";
import { formAdapter } from "../../adapters/FormAdapter";

export function ReportForm(props:{report:string | undefined, reportName:string | undefined, onSubmit:(data:any)=>void}){

    const [formFields,setFormFields] = useState<FormField[]>();

    useEffect(()=>{
        if(props.report){
            reportService.getDetail(props.report).then(reportParams=>{
                const f = formAdapter.adaptList(reportParams.parameters);
                setFormFields(f);
            })
        }
    },[props.report])

    if(formFields){

        return <Form
        
            fields={formFields}
            formData={{}}
            onSubmit={props.onSubmit}
            description={"Parametri per il report " + props.reportName}
            submitText={"Genera Report"}
            showSubmit

        />
    }

    return <div> Seleziona un report </div>
}