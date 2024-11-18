import React, { PropsWithChildren, useRef, useState } from "react";
import Form from "common/Form";
import { getFormCandidate } from "./form";
import styles from './style.module.scss';

type CandidatiCrudProps = {
    row: Record<string, any>;
    type: any;
    closeModalCallback: () => void;
    refreshTable: () => void;
    //onSubmit: (type: any, formData: any, refreshTable: () => void, id: any) => void;
  };

export function CandidatiCrud(props:PropsWithChildren<CandidatiCrudProps>){

    const formCandidato = useRef();
    const [formCandidateData,setFormCandidateData] = useState({})

    return <div className={styles.formContainer}><Form submitText={"Salva"} 
    customDisabled={false}
    formData={formCandidateData}
    fields={Object.values(getFormCandidate({},props.type))/* .filter((e: any) => {
      return e.name !== "id" && e.name !== "date_created" &&
        e.name !== "date_modified" &&
        e.name !== "user_created" &&
        e.name !== "user_modified"
    }) .map((e: any) => {
      return {
        ...e,
        disabled: false
      }
    })*/}
    //addedFields={formFields}
    showSubmit={true}
    extraButton={true}
    extraBtnAction={props.closeModalCallback}
    onSubmit={()=>{
        debugger;
    }}
    /></div>
}