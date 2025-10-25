import React, { useEffect, useState } from "react";
import DynamicForm from "common/Form";

export interface AssignCrudProps {
  dataItem: any;
  closeModal: Function;
  refreshTable: Function;
  handleFormSubmit: Function;
  addedFields: any;
  fields: any;
}

const AssignCrud = (props: AssignCrudProps) => {
  const [data, setData] = useState<any | undefined>(undefined);

  useEffect(() => {
    if (props.dataItem) {
      setData({
        ...props.dataItem,
        person_id: { id: props.dataItem.Person.id, name: props.dataItem.Person.firstName + " " + props.dataItem.Person.lastName },
      })
    }
  }, [props.dataItem]);

  return (
    <div>
      <h3>Dettagli per {data ? data.Person.firstName + " " + data.Person.lastName : ""}</h3>
      {data ? <DynamicForm
        submitText={"Salva"}
        customDisabled={false}
        formData={data}
        fields={Object.values(props.fields).filter((e: any) => {
          return e.name !== "id"
        }).map((e: any) => {
          return {
            ...e,
            disabled: e.name === "person_id" || e.name === "activity_id"
          }
        })}
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

export default AssignCrud;