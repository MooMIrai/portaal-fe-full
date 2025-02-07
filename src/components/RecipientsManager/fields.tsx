import React, { useEffect, useState } from "react";
import withField from "common/hoc/Field";
import { RecipientsSelector } from "../RecipientsSelector/component";
import Button from 'common/Button';
import styles from './style.module.scss';

function IsAllSelector(props:{
    onChange:(value:any)=>void,
    value:any
}){

    const [selectAll, setSelecAll]= useState<string | undefined>(props.value);

    const handleChangeSelectAll = (type:string)=>{
       
        if(selectAll===type){
            props.onChange(undefined);
        }else{
            props.onChange(type);
        }
    }

    useEffect(()=>{
        setSelecAll(props.value)
    },[props.value])

    return <div className={styles.btnContainer}>
            <Button type="button" disabled={selectAll && selectAll.length && selectAll!='to'} onClick={()=>{handleChangeSelectAll('to')}}>{selectAll==='to'?'Deseleziona':'Seleziona'} tutti come Destinatari</Button>
            <Button type="button" disabled={selectAll && selectAll.length && selectAll!='cc'} onClick={()=>{handleChangeSelectAll('cc')}}>{selectAll==='cc'?'Deseleziona':'Seleziona'} tutti come Copia Carbone</Button>
            <Button type="button" disabled={selectAll && selectAll.length && selectAll!='bcc'} onClick={()=>{handleChangeSelectAll('bcc')}}>{selectAll==='bcc'?'Deseleziona':'Seleziona'} tutti come Copia Carbone Nascosta</Button>
        </div>
}


export const MessageRecipientFormCustomFields = {
    "person_selector":withField((props:any)=>(<RecipientsSelector label={props.label} disabled={props.disabled}  onChange={(e)=>{
        props.onChange({value:e})
    }} />)),
    "selectall-selector":withField((props:any)=>(<IsAllSelector value={props.value} onChange={(e)=>{
        props.onChange({value:e})
    }} />))
}