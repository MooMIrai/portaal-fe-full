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

  const addExistingFile = (fields: any[]) => {

    const file =  props.dataItem.file;

    const fields_with_file = fields.map(field => {

      if (field.name === "file" && file) field.existingFile = [{name: file.file_name, id: file.uniqueIdentifier}];
      return field;

    });

    return fields_with_file;

  };

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
        fields={addExistingFile(Object.values(props.fields))}
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