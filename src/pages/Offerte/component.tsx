import React, { useEffect, useState } from "react";
import NotificationProviderActions from "common/providers/NotificationProvider";
import GridTable from "common/Table";
import { offertaService } from "../../services/offertaService";
import { fromOfferBEModelToOfferModel, locationOption, sedeAdapter } from "../../adapters/offertaAdapters";
import { OffertaCrud } from "../../component/OffertaCrud/component";
import CountrySelector from "common/CountrySelector";

const columns = [
  {
    key: "customer_name",
    label: "Cliente",
    type: "string",
    sortable: true,
    filter: "text",
  },
  {
    key: "accountManager.name",
    label: "Commerciale",
    type: "string",
    sortable: true,
    filter: "text",
  },
  {
    key: "protocol",
    label: "Protocollo",
    type: "string",
    sortable: true,
    filter: "text",
  },
  {
    key: "title",
    label: "Titolo",
    type: "string",
    sortable: true,
    filter: "text",
  },
  {
    key: "description",
    label: "Descrizione",
    type: "string",
    sortable: true,
    filter: "text",
  },
  {
    key: "creation_date",
    label: "Data creazione",
    type: "date",
    sortable: true,
    filter: "date",
  },
];

const mapColumnKey: { [key: string]: string } = {
  "customer_name": "Customer.name",
  "accountManager.name": "AccountManager.Person.lastName",
  "protocol":"project_code",
  "title":"name",
  "description":"other_details",
  "creation_date":"date_created"
};
// Filter mapping function
const mapFilterFields = (filter: any | null): any => {
  if (!filter || !filter.filters) {
    return { logic: "or", filters: [] };
  }

  const mappedFilters = filter.filters.map((f) => {
    if ("field" in f) {
      const fd = f as any;
      return { ...fd, field: mapColumnKey[fd.field as string] || fd.field };
    } else {
      const cf = f as any;
      return mapFilterFields(cf);
    }
  });
  return { ...filter, filters: mappedFilters };
};
export default function OffertePage() {


  const [initialWidthWindow, setInitialWidthWindow] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setInitialWidthWindow(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const loadData = async (
    pagination: any,
    filter: any,
    sorting: any[],
    term?: string
  ) => {

    const include = true;
    const mappedFilter = mapFilterFields(filter);
    const mappedSorting = sorting.map((s) => ({
      ...s,
      field: mapColumnKey[s.field] || s.field,
    }));

    const tableResponse = await offertaService.search(
      pagination.currentPage,
      pagination.pageSize,
      mappedFilter,
      mappedSorting,
      term,
      include
    );

  
    const adaptedData = tableResponse.data.map(fromOfferBEModelToOfferModel);

    console.log("Adapted Data: ", adaptedData); 
    return {
      data: adaptedData,
      meta: {
        total: tableResponse.meta.total,
      },
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
      promise = offertaService.createResource(formData);
    } else if (type === "edit") {
      promise = offertaService.updateResource(id, formData);
    } else if (type === "delete") {
      promise = offertaService.deleteResource(id);
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
      sortable={true}
      getData={loadData}
      columns={columns}
      pageable={true}
      resizableWindow={true}
      initialHeightWindow={1000}
      initialWidthWindow={initialWidthWindow} 
      resizable={true}
      actions={(row) => {
        const actions: string[] = ["create"]; 
      
        if (row?.outcome_type?.id === "P") {
          if (row?.thereisProject) {
            actions.push("show");
          } else {
            actions.push("show", "delete");
          }
        } else if (row?.thereisProject) {
          actions.push("show", "edit");
        } else {
          actions.push("show", "edit", "delete");
        }
      
        return actions;
      }}
      
      formCrud={(
        row: any,
        type: string,
        closeModalCallback: any,
        refreshTable: any
      ) => (
        <>
          <OffertaCrud
            row={row}
            type={type}
            closeModalCallback={closeModalCallback}
            refreshTable={refreshTable}
            onSubmit={handleFormSubmit}
          />
        </>
      )}
    />
  );
}
