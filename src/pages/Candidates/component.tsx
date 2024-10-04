import React, { useState } from "react";
import GridTable from "common/Table";
import { candidatoService } from "../../services/candidatoService";

export default function CandidatePage(){

   

    const columns = [

        { key: "first_name", label: "Nome", type: "string", sortable: true, filter: "text" },
        { key: "last_name", label: "Cognome", type: "string", sortable: true, filter: "text" },
        { key: "job_profile", label: "Mansione", type: "string", sortable: true, filter: "text" },
        { key: "skills", label: "Skills", type: "string", sortable: true, filter: "text" },
        { key: "date_updated", label: "Data Ultima Revisione", type: "date", sortable: true, filter: "text" }
      ];
      
    const loadData = (
        pagination: any,
        filter: any,
        sorting: any[],
      )=>{
       return candidatoService.search(pagination.currentPage,pagination.pageSize,filter,sorting)
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
       <>
          
       </>
     )}
   />
}