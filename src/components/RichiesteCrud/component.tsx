import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import Form from "common/Form";
import styles from './style.module.scss';
import { customFields } from "./customFields";
import { getFormRichiesta } from "./form";
import { requestAdapter } from "./adapters";
import { RequestFields, RequestServer } from "./models";
import {
    fileBacIcon
} from "common/icons";
import fileService from 'common/services/FileService';
import { richiestaService } from "../../services/richiestaService";
import { AiTextArea } from "./components/aiText";
import AiBox from 'common/AiBox'
import NotificationActions from 'common/providers/NotificationProvider';
import { adaptSkillsAi } from "../CandidatiCrud/adapters/adapter";


type RichiesteCrudProps = {
    row: RequestServer;
    type: any;
    closeModalCallback: () => void;
    refreshTable: () => void;
};

export function RichiesteCrud(props: RichiesteCrudProps) {

    const formRichiestaRef = useRef<any>(requestAdapter.reverseAdapt(props.row));
    const [formRichiestaData, setFormRichiestaData] = useState(formRichiestaRef.current);

    const [selectedPrimarySkill, setSelectedPrimarySkill] = useState<number[]>([]);
    const [selectedSecondarySkill, setSelectedSecondarySkill] = useState<number[]>([]);



    const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);
    const [aiModalText, setAiModalText] = useState<string>();
    const [aiModalLoading, setAiModalLoading] = useState<boolean>(false);

    const adaptAiData = useCallback((aiData) => {//cristian
        let upd = adaptSkillsAi(formRichiestaData, aiData.jsonData.data) as RequestFields;

        Object.keys(upd).forEach((x) => {
            formRichiestaRef.current.valueSetter(x, upd[x]);
        })

    }, []);

    useEffect(() => {
        if (aiModalText) {
            setAiModalLoading(true);
            richiestaService.getDataSkillTextAI(aiModalText)
                .then(adaptAiData)
                .catch(() => {
                    console.error("Errore nel caricamento dei dati AI.");
                })
                .finally(() => {
                    setAiModalLoading(false);
                });
        }
    }, [aiModalText, adaptAiData]);

    const formFields = useMemo(() => Object.values(getFormRichiesta({}, props.type, selectedPrimarySkill, setSelectedPrimarySkill,
        selectedSecondarySkill, setSelectedSecondarySkill)), [props.type, selectedPrimarySkill, selectedSecondarySkill]);

    const handleCommandExecuted = (command, closeAiPopup) => {
        if (command.id === '1') {
            setAiModalOpen(true);
            closeAiPopup();
        }

        if (command.id === '2') {
            fileService.selectFile().then(f => {
                return fileService.convertToBE(f).then(fileData => {
                    return richiestaService.getDataSkillFileAI(fileData).then((dataResult) => {
                        adaptAiData(dataResult);
                        closeAiPopup();
                    });
                });
            });
        }
    }

    return <>
        <AiBox
            onCommandExecute={handleCommandExecuted}
            commands={
                [
                    {
                        id: '1',
                        text: 'Inserisci testo offerta',
                        svgIcon: fileBacIcon
                    },
                    {
                        id: '2',
                        text: 'Seleziona File excel',
                        svgIcon: fileBacIcon
                    }
                ]
            }>
            <div className={styles.formContainer}>
                <Form
                    submitText={"Salva"}
                    customDisabled={false}
                    formData={formRichiestaData}
                    fields={formFields}
                    addedFields={customFields}
                    showSubmit={true}
                    extraButton={true}
                    extraBtnAction={props.closeModalCallback}
                    ref={formRichiestaRef}
                    onSubmit={(data) => {
                        let action = Promise.resolve()

                        let dataServer = requestAdapter.adapt(data);

                        if (props.type === "create")
                            action = richiestaService.createResource(dataServer);
                        else
                            action = richiestaService.updateResource(props.row.id, dataServer);

                        return action.then(res => {
                            NotificationActions.openModal(
                                { icon: true, style: "success" },
                                "Operazione avvenuta con successo "
                            );
                        })
                    }}
                />
            </div>
        </AiBox>
        <AiTextArea
            isOpen={aiModalOpen}
            loading={aiModalLoading}
            onConfirm={(text) => {
                setAiModalText(text);
            }}
            onAbort={() => {
                setAiModalOpen(false);
            }}
        />
    </>


}