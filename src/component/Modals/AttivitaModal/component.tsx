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
import { formFields } from "./customFields";
import styles from "./styles.module.scss";
import AttivitaCrud from "./AttivitaCrud/component";
import AssigningTable from "./AttivitaCrud/AssigningTable/component";
import { activityForm } from "../../ProgettoCrud/forms/activity";

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

  //const [innerCRUDFields, setInnerCRUDFields] = useState<any>({});

/*   const loadModel = async () => {
    try {
      const resources = await attivitaService.getGridModel();
      if (!resources) {
        throw new Error("No resources found");
      }

      const newModel: any = {};
      resources
        .forEach((item: any) => {
          const name = item.name === "activityManager_id"
            ? 'manager-selector'
            : item.name === 'activityType_id'
              ? 'activity-type-selector'
              : item.name;
          newModel[name] = {
            name: item.name,
            type: item.name === "activityManager_id"
              ? 'manager-selector'
              : item.name === "activityType_id"
                ? 'activity-type-selector'
                : determineFieldType(item.type),
            label: item.name === "activityManager_id"
              ? "Commerciale"
              : item.name === "activityType_id"
                ? "Tipo attività"
                : item.name.charAt(0).toUpperCase() + item.name.slice(1),
            value: item.name === "project_id" ? props.dataItem.id : "",
            disabled: item.readOnly || item.name === "project_id",
            required: item.required,
            options: item.type.toLocaleLowerCase() === "projectstate" ? ["OPEN", "CLOSED", "INPROGRESS"] : [],
            showLabel: true,
            readOnly: item.readOnly,
          };
        });

        debugger;
      setInnerCRUDFields(newModel);
    } catch (error) {
      console.error("Error loading fields:", error);
      setInnerCRUDFields({});
    }
  };
 */
  /* useEffect(() => {
    loadModel();
  }, []);
 */
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

  const handleFormSubmit = (dataItem: { [name: string]: any }, refreshTable: () => void, closeModalCallback: () => void, isEdit?: boolean) => {
    if (!isEdit) {
      attivitaService.createResource(
        {
          ...dataItem,
          activityType_id: dataItem.activityType_id.id,
          activityManager_id: dataItem.activityManager_id.id
        }
      ).then(res => {
        if (res) {
          closeModalCallback();
          refreshTable();
        }
      })
    } else {
      attivitaService.updateResource(
        dataItem.id,
        {
          ...dataItem,
          activityType_id: dataItem.activityType_id.id,
          activityManager_id: dataItem.activityManager_id.id
        }
      ).then(res => {
        if (res) {
          closeModalCallback();
          refreshTable();
        }
      })
    }
  }

  return <GridTable
    expand={{
      enabled: true,
      render: (rowProps) => <AssigningTable activity_id={rowProps.dataItem.id} />,
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
            fields={Object.values(activityForm)}
            addedFields={formFields}
            showSubmit={true}
            extraButton={true}
            extraBtnAction={closeModalCallback}
            onSubmit={(dataItem: { [name: string]: any }) => {
              handleFormSubmit({...dataItem, project_id: props.dataItem.id}, refreshTable, closeModalCallback);
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
          return <AttivitaCrud
            dataItem={dataItem}
            closeModal={closeModal}
            refreshTable={refreshTable}
            addedFields={formFields}
            fields={activityForm}
            handleFormSubmit={(dataItem, refreshTable, closeModal) => handleFormSubmit(dataItem, refreshTable, closeModal, true)}
          />
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