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

  const loadModel = async () => {
    try {
      const resources = await progettoService.getGridModel();
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

  const handleFormSubmit = (
    formData: any,
    refreshTable: any,
    id: any,
    closeModal: () => void,
    isCreate?: boolean,
  ) => {
    let promise: Promise<any> | undefined = undefined;
    if (!isCreate) {
      promise = progettoService.updateResource(id, formData);
    } else {
      promise = progettoService.createResource(formData);
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
      initialHeightWindow={800}
      draggableWindow={true}
      initialWidthWindow={900}
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
                return e.name !== "id"
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
              fields={innerCRUDFields}
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
            <div>
              <h3>Dettagli per {dataItem.nome}</h3>

              <button onClick={closeModal}>Chiudi</button>
            </div>
          ),
        },
        {
          icon: infoCircleIcon,
          tooltip: "Riepilogo Commessa",
          modalContent: (dataItem, closeModal, refreshTable) => {
            const data = progettoService.getProjectById(
              dataItem.id,
              true
            );

            return (
              <div>
                <h3>Dettagli per {dataItem.nome}</h3>

                <button onClick={closeModal}>Chiudi</button>
              </div>
            )
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
