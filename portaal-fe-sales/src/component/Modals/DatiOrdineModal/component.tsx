import React, { useEffect, useState } from "react";
import { progettoService } from "../../../services/progettoServices";
import DynamicForm from "common/Form";

import styles from './style.module.scss';
export interface DatiOrdineModalProps {
  dataItem: any;
  closeModal: Function;
  refreshTable: Function;
  handleFormSubmit: Function;
  addedFields: any;
  fields: any;
}

const DatiOrdineModal = (props: DatiOrdineModalProps) => {
  const [data, setData] = useState<any | undefined>(undefined);

  useEffect(() => {

    progettoService.getProjectWorkedDays(props.dataItem.id)
    .then(giorniLavorati=>{
      progettoService.getProjectById(
        props.dataItem.id,
        true
      ).then(res => setData({...res,workedDays:giorniLavorati}));
    })

    
  }, []);

  return (
    <div className={styles.form}>
      <h3 style={{marginBottom: "20px"}}>Dettagli per {props.dataItem.offer_name}</h3>
      {data ? <DynamicForm
        style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr', gap : 20}}
        submitText={"Salva"}
        customDisabled={false}
        formData={{
          ...data,
          offer_id: { id: data.offer_id, name: data.Offer.name }
        }}
        fields={Object.values(props.fields).filter((e: any) => {
          if(e.name === 'amount'  && data.Offer.ProjectType.billing_type!=="LumpSum")
            return false;
          if(e.name === 'rate'  && data.Offer.ProjectType.billing_type!=="Daily" )
            return false 

          return true;
          
          
        })/*.map((e: any) => {
          if(e.name === 'amount'){
            debugger;
            e.conditions = data.Offer.ProjectType.billing_type==="LumpSum" || data.Offer.ProjectType.billing_type=== "None";
          }else if(e.name === 'rate'){
            e.conditions = data.Offer.ProjectType.billing_type==="Daily"  || data.Offer.ProjectType.billing_type==="None";
          }
          return e;
        })*/}
        addedFields={props.addedFields}
        showSubmit={true}
        extraButton={true}
        extraBtnAction={props.closeModal}
        onSubmit={(dataItem: { [name: string]: any }) => {
          props.handleFormSubmit(dataItem, props.refreshTable, dataItem.id, props.closeModal, false);
        }}
      /> : null}
    </div>
  );
}

export default DatiOrdineModal;