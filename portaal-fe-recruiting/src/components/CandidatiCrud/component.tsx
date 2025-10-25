import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import Form from "common/Form";
import { getFormCandidate } from "./form";
import NotificationActions from 'common/providers/NotificationProvider';
import { candidatoService } from '../../services/candidatoService';
import { formFields } from './customFields'
import { candidateAdapter } from "./adapters/adapter";
import { CandidateServer } from "./models/models";

import {
  fileBacIcon
} from "common/icons";
import fileService from 'common/services/FileService'
import { candidateAiAdapter } from "./adapters/adapter-ai";
import AiBox from 'common/AiBox'
import Loader from 'common/Loader';
import styles from './style.module.scss';

type CandidatiCrudProps = {
  row: CandidateServer;
  type: any;
  closeModalCallback: () => void;
  refreshTable: () => void;
  //onSubmit: (type: any, formData: any, refreshTable: () => void, id: any) => void;
};

export function CandidatiCrud(props: PropsWithChildren<CandidatiCrudProps>) {

  const formCandidato = useRef<any>();
  const [formCandidateData, setFormCandidateData] = useState(candidateAdapter.reverseAdapt(props.row) || {})
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [cvLoading, setCvLoading] = useState<boolean>(false);
  const [skillLoading, setSkillLoading] = useState<boolean>(false);
  const [aiFile, setAiFile] = useState<FileList | undefined>();


  useEffect(() => {
    if (props.type === 'delete') {
      NotificationActions.openConfirm('Sei sicuro di rimuovere il Candidato?',
        () => {
          candidatoService.deleteResource(props.row.id).then(() => {
            NotificationActions.openModal(
              { icon: true, style: "success" },
              "Operazione avvenuta con successo "
            );
            props.closeModalCallback();
            props.refreshTable();
          })

        },
        'Cancella Candidato'
      )
    }
  }, [props.type])

  if (props.type === "delete") {
    return <div></div>
  }



  const handleCommandExecuted = (command, closeAiPopup) => {


    if (command.id === '1') {

      fileService.selectFiles().then(f => {
        setAiFile(f);
        fileService.convertToBE(f[0]).then(fileData => {

          setCvLoading(true);
          setSkillLoading(true);

          Promise.all([candidatoService.getCVDataAI(fileData), candidatoService.getSkillAI(fileData)]).then((res) => {

            const currentObj = {
              ...formCandidato.current.values,
              ...candidateAiAdapter.reverseAdapt(res[0].jsonData),
              ...candidateAiAdapter.reverseAdaptSkills(res[1].jsonData)
            }

            Object.keys(currentObj).forEach(key => formCandidato.current.valueSetter(key, currentObj[key]))


            setFormCandidateData(() => {
              return currentObj
            });
            if (res[1].jsonData.warnings?.length > 0) {

              res[1].jsonData.warnings.forEach((x) => {
                let war_text = x.split(':');
                let text_mess = war_text.length == 3 ? war_text[1] + war_text[2] : "Errore nelle skill : " + x;

                NotificationActions.openModal(
                  { icon: true, style: "warning" },
                  text_mess
                );
              })
            }

          }).catch(() => {
            NotificationActions.openModal(
              { icon: true, style: "error" },
              "Errore nell'elaborazione del CV. Prova a cambiare il file. "
            );

          }).finally(() => {
            setCvLoading(false);
            setSkillLoading(false);

            closeAiPopup();
          });


        })

      })
    }
    //closeAiPopup()
  }

  return <>
    <AiBox
      onCommandExecute={handleCommandExecuted}
      commands={
        [
          {
            id: '1',
            text: 'Riempi Dati dal Cv',
            svgIcon: fileBacIcon
          }
        ]
      }>
      <div className={styles.formContainer}>
        <Form
          submitText={"Salva"}
          customDisabled={false}
          formData={formCandidateData}
          fields={Object.values(getFormCandidate(formCandidateData, props.type, skillLoading, cvLoading, aiFile))/* .filter((e: any) => {
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
          pageable={true}
          onSubmit={(data) => {

            let action = Promise.resolve()
            let dataServer = candidateAdapter.adapt(data);

            if (props.type === "create") {

              action = candidatoService.createResource(dataServer);
            }
            else {

              action = candidatoService.updateResource(props.row.id, dataServer);
            }

            return action.then(res => {
              props.closeModalCallback();
              props.refreshTable();
              NotificationActions.openModal(
                { icon: true, style: "success" },
                "Operazione avvenuta con successo "
              );
            })

          }}
        /></div>
      {
         skillLoading || cvLoading ? <div style={{
          position: 'absolute',
          background: 'rgba(255,255,255,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',

          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          zIndex: 9
        }}> <Loader /></div> : null
      }

    </AiBox>
  </>
}

