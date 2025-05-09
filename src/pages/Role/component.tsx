import React, { useState, useEffect } from "react";
import GridTable from "common/Table";

import NotificationProviderActions from "common/providers/NotificationProvider";
import { RoleService } from "../../services/roleservice";
import { RoleCrud } from "../../components/RoleCrud/component";
import { RolePermission } from "../../components/RolePermission/component";
import Button from 'common/Button';



export function RolePage() {

    const [selectedRole,setSelectedRole] = useState<number>()

    const columns = [
        { key: "role", label: "Ruolo", type: "string", sortable: true, filter: "text" },
        { key: "description", label: "Descrizione", type: "string", sortable: true, filter: "text" },
        { key: "id", label: "Permessi", type: "custom", sortable: false, render:(rowdata:any)=><Button fillMode={"link"}
        themeColor={"info"}
        onClick={() =>
          setSelectedRole(rowdata.id)
        }>Associa permessi</Button> }   
      ];
      

  const loadData = async (
    pagination: any,
    filter: any,
    sorting: any[],
  ) => {
    const tableResponse = await RoleService.search(pagination.currentPage,pagination.pageSize,filter,sorting,undefined,true)
    return {
      data: tableResponse.data,
      meta: {
        total: tableResponse.meta.model
      }
    }

  };


  const handleFormSubmit = (type: string, formData: any, refreshTable: any, id: any, closeModal: () => void) => {
    let promise: Promise<any> | undefined = undefined;

    if (type === "create") {
      promise = RoleService.createResource(formData);
    } else if (type === "edit") {
      promise = RoleService.updateResource(id, formData);
    } else if (type === "delete") {
      promise = RoleService.deleteResource(id);
    }

    if (promise) {
      promise.then(() => {
        NotificationProviderActions.openModal({ icon: true, style: 'success' }, "Operazione avvenuta con successo");
        refreshTable();
        closeModal();
      })
    }

  }

  return <><GridTable
    writePermissions={["WRITE_ROLES"]}
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
        <RoleCrud
          row={row}
          type={type}
          closeModalCallback={closeModalCallback}
          refreshTable={refreshTable}
          onSubmit={handleFormSubmit}
        />
      </>
    )}
  />
  <RolePermission idRole={selectedRole || 0} onClose={()=>setSelectedRole(undefined)} open={!!selectedRole} />
  </>
}
