import React from "react";
import GridTable from "common/Table";
import { deviceService } from "../../services/deviceService";
import { CellCheckbox } from "./CellCheckbox";

export  function DeviceAssigned(props:{user:number}){


    const columns = [
        { key: "model", label: " ", type: "custom", sortable: false, width:'35px', render:(row)=> <CellCheckbox idGroup={props.user} row={row} />},
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
        
    />
   
   
}