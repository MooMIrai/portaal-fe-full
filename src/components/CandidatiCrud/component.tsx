import React, { PropsWithChildren, useRef, useState } from "react";
import Form from "common/Form";
import { getFormCandidate } from "./form";
import styles from './style.module.scss';
import NotificationActions from 'common/providers/NotificationProvider';
import { candidatoService } from '../../services/candidatoService';
import {formFields} from './customFields'
import { candidateAdapter } from "./adapter";
import { CandidateServer } from "./models";

type CandidatiCrudProps = {
    row: CandidateServer;
    type: any;
    closeModalCallback: () => void;
    refreshTable: () => void;
    //onSubmit: (type: any, formData: any, refreshTable: () => void, id: any) => void;
  };

export function CandidatiCrud(props:PropsWithChildren<CandidatiCrudProps>){

    const formCandidato = useRef();
    //const [formCandidateData,setFormCandidateData] = useState({})
    const [formCandidateData,setFormCandidateData] = useState(candidateAdapter.reverseAdapt(props.row))

    return <div className={styles.formContainer}>
      <Form
        submitText={"Salva"}
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
        addedFields={formFields}
        showSubmit={true}
        extraButton={true}
        extraBtnAction={props.closeModalCallback}
        ref={formCandidato}
        onSubmit={(data)=>{
            debugger;

            let action = Promise.resolve()
            


            console.log(formCandidato);
            //let formCandidato.current.values

            if (props.type === "create")
              action = candidatoService.createResource(data);
            else
              action = candidatoService.updateResource(props.row.id, data);

            return action.then(res=>{
              NotificationActions.openModal(
                { icon: true, style: "success" },
                "Operazione avvenuta con successo "
              );
            })
            
      }}
      /></div>
}