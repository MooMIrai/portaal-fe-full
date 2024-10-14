import GridTable from "common/Table";
import Button from "common/Button";
import DynamicForm from "common/Form";
import React, { useEffect, useState } from "react";
import { attivitaService } from "../../../services/attivitaService";
import { attivitaColumns } from "../../ProgettoCrud/config";
import {
  detailSectionIcon,
  trashIcon
} from "common/icons";
import styles from "./styles.module.scss";

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

export interface AttivitaModalProps {
  dataItem: any;
  closeModal: Function;
  refreshTable: Function;
  handleFormSubmit: Function;
}

const AttivitaModal = (props: AttivitaModalProps) => {

  const [innerCRUDFields, setInnerCRUDFields] = useState<any>({});

  const loadModel = async () => {
    try {
      const resources = await attivitaService.getGridModel();
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

  const loadData = async (pagination: any, filter: any, sorting: any[]) => {
    const tableResponse = await attivitaService.getActivitiesByProject(
      props.dataItem.id,
      pagination.currentPage,
      pagination.pageSize,
      true,
      filter,
      sorting
    );
    return {
      data: tableResponse?.data,
      meta: {
        total: tableResponse?.meta?.total,
      },
    };
  };

  return <GridTable
    expand={{
      enabled: true,
      render: (rowProps) => {/* <ProjectTable customer={rowProps.dataItem.id} /> */ },
    }}
    filterable={true}
    sortable={true}
    getData={loadData}
    columns={attivitaColumns}
    resizableWindow={true}
    draggableWindow={true}
    initialHeightWindow={800}
    initialWidthWindow={900}
    resizable={true}
    pageable={true}
    actions={() => ["create"]}
    formCrud={(row, type, closeModalCallback, refreshTable) => {
      return (
        <div>
          <DynamicForm
            submitText={"Salva"}
            customDisabled={false}
            formData={row}
            fields={Object.values(innerCRUDFields).filter((e: any) => {
              return e.name !== "id"
            }).map((e: any) => {
              return {
                ...e,
                disabled: false
              }
            })}
            /* addedFields={formFields} */
            showSubmit={true}
            extraButton={true}
            extraBtnAction={closeModalCallback}
            onSubmit={(dataItem: { [name: string]: any }) => {
              /* handleFormSubmit(dataItem, refreshTable, dataItem.id, closeModalCallback, true); */
            }}
          />
        </div>
      );
    }}
    customRowActions={[
      {
        icon: detailSectionIcon,
        tooltip: "Modifica",
        modalContent: (dataItem, closeModal, refreshTable) => {
          return {/* <DatiOrdineModal
            dataItem={dataItem}
            closeModal={closeModal}
            refreshTable={refreshTable}
            addedFields={formFields}
            fields={innerCRUDFields}
            handleFormSubmit={handleFormSubmit}
          /> */}
        },
      },
      {
        icon: trashIcon,
        tooltip: "Elimina",
        modalContent: (dataItem, closeModal, refreshTable) => (
          <div>
            L'operazione è irreversibile.
            <div className={styles.buttonsContainer}>
              <Button onClick={() => closeModal()}>Annulla</Button>
              <Button themeColor={"error"} onClick={async () => {
                await attivitaService.deleteActivity(dataItem.id);
                refreshTable();
                closeModal();
              }}>
                Elimina
              </Button>
            </div>
          </div>
        ),
      },
    ]}
  />
}

export default AttivitaModal;