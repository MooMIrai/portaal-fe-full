import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import Form from "common/Form";
import { getFormCandidate } from "./form";
import styles from './style.module.scss';
import NotificationActions from 'common/providers/NotificationProvider';
import { candidatoService } from '../../services/candidatoService';
import { formFields } from './customFields'
import { candidateAdapter } from "./adapters/adapter";
import { CandidateServer } from "./models/models";
import withAiBox from "common/hoc/AiBox";
import {
  fileBacIcon
} from "common/icons";
import fileService from 'common/services/FileService'
import { candidateAiAdapter } from "./adapters/adapter-ai";

type CandidatiCrudProps = {
  row: CandidateServer;
  type: any;
  closeModalCallback: () => void;
  refreshTable: () => void;
  //onSubmit: (type: any, formData: any, refreshTable: () => void, id: any) => void;
};

export function CandidatiCrud(props: PropsWithChildren<CandidatiCrudProps>) {

  const formCandidato = useRef();
  const [formCandidateData, setFormCandidateData] = useState(candidateAdapter.reverseAdapt(props.row))
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [skillLoading, setSkillLoading] = useState<boolean>(false);



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
  const CandidatiCrudInner = withAiBox(() => <div className={styles.formContainer}>
    <Form
      submitText={"Salva"}
      customDisabled={false}
      formData={formCandidateData}
      fields={Object.values(getFormCandidate({}, props.type, skillLoading))/* .filter((e: any) => {
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
      onSubmit={(data) => {
        debugger;

        let action = Promise.resolve()

        let dataServer = candidateAdapter.adapt(data);

        console.log(formCandidato);
        //let formCandidato.current.values

        if (props.type === "create")
        {
          debugger;
          action = candidatoService.createResource(dataServer);
        }
        else
        {
          debugger;
          action = candidatoService.updateResource(props.row.id, dataServer);
        }

        return action.then(res => {
          NotificationActions.openModal(
            { icon: true, style: "success" },
            "Operazione avvenuta con successo "
          );
        })

      }}
    /></div>, [
    {
      id: '1',
      text: 'Riempi Dati dal Cv',
      svgIcon: fileBacIcon
    }
  ], (command, closeAiPopup) => {

    debugger;
    if (command.id === '1') {

      fileService.selectFile().then(f => {
        debugger;
        fileService.convertToBE(f).then(fileData => {

          candidatoService.getCVDataAI(fileData).then((dataResult) => {

            debugger;

            //quando finisce 
            setFormCandidateData((prevState: any) => {
              return {
                ...prevState,
                ...candidateAiAdapter.reverseAdapt(dataResult.jsonData)
                // ...adapter.adapt(dataResult)
              }
            })
          }).catch(() => {

          }).finally(() => {

          });

          setSkillLoading(true);
          candidatoService.getSkillAI(fileData).then((skillResult) => {

            debugger;

            setFormCandidateData((prevState: any) => {
              return {
                ...prevState,
                ...candidateAiAdapter.reverseAdaptSkills(skillResult.jsonData)
              }
            })
          }).catch(() => {
            // NotificationProviderActions.openModal({style:"error",icon:true},"Errore nella lettura della clipboard. Copia nuovamente il link.");

          }).finally(() => {
            setSkillLoading(false);
          })
        })
        closeAiPopup();
      }).catch(() => {
        debugger;
      })
    }
    //closeAiPopup()
  });

  return <CandidatiCrudInner />
}

