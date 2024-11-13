import React from "react";
import { salService } from "../../../services/salService";
import GridTable from "common/Table";

const columns = [
    { key: "customer_code", label: "Codice", type: "string", sortable: true, filter: "text" },
    { key: "name", label: "Ragione sociale", type: "string", sortable: true, filter: "text" },
    { key: "vatNumber", label: "P.IVA", type: "string", sortable: true, filter: "numeric" },
    { key: "lastSal", label: "Ultimo SAL", type: "date", sortable: true, filter: "date" },
    { key: "totalSal", label: "Totale SAL", type: "number", sortable: true, filter: "number" },
  ];  

export function SalDraft(){

    const loadData = async (
        pagination: any,
        filter: any,
        sorting: any[],
      ) => {
        const include = true;
    
        const tableResponse = await salService.getCustomersWithSal(
          pagination.currentPage,
          pagination.pageSize,
          filter,
          sorting,
          include,
        );
    
    
        return {
          data: tableResponse.data,
          meta: {
            total: tableResponse.meta.model
          }
        }
    
      };


    return <GridTable
                /*  inputSearchConfig={{
                inputSearch: termValue,
                handleInputSearch: handleInputSearch,
                debouncedSearchTerm: termValue,
                }} */
                rowStyle = {
                    (rowData)=>{
                        
                        return {background:rowData.oldSal?'rgba(255,0,0,0.2)':rowData.missingSal?'rgba(255,209,0,0.2)':'rgba(0,255,0,0.2)'}
                    }
                }
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
                

            ]}
    
  />
}