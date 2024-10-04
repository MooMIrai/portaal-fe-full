import React from "react";
import { convertProjectBEToProject } from "../../adapters/progettoAdapters";
import { progettoService } from "../../services/progettoServices";
import GridTable from "common/Table";
import NotificationProviderActions from "common/providers/NotificationProvider";
import { columns } from "./config";
import {
  detailSectionIcon,
  dollarIcon,
  infoCircleIcon,
  bookIcon,
  rowsIcon,
} from "common/icons";

const ProjectTable = (props: { customer: number }) => {
  console.log("customerid_ ", props);
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
      data: tableResponse.map(convertProjectBEToProject),
      meta: { total: tableResponse.length },
    };
  };

  const handleFormSubmit = (
    type: string,
    formData: any,
    refreshTable: any,
    id: any,
    closeModal: () => void
  ) => {
    let promise: Promise<any> | undefined = undefined;

    if (type === "create") {
      promise = progettoService.createResource(formData);
    } else if (type === "edit") {
      promise = progettoService.updateResource(id, formData);
    } else if (type === "delete") {
      promise = progettoService.deleteResource(id);
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
      customRowActions={[
        {
          icon: detailSectionIcon,
          tooltip: "Dati Ordine",
          modalContent: (dataItem, closeModal, refreshTable) => {
            console.log(dataItem);
            return (
              <div>
                <h3>Dettagli per {dataItem.nome}</h3>

                <button onClick={closeModal}>Chiudi</button>
              </div>
            );
          },
        },
        {
          icon: dollarIcon,
          tooltip: "SAL",
          modalContent: (dataItem, closeModal, refreshTable) => {
            const getSal = async (
              pagination: any,
              filter: any,
              sorting: any[]
            ) => {
              const data = dataItem;
              return {
                data: data,
                meta: { total: data.length },
              };
            };

            return (
              <GridTable
                filterable={false}
                pageable={false}
                sortable={false}
                getData={getSal}
                columns={columns}
                resizableWindow={true}
                initialHeightWindow={800}
                draggableWindow={true}
                initialWidthWindow={900}
                resizable={true}
              />
            );
          },
        },
        {
          icon: rowsIcon,
          tooltip: "Attività",
          modalContent: (dataItem, closeModal, refreshTable) => (
            <div>
              <h3>Dettagli per {dataItem.nome}</h3>

              <button onClick={closeModal}>Chiudi</button>
            </div>
          ),
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
          modalContent: (dataItem, closeModal, refreshTable) => (
            <div>
              <h3>Dettagli per {dataItem.nome}</h3>

              <button onClick={closeModal}>Chiudi</button>
            </div>
          ),
        },
      ]}
    />
  );
};

export default ProjectTable;
