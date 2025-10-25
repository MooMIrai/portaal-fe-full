import React, { useEffect, useState } from "react";
import { salService } from "../../../services/salService";
import { SalColumns } from "../../ProgettoCrud/config";
import GridTable from "common/Table";
import DynamicForm from "common/Form";

export interface SalModalProps {
  dataItem: any;
  closeModal: Function;
  refreshTable: Function;
  handleFormSubmit: Function;
  /*   addedFields: any;
    fields: any[]; */
}

const determineFieldType = (
  value: any
):
  | "number"
  | "text"
  | "email"
  | "date"
  | "time"
  | "textarea"
  | "password"
  | "checkbox"
  | "select" => {
  if (value.toLocaleLowerCase() === "boolean") return "checkbox";
  if (value.toLocaleLowerCase() === "number" || value.toLocaleLowerCase() === "float" || value.toLocaleLowerCase() === "int") return "number";
  if (value.toLocaleLowerCase() === "string") {
    if (value.toLocaleLowerCase().includes("@")) return "email";
    return "text";
  }
  if (value.toLocaleLowerCase() === "date" || value.toLocaleLowerCase() === "datetime") return "date";
  if (value.toLocaleLowerCase() === "projectstate") return "select";
  return "text";
};

const SalModal = (props: SalModalProps) => {
  const [innerCRUDFields, setInnerCRUDFields] = useState<any>({});

  const loadModel = async () => {
    try {
      const resources = await salService.getGridModel();
      if (!resources) {
        throw new Error("No resources found");
      }

      const newModel: any = {};
      resources
        /* .filter((item: any) => !excludedKeys.includes(item.name)) */
        .forEach((item: any) => {
          const name = item.name === "offer_id" ? 'offerte-selector' : item.name;
          newModel[name] = {
            name: item.name,
            type: item.name === "offer_id" ? 'offerte-selector' : determineFieldType(item.type),
            label: item.name === "offer_id" ? "Offerta" : item.name.charAt(0).toUpperCase() + item.name.slice(1),
            value: "",
            disabled: item.readOnly,
            required: item.required,
            options: item.type.toLocaleLowerCase() === "projectstate" ? ["OPEN", "CLOSED", "INPROGRESS"] : [],
            showLabel: item.type.toLocaleLowerCase() !== "projectstate" && item.type.toLocaleLowerCase() !== 'boolean'
          };
        });

      setInnerCRUDFields(newModel);
    } catch (error) {
      console.error("Error loading fields:", error);
      setInnerCRUDFields({});
    }
  };

  useEffect(() => {
    loadModel();
  }, []);

  const getData = async (
    pagination: any,
    filter: any,
    sorting: any[]
  ) => {
    return salService.getSalByProject(
      props.dataItem.id,
      pagination.currentPage,
      pagination.pageSize,
      filter,
      sorting,
      true
    );
  }

  return (
    <GridTable
      filterable={false}
      pageable={false}
      sortable={false}
      getData={getData}
      columns={SalColumns}
      resizableWindow={true}
      initialHeightWindow={800}
      draggableWindow={true}
      initialWidthWindow={900}
      resizable={true}
    />
  );
}

export default SalModal;