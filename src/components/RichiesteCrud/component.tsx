import React, { PropsWithChildren, useRef, useState } from "react";
import Form from "common/Form";
import styles from './style.module.scss';

import { customFields } from "./customFields";
import { getFormRichiesta } from "./form";
import { requestAdapter } from "./adapters";
import { RequestServer } from "./models";
import withAiBox from "common/hoc/AiBox";
import {
    fileBacIcon
  } from "common/icons";
import fileService from 'common/services/FileService'

type RichiesteCrudProps = {
    row: RequestServer;
    type: any;
    closeModalCallback: () => void;
    refreshTable: () => void;
    //onSubmit: (type: any, formData: any, refreshTable: () => void, id: any) => void;
  };

function RichiesteCrudC(props:PropsWithChildren<RichiesteCrudProps>){

    const formRichiesta = useRef();
    const [formRichiestaData,setFormRichiestaData] = useState(requestAdapter.reverseAdapt(props.row))

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

export const RichiesteCrud = withAiBox(RichiesteCrudC,[
    {
        id: '1',
        text: 'Riempi Dati dal Cv',
        svgIcon: fileBacIcon
    }
], (command,closeAiPopup)=>{

    if(command.id==='1'){
        fileService.selectFile().then(f=>{
            debugger;
            closeAiPopup();
        }).catch(()=>{
            debugger;
        })
    }
    //closeAiPopup()
});