import React, { useEffect, useState } from "react";
import DynamicForm from "common/Form";
import { progettoService } from "../../../../services/progettoServices";

export interface CostiCommessaCrudProps {
  dataItem: any;
  closeModal: Function;
  refreshTable: Function;
  handleFormSubmit: Function;
  addedFields?: any;
  fields: any[];
}

const CostiCommessaCrud = (props: CostiCommessaCrudProps) => {
  const [data, setData] = useState<any[] | undefined>(undefined);

  useEffect(() => {
    setData({
      ...props.dataItem,
      projectExpensesType_id: { id: props.dataItem.projectExpensesType_id, name: props.dataItem.ProjectExpensesType.description }
    })
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

export default CostiCommessaCrud;