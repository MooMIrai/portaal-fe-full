import React, { useEffect, useState } from "react";
import GridTable from "common/Table";
import { candidatoService } from "../../services/candidatoService";
import { CandidatiCrud } from "../../components/CandidatiCrud/component";

export default function CandidatePage(){

    
    const columns = [

        { key: "Person.firstName", label: "Nome", type: "string", sortable: true, filter: "text" },
        { key: "Person.lastName", label: "Cognome", type: "string", sortable: true, filter: "text" },
        { key: "job_profile", label: "Mansione", type: "string", sortable: true, filter: "text" },
        { key: "skills", label: "Skills", type: "string", sortable: true, filter: "text" },
        { key: "date_updated", label: "Data Ultima Revisione", type: "date", sortable: true, filter: "text" }
      ];
      
    const loadData = (
        pagination: any,
        filter: any,
        sorting: any[],
      )=>{
        
       return candidatoService.search(pagination.currentPage,pagination.pageSize,filter,sorting,undefined,true)
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
       
     ]}
 
     formCrud={(row: any, type: string, closeModalCallback: any, refreshTable: any) => (
       <CandidatiCrud refreshTable={refreshTable} type={type} row={row} closeModalCallback={closeModalCallback} />
     )}
   />
}