import { useEffect, useState } from "react";
import React from "react";
import styles from './style.module.scss';
import Typography from 'common/Typography';
import { notificationServiceHttp } from "../../services/notificationService";

export function MessageResponseTypeSelector(props:{onChange:(value:any)=>void}){

  useEffect(()=>{
    notificationServiceHttp.getResponseTypeList().then(res=>{
      setResponseTypeList([...res.data]);
      props.onChange(res.data.find(n=>n.responseType==='NONE') || {id:0} );
      setSelected(res.data.find(n=>n.responseType==='NONE') || {id:0} );
    })
  },[])
  
  const [responseTypeList,setResponseTypeList]  = useState<any[]>([])
  const [selected,setSelected]  = useState<any>()


  return <>
  
      {
        responseTypeList.map(ri=><div key={ri.id} onClick={()=>{
            setSelected(ri);
            props.onChange(ri)
          }} className={styles.listItem + ' '+(ri.id===selected.id?styles.active:'')}>
           <input title="Seleziona riga" type="radio" checked={ri.id===selected.id} style={{width:20,height:20}} />
           <Typography.p className={styles.typographyLabel}>{ri.description || ri.responseType}</Typography.p>
        </div>)
      }

            
  </>

}
