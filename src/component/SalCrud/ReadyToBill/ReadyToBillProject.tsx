import React, { PropsWithChildren, useCallback, useContext, useRef } from "react";
import { salService } from "../../../services/salService";
import GridTable from "common/Table";
import { SalRTBItem } from "./SalRTBItem";
import { SalContext } from "../../../pages/Sal/provider";

const columns = [
    { key: "Offer.name", label: "Offerta", type: "string"},
    { key: "Offer.Customer.name", label: "Cliente", type: "string"},
    { key: "Offer.ProjectType.description", label: "Tipo progetto", type: "string"},
    { key: "start_date", label: "Data Inizio", type: "date", sortable: true, filter: "date" },
    { key: "end_date", label: "Data Fine", type: "date", sortable: true, filter: "date" },
  ]; 
export const SalRTBProject=React.memo((props: PropsWithChildren<{customer:any, refreshParent:()=>void}>)=>{

  
  const { addOpen, removeOpen, billing, filters } = useContext(SalContext);

    const loadData = useCallback(async (
        pagination: any,
        filter: any,
        sorting: any[],
      ) => {
        const include = true;
    
        const tableResponse = await salService.getReadyToBillByProject(
            props.customer.id,
          pagination.currentPage,
          pagination.pageSize,
          filters,
          sorting,
          include,
        );
    
    
        return {
          data: tableResponse.data.map(td=>({
            ...td,
            gridtable_expanded:billing.projects.some(d=>d===td.id)
          })),
          meta: {
            total: tableResponse.meta.total
          }
        }
    
      },[filters]);


    return <GridTable
                writePermissions={["WRITE_SALES_SAL"]}
                expand={{
                    enabled: true,
                    render: (rowProps) => <SalRTBItem project={rowProps.dataItem} refreshParent={props.refreshParent}  />,
                    onExpandChange:(row:any,expanded:boolean)=>{
                      if(expanded){
                        addOpen("billing","projects",row.id);
                      }else{
                        removeOpen("billing","projects",row.id);
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
                actions={() => [
                

            ]}
    
  />

})