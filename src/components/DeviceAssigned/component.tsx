import React, { useState } from "react";
import GridTable from "common/Table";
import { deviceService } from "../../services/deviceService";
import NotificationProviderActions from "common/providers/NotificationProvider";

import { CellCheckbox } from "./CellCheckbox";


export  function DeviceAssigned(props:{user:number}){


    const columns = [
        { key: "model", label: " ", type: "custom", sortable: false, width:'35px', render:(row,refresh)=> <CellCheckbox idGroup={props.user} row={row} />},
        { key: "Stock.model", label: "Modello", type: "string", sortable: true, filter: "text" },
        { key: "Stock.serial_number", label: "Seriale", type: "string", sortable: true, filter: "text" },
        { key: "Stock.DeviceType.name", label: "Tipo dispositivo", type: "string", sortable: false}
    ];
      
    const loadData = (
        pagination: any,
        filter: any,
        sorting: any[],
      )=>{
       return deviceService.searchAssignedByUser(props.user,pagination.currentPage,pagination.pageSize,filter,sorting,undefined,true)
    }

    const handleFormSubmit = (type: string, formData: any, refreshTable: any, id: any, closeModal: () => void) => {
      let promise: Promise<any> | undefined = undefined;
  
      if (type === "create") {
        promise = deviceService.createResource(formData);
      } else if (type === "edit") {
        promise = deviceService.updateResource(id, formData);
      } else if (type === "delete") {
        promise = deviceService.deleteResource(id);
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
        
        filterable={true}
        sortable={true}
        getData={loadData}
        columns={columns}
        resizableWindow={true}
        initialHeightWindow={800}
        draggableWindow={true}
        initialWidthWindow={900}
        resizable={true}
        
    
        formCrud={(row: any, type: string, closeModalCallback: any, refreshTable: any) => <></>}
    />
   
   
}