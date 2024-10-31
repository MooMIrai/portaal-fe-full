import React, { useEffect, useState } from "react";
import DynamicForm from "common/Form";
import { progettoService } from "../../services/progettoServices";
import { salService } from "../../services/salService";
import GridTable from "common/Table";
import Button from "common/Button";
import NotificationProviderActions from "common/providers/NotificationProvider";
import { columns, SalColumns } from "./config";
import {
  detailSectionIcon,
  dollarIcon,
  infoCircleIcon,
  bookIcon,
  rowsIcon,
  trashIcon
} from "common/icons";
import { formFields } from "./customFields";
import styles from "./styles.module.scss";
import DatiOrdineModal from "../Modals/DatiOrdineModal/component";
import SalModal from "../Modals/SalModal/component";
import AttivitaModal from "../Modals/AttivitaModal/component";
import CostiCommessaModal from "../Modals/CostiCommessaModal/component";

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

const ProjectTable = (props: { customer: number }) => {
  const [innerCRUDFields, setInnerCRUDFields] = useState<any>({});
  const [innerCRUDFieldsUpdate, setInnerCRUDFieldsUpdate] = useState<any>({});

  const loadData = async (pagination: any, filter: any, sorting: any[]) => {
    const include = true;
    let correctFilters = JSON.parse(JSON.stringify(filter));
    const customerFilter = {
      field: "Offer.customer_id",
      operator: "equals",
      value: props.customer,
    };
    if (!correctFilters) {
      correctFilters = { logic: "and", filters: [customerFilter] };
    } else {
      correctFilters.logic = "and";
      correctFilters.filters.push(customerFilter);
    }
    const tableResponse = await progettoService.getProjectByCustomer(
      props.customer,
      pagination.currentPage,
      pagination.pageSize,
      include
    );

    console.log("resp: ", tableResponse);

    return {
      data: tableResponse?.data,
      meta: { total: tableResponse?.meta?.total },
    };
  };

  const loadModel = async (update?: boolean) => {
    try {
      const resources = !update ? await progettoService.getCreateDTOModel() : await progettoService.getUpdateDTOModel();
      if (!resources) {
        throw new Error("No resources found");
      }

      const newModel: any = {};
      resources
        /* .filter((item: any) => !excludedKeys.includes(item.name)) */
        .forEach((item: any) => {
          const name = item.name === "offer_id" ? 'offerte-selector' : item.name;
          if (item.nested) {
            item.nested.forEach((i: any) => {
              newModel[i.name] = {
                name: i.name,
                type: i.name === "offer_id" ? 'offerte-selector' : determineFieldType(i.type),
                label: i.name === "offer_id" ? "Offerta" : i.name.charAt(0).toUpperCase() + i.name.slice(1),
                value: "",
                disabled: i.readOnly,
                required: i.required,
                options: i.enum || [],
                showLabel: !i.enum && i.type.toLocaleLowerCase() !== 'boolean',
                parentObject: item.name,
              };
            });
          } else {
            newModel[name] = {
              name: item.name,
              type: item.name === "offer_id"
                ? 'offerte-selector'
                : item.enum
                  ? 'select'
                  : determineFieldType(item.type),
              label: item.name === "offer_id" ? "Offerta" : item.name.charAt(0).toUpperCase() + item.name.slice(1),
              value: "",
              disabled: item.readOnly,
              required: item.required,
              options: item.enum || [],
              showLabel: !item.enum && item.type.toLocaleLowerCase() !== 'boolean'
            };
          }
        });

      !update ? setInnerCRUDFields(newModel) : setInnerCRUDFieldsUpdate(newModel);
    } catch (error) {
      console.error("Error loading fields:", error);
      !update ? setInnerCRUDFields({}) : setInnerCRUDFieldsUpdate({});
    }
  };

  useEffect(() => {
    loadModel();
    loadModel(true);
  }, []);

  const handleFormSubmit = (
    formData: any,
    refreshTable: any,
    id: any,
    closeModal: () => void,
    isCreate?: boolean,
  ) => {
    //add parent object structure if needed
    let newFormData = {};

    Object.keys(formData).forEach(k => {
      let parent = innerCRUDFields[k]?.parentObject;
      if (parent && !newFormData[parent]) {
        newFormData[parent] = { [k]: formData[k] }
      } else if (parent && newFormData[parent]) {
        newFormData[parent] = {
          ...newFormData[parent],
          [k]: formData[k]
        }
      } else {
        newFormData[k] = formData[k];
      }
    });

    newFormData["offer_id"] = newFormData["offer_id"]?.id;
    if (newFormData["rate"]) {
      newFormData["rate"] = parseInt(newFormData["rate"]);
    }
    if (newFormData["amount"]) {
      newFormData["amount"] = parseInt(newFormData["amount"]);
    }
    if (newFormData["workedDays"]) {
      newFormData["workedDays"] = parseInt(newFormData["workedDays"]);
    }

    let promise: Promise<any> | undefined = undefined;
    if (!isCreate) {
      promise = progettoService.updateResource(id, newFormData);
    } else {
      promise = progettoService.createResource(newFormData);
    }

    if (promise) {
      promise.then(() => {
        NotificationProviderActions.openModal(
          { icon: true, style: "success" },
          "Operazione avvenuta con successo"
        );
        refreshTable();
        closeModal();
      });
    }
  };

  return (
    <GridTable
      filterable={true}
      pageable={false}
      sortable={true}
      getData={loadData}
      columns={columns}
      resizableWindow={true}
      initialHeightWindow={1000}
      draggableWindow={true}
      initialWidthWindow={1200}
      resizable={true}
      actions={() => ["create"]}
      formCrud={(row, type, closeModalCallback, refreshTable) => {
        return (
          <div>
            <DynamicForm
              submitText={"Salva"}
              customDisabled={false}
              formData={row}
              fields={Object.values(innerCRUDFields).filter((e: any) => {
                return e.name !== "id" && e.name !== "date_created" &&
                  e.name !== "date_modified" &&
                  e.name !== "user_created" &&
                  e.name !== "user_modified"
              }).map((e: any) => {
                return {
                  ...e,
                  disabled: false
                }
              })}
              addedFields={formFields}
              showSubmit={true}
              extraButton={true}
              extraBtnAction={closeModalCallback}
              onSubmit={(dataItem: { [name: string]: any }) => {
                handleFormSubmit(dataItem, refreshTable, dataItem.id, closeModalCallback, true);
              }}
            />
          </div>
        );
      }}
      customRowActions={[
        {
          icon: detailSectionIcon,
          tooltip: "Dati Ordine",
          modalContent: (dataItem, closeModal, refreshTable) => {
            return <DatiOrdineModal
              dataItem={dataItem}
              closeModal={closeModal}
              refreshTable={refreshTable}
              addedFields={formFields}
              fields={innerCRUDFieldsUpdate}
              handleFormSubmit={handleFormSubmit}
            />
          },
        },
        {
          icon: dollarIcon,
          tooltip: "SAL",
          modalContent: (dataItem, closeModal, refreshTable) => {
            return <SalModal
              dataItem={dataItem}
              closeModal={closeModal}
              refreshTable={refreshTable}
              handleFormSubmit={handleFormSubmit}
            />
          },
        },
        {
          icon: rowsIcon,
          tooltip: "Attività",
          modalContent: (dataItem, closeModal, refreshTable) => {
            return <AttivitaModal
              dataItem={dataItem}
              closeModal={closeModal}
              refreshTable={refreshTable}
              handleFormSubmit={handleFormSubmit}
            />
          },
        },
        {
          icon: bookIcon,
          tooltip: "Costi Commessa",
          modalContent: (dataItem, closeModal, refreshTable) => (
            <CostiCommessaModal
              dataItem={dataItem}
              closeModal={closeModal}
              refreshTable={refreshTable}
              handleFormSubmit={handleFormSubmit}
            />
          ),
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
                  await progettoService.deleteProject(dataItem.id);
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
  );
};

export default ProjectTable;
