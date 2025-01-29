import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ReportsSelector } from "../../components/reportSelector/component";
import { ReportForm } from "../../components/reportForm/component";
import { reportService } from "../../services/ReportService";
import fileService from "common/services/FileService"

export default function(){

    const {category } = useParams();
    const [report,setReport] = useState<{id:string,name:string}>();

    const handleGenerate = (data:any) =>{
        if(report){
            reportService.generate(report.id,data).then((file)=>fileService.downloadBlobFile(file,report.name+'_'+Date.now()+'.xlsx'))
        }
    }

    return <>
     <ReportsSelector category={category} onChange={(val)=>setReport(val)} />
     <ReportForm report={report?.id} onSubmit={handleGenerate} />
    </>
}