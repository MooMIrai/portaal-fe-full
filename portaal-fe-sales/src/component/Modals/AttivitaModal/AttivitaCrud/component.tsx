import React, { useEffect, useState } from "react";
import { attivitaService } from "../../../../services/attivitaService";
import DynamicForm from "common/Form";

export interface AttivitaCrudProps {
  dataItem: any;
  closeModal: Function;
  refreshTable: Function;
  handleFormSubmit: Function;
  addedFields: any;
  fields: any;
}

const AttivitaCrud = (props: AttivitaCrudProps) => {
  const [data, setData] = useState<any[] | undefined>(undefined);

  useEffect(() => {
    attivitaService.getActivityById(
      props.dataItem.id,
      true
    ).then(res => {
      setData({
        ...res,
        activityType_id: { id: res.activityType_id, name: res.ActivityType?.description || '' },
        activityManager_id: { id: res.activityManager_id, name: res.ActivityManager.Person.firstName + " " + res.ActivityManager.Person.lastName }
      })
    });
  }, []);

  return (
    <div>
      <h3>Dettagli per {props.dataItem.description}</h3>
      {data ? <DynamicForm
        submitText={"Salva"}
        customDisabled={false}
        formData={data}
        fields={Object.values(props.fields)}
        addedFields={props.addedFields}
        showSubmit={true}
        extraButton={true}
        extraBtnAction={props.closeModal}
        onSubmit={(dataItem: { [name: string]: any }) => {
          props.handleFormSubmit(dataItem, props.refreshTable, props.closeModal, true);
        }}
      /> : null}
    </div>
  );
}

export default AttivitaCrud;