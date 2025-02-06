import React, { useState } from "react";
import { RecipientsSelector } from "../RecipientsSelector/component";
import Button from 'common/Button';
import styles from './style.module.scss';

export function RecipientsManager(){

    const [to,setTo] = useState<any[]>([]);
    const [cc,setCc] = useState<any[]>([]);
    const [bcc,setBcc] = useState<any[]>([]);

    const [selectAll, setSelecAll]= useState<string>();


    const handleChangeSelectAll = (type:string)=>{
        if(selectAll===type){
            setSelecAll(undefined)
        }else{
            setSelecAll(type);
        }
    }

    return <div className={styles.container}>
        <RecipientsSelector disabled={!!(selectAll && selectAll.length)} label="Destinatari" onChange={setTo} />
        <RecipientsSelector disabled={!!(selectAll && selectAll.length)} label="Copia Carbone" onChange={setCc} />
        <RecipientsSelector disabled={!!(selectAll && selectAll.length)} label="Copia Carbone Nascosta" onChange={setBcc} />
        <div className={styles.btnContainer}>
            <Button disabled={selectAll && selectAll.length && selectAll!='to'} onClick={()=>{handleChangeSelectAll('to')}}>{selectAll==='to'?'Deseleziona':'Seleziona'} tutti come Destinatari</Button>
            <Button disabled={selectAll && selectAll.length && selectAll!='cc'} onClick={()=>{handleChangeSelectAll('cc')}}>{selectAll==='cc'?'Deseleziona':'Seleziona'} tutti come Copia Carbone</Button>
            <Button disabled={selectAll && selectAll.length && selectAll!='bcc'} onClick={()=>{handleChangeSelectAll('bcc')}}>{selectAll==='bcc'?'Deseleziona':'Seleziona'} tutti come Copia Carbone Nascosta</Button>
        </div>
        
    </div>

}