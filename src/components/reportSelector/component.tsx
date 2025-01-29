import withAutoComplete from "common/hoc/AutoComplete";
import { reportService } from "../../services/ReportService";
import { useCallback, useMemo } from "react";
import React from "react";


export function ReportsSelector(props:{category?:string,onChange:(value:any)=>void}){

  const getReport = useCallback(() =>{
    return reportService.getAll(props.category)
  },[props.category])
  
  const Cat = useMemo(()=>withAutoComplete(getReport),[props.category]);

  return <Cat onChange={(ev)=>props.onChange(ev.value)} />

}
