import React, { useState, useEffect } from "react";
import GridTable from "common/Table";

import NotificationProviderActions from "common/providers/NotificationProvider";
import { CompanyCrud } from "../../component/SocietaCrud/component";
import { CompanyServices } from "../../services/companyServices";
import { fromBeToModel } from "../../adapters/companyAdapter";

const columns = [
  { key: "name", label: "Ragione sociale", type: "string", sortable: true, filter: "text" },

];


function Societa() {

  const loadData = async (
    pagination: any,
    filter: any,
    sorting: any[],
  ) => {
    const include = true;

    const tableResponse = await CompanyServices.getCompany(
      pagination.currentPage,
      pagination.pageSize,
      filter,
      sorting,
      include,
    );


    return {
      data: tableResponse.data.map(fromBeToModel),
      meta:tableResponse.meta
      
    }

  };




  const handleFormSubmit = (type: string, formData: any, refreshTable: any, id: any, closeModal: () => void) => {
    let promise: Promise<any> | undefined = undefined;

    if (type === "create") {
      promise = CompanyServices.createCompany(formData);
    } else if (type === "edit") {
      promise = CompanyServices.updateCompany(id, formData);
    } else if (type === "delete") {
      promise = CompanyServices.deleteCompany(id);
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
    writePermissions={["WRITE_HR_COMPANY"]}
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
        <CompanyCrud
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

export default Societa