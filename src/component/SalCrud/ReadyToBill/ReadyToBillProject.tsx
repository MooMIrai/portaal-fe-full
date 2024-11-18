import React, { PropsWithChildren } from "react";
import { salService } from "../../../services/salService";
import GridTable from "common/Table";
import { SalRTBItem } from "./SalRTBItem";

const columns = [
    { key: "Offer.name", label: "Offerta", type: "string"},
    { key: "Offer.Customer.name", label: "Cliente", type: "string"},
    { key: "Offer.ProjectType.description", label: "Tipo progetto", type: "string"},
    { key: "start_date", label: "Data Inizio", type: "date", sortable: true, filter: "date" },
    { key: "end_date", label: "Data Fine", type: "date", sortable: true, filter: "date" },
  ]; 
export const SalRTBProject=React.memo((props: PropsWithChildren<{customer:any}>)=>{

    const loadData = async (
        pagination: any,
        filter: any,
        sorting: any[],
      ) => {
        const include = true;
    
        const tableResponse = await salService.getReadyToBillByProject(
            props.customer.id,
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
                expand={{
                    enabled: true,
                    render: (rowProps) => <SalRTBItem project={rowProps.dataItem}  />,
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