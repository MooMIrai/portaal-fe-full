import React, { useState } from "react";
import DynamicForm from "common/Form";
import { progettoService } from "../../services/progettoServices";
import { CrudGenericService } from "../../services/personaleServices";
import GridTable from "common/Table";
import Button from "common/Button";
import NotificationProviderActions from "common/providers/NotificationProvider";
import { columns } from "./config";
import { detailSectionIcon, bookIcon, rowsIcon, trashIcon} from "common/icons";
import { formFields } from "./customFields";
import styles from "./styles.module.scss";
import DatiOrdineModal from "../Modals/DatiOrdineModal/component";
import AttivitaModal from "../Modals/AttivitaModal/component";
import CostiCommessaModal from "../Modals/CostiCommessaModal/component";
import { progettoForm } from "./forms/progetto";



const ProjectTable = (props: { customer: number, currentFilter: any }) => {

  const [overrideParentFilters, setOverrideParentFilters] = useState<boolean>();

  const loadData = async (pagination: any, filter: any, sorting: any[]) => {

    const include = true;
    let correctFilters = JSON.parse(JSON.stringify(filter));
    const currentDate = new Date();

    const dateFilters = [
      {
        field: "start_date",
        value: new Date(currentDate.getFullYear() - 1, 0).toISOString(),
        operator: "gte"
      },
      {
        field: "start_date",
        value: new Date(currentDate.getFullYear(), 12).toISOString(),
        operator: "lt"
      }
    ];

    if (!correctFilters) {
      correctFilters = { logic: "and", filters: [...dateFilters] };
    }
    
    else if (!correctFilters.filters.some(filter => filter.field === "start_date")) {
      correctFilters.logic = "and";
      correctFilters.filters.push(...dateFilters);
    }

    if (props.currentFilter && props.currentFilter.filters?.length > 0 && !overrideParentFilters) {
      const personFilter = props.currentFilter.filters.find(filter => filter.field === "person_id");
      if (personFilter) correctFilters.filters.push(personFilter);
    }

    const tableResponse = await progettoService.getProjectByCustomer(
      props.customer,
      pagination.currentPage,
      pagination.pageSize,
      include,
      correctFilters,
      sorting
    );

    return {
      data: tableResponse?.data,
      meta: tableResponse?.meta,
    };
  };

  const defaultSort = [
    {
      field: "start_date",
      dir: "desc"
    }
  ];

 
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
      pageable={true}
      sortable={true}
      sorting={defaultSort}
      getData={loadData}
      columns={columns}
      onFilterSubmit={() => setOverrideParentFilters(true)}
      addedFilters={[
        {
          name: "person_id",
          label: "Dipendente assegnato",
          type: "filter-autocomplete",
          options: {
              getData: (term: string) => Promise.resolve(
                CrudGenericService.searchAccount(term).then(res => {
                  if(res) return res.map(r => ({id: r.person_id, name: `${r.firstName} ${r.lastName} (${r.email})`}));
                  else return [];
                })
              ),
              getValue: (v: any) => v?.id
          }
        }
      ]}
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
