import withAutoComplete from "common/hoc/AutoComplete";
import { reportService } from "../../services/ReportService";
import { useCallback, useEffect, useState } from "react";
import React from "react";
import Button from 'common/Button';
import styles from './style.module.scss';
import Typography from 'common/Typography';

export function ReportsSelector(props:{category?:string,onChange:(value:any)=>void}){

  const getReport = useCallback(() =>{
    return reportService.getAll(props.category)
  },[props.category]);

  useEffect(()=>{
    getReport().then(setReportList)
  },[props.category])
  
  const [reportlist,setReportList]  = useState<any[]>([])
  const [selected,setSelected]  = useState<any>({})


  return <>
      {
        reportlist.map(ri=><div key={ri.id} className={styles.listItem}>
           <input onChange={()=>setSelected(ri)} title="Seleziona riga" type="radio" checked={ri.id===selected.id} style={{width:20,height:20}} />
           <Typography.p>{ri.name}</Typography.p>
        </div>)
      }

      <div className={styles.buttonContainer}>
        <Button themeColor='primary' onClick={()=>props.onChange(selected)} disabled={!selected.id} >Seleziona</Button>
      </div>
            
  </>

}
