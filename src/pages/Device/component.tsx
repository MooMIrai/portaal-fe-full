import React from "react";
import GridTable from "common/Table";
import { deviceService } from "../../services/deviceService";
import Form from "common/Form";
import DeviceCrud from "../../components/DeviceCrud/component";

export default function DevicePage(){
    const columns = [

        { key: "model", label: "Modello", type: "string", sortable: true, filter: "text" },
        { key: "serial_number", label: "Seriale", type: "string", sortable: true, filter: "text" },
      ];
      
    const loadData = (
        pagination: any,
        filter: any,
        sorting: any[],
      )=>{
       return deviceService.search(pagination.currentPage,pagination.pageSize,filter,sorting)
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
     actions={()=>[
       "create",
       "edit",
       "delete",
       "show"
     ]}
 
     formCrud={(row: any, type: string, closeModalCallback: any, refreshTable: any) => <DeviceCrud 
        row={row}
        type={type} 
        closeModalCallback={closeModalCallback}
        refreshTable={refreshTable}
        onSubmit={(data)=>{
            console.log(data)
        }}
        />}
   />
}