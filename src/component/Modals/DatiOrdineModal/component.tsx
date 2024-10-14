import React, { useEffect, useState } from "react";
import { progettoService } from "../../../services/progettoServices";
import DynamicForm from "common/Form";

export interface DatiOrdineModalProps {
  dataItem: any;
  closeModal: Function;
  refreshTable: Function;
  handleFormSubmit: Function;
  addedFields: any;
  fields: any[];
}

const DatiOrdineModal = (props: DatiOrdineModalProps) => {
  const [data, setData] = useState<any[] | undefined>(undefined);

  useEffect(() => {
    progettoService.getProjectById(
      props.dataItem.id,
      true
    ).then(res => setData(res));
  }, []);

  return (
    <div>
      <h3>Dettagli per {props.dataItem.offer_name}</h3>
      {data ? <DynamicForm
        submitText={"Salva"}
        customDisabled={false}
        formData={data}
        fields={Object.values(props.fields).filter((e: any) => {
          return e.name !== "id"
        }).map((e: any) => {
          return {
            ...e,
            disabled: e.name === "user_created" ||
              e.name === "user_modified" ||
              e.name === "date_modified" ||
              e.name === "date_created" ||
              e.name === "offer_id"
          }
        })}
        addedFields={props.addedFields}
        showSubmit={true}
        extraButton={true}
        extraBtnAction={props.closeModal}
        onSubmit={(dataItem: { [name: string]: any }) => {
          props.handleFormSubmit(dataItem, props.refreshTable, dataItem.id, props.closeModal, true);
        }}
      /> : null}
    </div>
  );
}

export default DatiOrdineModal;