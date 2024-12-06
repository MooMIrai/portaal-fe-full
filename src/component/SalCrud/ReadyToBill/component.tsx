import React, { useContext, useRef } from "react";
import { salService } from "../../../services/salService";
import GridTable from "common/Table";
import { SalRTBProject } from "./ReadyToBillProject";
import { SalContext } from "../../../pages/Sal/provider";

const columns = [
    { key: "customer_code", label: "Codice", type: "string", sortable: true, filter: "text" },
    { key: "name", label: "Ragione sociale", type: "string", sortable: true, filter: "text" },
    { key: "vatNumber", label: "P.IVA", type: "string", sortable: true, filter: "numeric" },
    { key: "lastSal", label: "Ultimo SAL", type: "date", sortable: true, filter: "date" },
    { key: "totalSal", label: "Totale SAL", type: "number", sortable: true, filter: "number" },
  ];  
export function SalReadyToBill(){
  const tableRef= useRef<any>();
  const { addOpen, removeOpen, billing } = useContext(SalContext);
  
    const loadData = async (
        pagination: any,
        filter: any,
        sorting: any[],
      ) => {
        const include = true;
    
        const tableResponse = await salService.getReadyToBillByCustomer(
          pagination.currentPage,
          pagination.pageSize,
          filter,
          sorting,
          include,
        );
    
    
        return {
          data: tableResponse.data.map(td=>({
            ...td,
            gridtable_expanded:billing.customers.some(d=>d===td.id)
          })),
          meta: {
            total: tableResponse.meta.model
          }
        }
    
      };


    return <GridTable
                expand={{
                    enabled: true,
                    render: (rowProps) => <SalRTBProject customer={rowProps.dataItem} refreshParent={tableRef.current?.refreshTable} />,
                    onExpandChange:(row:any,expanded:boolean)=>{
                      if(expanded){
                        addOpen("billing","customers",row.id);
                      }else{
                        removeOpen("billing","customers",row.id);
                      }
                    }
                  }}
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
                ref={tableRef}
                actions={() => [
                

            ]}
    
  />
}