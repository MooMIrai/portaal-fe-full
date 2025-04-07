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
import { progettoForm } from "./forms/progetto";



const ProjectTable = (props: { customer: number }) => {


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
      include,
      filter,
      sorting
    );


    return {
      data: tableResponse?.data,
      meta: { total: tableResponse?.meta?.total },
    };
  };

 
  const handleFormSubmit = (
    formData: any,
    refreshTable: any,
    id: any,
    closeModal: () => void,
    isCreate?: boolean,
  ) => {
    
    let newFormData = {
      ...formData,
    };

    newFormData["offer_id"] = newFormData["offer_id"]?.id;
    if (newFormData["rate"]) {
      newFormData["rate"] = parseInt(newFormData["rate"]);
    }
    if (newFormData["amount"]) {
      newFormData["amount"] = parseInt(newFormData["amount"]);
    }
    if (newFormData["workedDays"]) {
      newFormData["workedDays"] = parseInt(formData.Offer.days);
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
      actions={() => []}
      formCrud={(row, type, closeModalCallback, refreshTable) => {
        return (
          <div>
            <DynamicForm
              submitText={"Salva"}
              customDisabled={false}
              formData={row}
              fields={Object.values(progettoForm)/* .filter((e: any) => {
                return e.name !== "id" && e.name !== "date_created" &&
                  e.name !== "date_modified" &&
                  e.name !== "user_created" &&
                  e.name !== "user_modified"
              }) .map((e: any) => {
                return {
                  ...e,
                  disabled: false
                }
              })*/}
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
              fields={progettoForm}
              handleFormSubmit={handleFormSubmit}
            />
          },
        },
       /*  {
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
        }, */
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
