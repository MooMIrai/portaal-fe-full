import React, { useEffect } from "react";
import GridTable from "common/Table";
import { CrudGenericService } from "../../services/personaleServices";
import { WaitingProjectCrud } from "../../component/WaitingProjectCrud/component";

export function WaitingProject(){

    const columns = [
        { key: "Person.firstName", label: "Nome", type: "string", sortable: true, filter: "text" },
        { key: "Person.lastName", label: "Cognome", type: "string", sortable: true, filter: "text" },
        { key: "notes", label: "Note", type: "string", sortable: true, filter: "text" },
        { key: "dailyCost", label: "Costo giornaliero", type: "string", sortable: true, filter: "text" },
        { key: "startDate", label: "Data inizio", type: "date", sortable: true, filter: "text" },
      ];

      const loadData = async (pagination: any, filter: any, sorting: any[]) => {

        const include = true;

        if (!(sorting?.length > 0)) sorting = [{field: "startDate", dir: "desc"}];
    
        const tableResponse = await CrudGenericService.getResourceAlignment(
          pagination.currentPage,
          pagination.pageSize,
          filter,
          sorting,
          include,
        );

        return {
          data: tableResponse.data || tableResponse,
          meta: tableResponse.meta?tableResponse.meta:{
            total: tableResponse.length
          }
        }
      
      };


    return <>
        { <GridTable
            writePermissions={["WRITE_RESOURCE_ALIGNMENT"]}
            className={"text-align-center"}
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
            "edit"
            
        
            ]}
            formCrud={(row: any, type: string, closeModalCallback: any, refreshTable: any) => (
            <WaitingProjectCrud row={row} type={type} onClose={()=>{
                closeModalCallback();
                refreshTable();
            }} />
            )}
        />
 }
    </>

}