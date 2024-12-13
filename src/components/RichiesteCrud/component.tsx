import React, { PropsWithChildren, useRef, useState } from "react";
import Form from "common/Form";
import styles from './style.module.scss';

import { customFields } from "./customFields";
import { getFormRichiesta } from "./form";


type RichiesteCrudProps = {
    row: Record<string, any>;
    type: any;
    closeModalCallback: () => void;
    refreshTable: () => void;
    //onSubmit: (type: any, formData: any, refreshTable: () => void, id: any) => void;
  };

export function RichiesteCrud(props:PropsWithChildren<RichiesteCrudProps>){

    const formRichiesta = useRef();
    const [formRichiestaData,setFormRichiestaData] = useState({
        ...props.row,
        pippo:{id:0,name:"Seleziona un dipendente"}
        /*requestingEmployee_id:{
            id:props.row.requestingEmployee_id,
            name:
                props.row.RequestingEmployee?
                props.row.RequestingEmployee.Person.firstName + ' ' +props.row.RequestingEmployee.Person.lastName
            :''}*/
    })

    return <div className={styles.formContainer}>
        <Form submitText={"Salva"} 
            customDisabled={false}
            formData={formRichiestaData}
            fields={Object.values(getFormRichiesta({},props.type))}
            addedFields={customFields}
            showSubmit={true}
            extraButton={true}
            extraBtnAction={props.closeModalCallback}
            ref={formRichiesta}
            onSubmit={()=>{
                debugger;
            }}
    /></div>
}