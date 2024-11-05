import React, { useState, useEffect } from "react";
import GridTable from "common/Table";
import { customerService } from "../../services/clienteService";
import { ClienteCrud } from "../../component/ClienteCrud/component";
import { adaptToCustomerModel } from "../../adapters/clienteAdapters";
import NotificationProviderActions from "common/providers/NotificationProvider";

const columns = [
  { key: "customer_code", label: "Codice", type: "string", sortable: true, filter: "text" },
  { key: "name", label: "Ragione sociale", type: "string", sortable: true, filter: "text" },
  { key: "email", label: "Email", type: "string", sortable: true, filter: "text" },
  { key: "website", label: "Sito web", type: "string", sortable: true, filter: "text" },
  { key: "vatNumber", label: "P.IVA", type: "string", sortable: true, filter: "numeric" },

];


function Clienti() {



  const loadData = async (
    pagination: any,
    filter: any,
    sorting: any[],
  ) => {
    const include = true;

    const tableResponse = await customerService.search(
      pagination.currentPage,
      pagination.pageSize,
      filter,
      sorting,
      include,
    );


    return {
      data: tableResponse.data.map(adaptToCustomerModel),
      meta: {
        total: tableResponse.meta.model
      }
    }

  };




  const handleFormSubmit = (type: string, formData: any, refreshTable: any, id: any, closeModal: () => void) => {
    let promise: Promise<any> | undefined = undefined;
    if (type === "create") {
      promise = customerService.createResource(formData);
    } else if (type === "edit") {
      promise = customerService.updateResource(id, formData);
    } else if (type === "delete") {
      promise = customerService.deleteResource(id);
    }

    if (promise) {
      promise.then(() => {
        NotificationProviderActions.openModal({ icon: true, style: 'success' }, "Operazione avvenuta con successo");
        refreshTable();
        closeModal();
      })
    }

  }

  return <GridTable
    /*  inputSearchConfig={{
       inputSearch: termValue,
       handleInputSearch: handleInputSearch,
       debouncedSearchTerm: termValue,
     }} */
    filterable={true}
    pageable={true}
    sortable={true}
    getData={loadData}
    columns={columns}
    resizableWindow={true}
    initialHeightWindow={800}
    draggableWindow={true}
    initialWidthWindow={900}
    resizable={true}
    actions={() => [
      "show",
      "edit",
      "delete",
      "create"

    ]}
    formCrud={(row: any, type: string, closeModalCallback: any, refreshTable: any) => (
      <>
        <ClienteCrud
          row={row}
          type={type}
          closeModalCallback={closeModalCallback}
          refreshTable={refreshTable}
          onSubmit={handleFormSubmit}
        />
      </>
    )}
  />


}

export default Clienti