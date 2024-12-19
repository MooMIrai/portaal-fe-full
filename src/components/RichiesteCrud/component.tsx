import React, { Children, PropsWithChildren, useRef, useState } from "react";
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
import { richiestaService } from "../../services/richiestaService";

type RichiesteCrudProps = {
    row: RequestServer;
    type: any;
    closeModalCallback: () => void;
    refreshTable: () => void;
    //onSubmit: (type: any, formData: any, refreshTable: () => void, id: any) => void;
};

function RichiesteCrudC(props: PropsWithChildren<RichiesteCrudProps>) {

    const formRichiesta = useRef();
    const [formRichiestaData, setFormRichiestaData] = useState(requestAdapter.reverseAdapt(props.row));


    return <div className={styles.formContainer}>
        <Form submitText={"Salva"}
            customDisabled={false}
            formData={formRichiestaData}
            fields={Object.values(getFormRichiesta({}, props.type))}
            addedFields={customFields}
            showSubmit={true}
            extraButton={true}
            extraBtnAction={props.closeModalCallback}
            ref={formRichiesta}
            onSubmit={() => {
                debugger;
            }}
        /></div>
}

//  IMPORTANT !

// gestire eventuali messaggi d'errore (warning ed error proveniente da back-end) => piccolo allert ? 
// o proposta d'inserimento per eventuali warning ?? sentire anche Flavio

export const RichiesteCrud = withAiBox(RichiesteCrudC, [
    {
        id: '1',
        text: ' Inserisci testo offerta',
        svgIcon: fileBacIcon
    },
    {
        id: '2',
        text: ' Seleziona File excel', // valutare inserimento riga
        svgIcon: fileBacIcon
    }
], (command, closeAiPopup) => {

    //  Testo input
    if (command.id === '1') {

        // apertura piccola modale per il testo o aggiungere qualche input ??

        richiestaService.getDataSkillTextAI("TEsto prova").then((dataResult) => {

            debugger;



        }).catch(() => {

        }).finally(() => {

        });
    }

    // File Excel 
    if (command.id === '2') {

        fileService.selectFile().then(f => {

            fileService.convertToBE(f).then(fileData => {


                richiestaService.getDataSkillExcelAI(fileData).then((dataResult) => {

                    debugger;

                    /*  
                    setFormCandidateData((prevState: any) => {
                       return {
                         ...prevState,
                         ...adapter.adapt(dataResult.jsonData)
                       }
                     }) 
                     */
                }).catch(() => {

                }).finally(() => {

                })
            })

            closeAiPopup();
        }).catch(() => {
            debugger;
        })
    }
    //closeAiPopup()
});