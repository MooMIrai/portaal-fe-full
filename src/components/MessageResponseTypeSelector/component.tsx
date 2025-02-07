import withAutoComplete from "common/hoc/AutoComplete";

import { useCallback, useEffect, useState } from "react";
import React from "react";
import styles from './style.module.scss';
import Typography from 'common/Typography';
import { notificationServiceHttp } from "../../services/notificationService";

export function MessageResponseTypeSelector(props:{onChange:(value:any)=>void}){

  useEffect(()=>{
    notificationServiceHttp.getResponseTypeList().then(res=>{
      setResponseTypeList([{id:0,description:'Nessuna riposta'},...res.data]);
      props.onChange({id:0})
    })
  },[])
  
  const [responseTypeList,setResponseTypeList]  = useState<any[]>([])
  const [selected,setSelected]  = useState<any>({id:0})


  return <>
  
      {
        responseTypeList.map(ri=><div key={ri.id} className={styles.listItem}>
           <input onChange={()=>{setSelected(ri);props.onChange(ri)}} title="Seleziona riga" type="radio" checked={ri.id===selected.id} style={{width:20,height:20}} />
           <Typography.p>{ri.description || ri.responseType}</Typography.p>
        </div>)
      }

            
  </>

}
