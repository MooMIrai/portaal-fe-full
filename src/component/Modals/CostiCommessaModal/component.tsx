import GridTable from "common/Table";
import Button from "common/Button";
import DynamicForm from "common/Form";
import React, { useEffect, useState } from "react";
import { attivitaService } from "../../../services/attivitaService";
import { attivitaColumns, costiCommessaColumns } from "../../ProgettoCrud/config";
import {
  detailSectionIcon,
  trashIcon
} from "common/icons";
import styles from "./styles.module.scss";
import CostiCommessaCrud from "./CostiCommessaCrud/component";
import { progettoService } from "../../../services/progettoServices";
import { projectExpensesCustomFields } from "./customfields";

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

export interface CostiCommessamodalProps {
  dataItem: any;
  closeModal: Function;
  refreshTable: Function;
  handleFormSubmit: Function;
}

const CostiCommessamodal = (props: CostiCommessamodalProps) => {

  const [innerCRUDFields, setInnerCRUDFields] = useState<any>({});

  const loadModel = async () => {
    try {
      const resources = await progettoService.getProjectExpensesCreateDtoModel();
      if (!resources) {
        throw new Error("No resources found");
      }

      const newModel: any = {};
      resources
        /* .filter((item: any) => !excludedKeys.includes(item.name)) */
        .forEach((item: any) => {
          const name = item.name === "projectExpensesType_id"
            ? 'project-type-selector'
            : item.name === "Attachment"
              ? 'files'
              : item.name;
          newModel[name] = {
            name: item.name === "Attachment"
              ? "files"
              : item.name,
            type: item.name === "projectExpensesType_id"
              ? 'project-type-selector'
              : item.name === "Attachment"
                ? "uploadSingleFile"
                : determineFieldType(item.type),
            label: item.name === "projectExpensesType_id"
              ? "Tipologia spesa"
              : item.name.charAt(0).toUpperCase() + item.name.slice(1),
            value: "",
            disabled: item.readOnly,
            required: item.required,
            options: [],
            showLabel: true,
            readOnly: item.readOnly,
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
    const tableResponse = await progettoService.getExpensesByProjectId(
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
      progettoService.createProjectExpense(
        props.dataItem.id,
        dataItem.description,
        parseInt(dataItem.amount),
        dataItem.payment_date,
        dataItem.projectExpensesType_id.id,
        dataItem.files
      ).then(res => {
        if (res) {
          closeModalCallback();
          refreshTable();
        }
      })
    } else {
      progettoService.updateProjectExpense(
        dataItem.id,
        dataItem.description,
        parseInt(dataItem.amount),
        dataItem.payment_date,
        dataItem.projectExpensesType_id.id,
        dataItem.files
      ).then(res => {
        if (res) {
          closeModalCallback();
          refreshTable();
        }
      })
    }
  }

  return <GridTable
    filterable={true}
    sortable={true}
    getData={loadData}
    columns={costiCommessaColumns}
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
            formData={{ project_id: props.dataItem.id }}
            fields={Object.values(innerCRUDFields).filter((e: any) => {
              return !(e.readOnly || e.name === "id")
            }).map((e: any) => {
              return {
                ...e,
                disabled: e.name === "project_id",
              }
            })}
            showSubmit={true}
            extraButton={true}
            extraBtnAction={closeModalCallback}
            onSubmit={(dataItem: { [name: string]: any }) => {
              handleFormSubmit(dataItem, refreshTable, closeModalCallback);
            }}
            addedFields={projectExpensesCustomFields}
          />
        </div>
      );
    }}

    customRowActions={[
      {
        icon: detailSectionIcon,
        tooltip: "Modifica",
        modalContent: (dataItem, closeModal, refreshTable) => {
          return <CostiCommessaCrud
            dataItem={dataItem}
            closeModal={closeModal}
            refreshTable={refreshTable}
            fields={Object.values(innerCRUDFields).map((f: any) => {
              return {
                ...f,
                existingFile: f.name === "files" ? dataItem.files && dataItem.files.length ? [{ name: dataItem.files[0].file_name }] : undefined : undefined,
              }
            })}
            addedFields={projectExpensesCustomFields}
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
                await progettoService.deleteProjectExpense(dataItem.id);
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

export default CostiCommessamodal;