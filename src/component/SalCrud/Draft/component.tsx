import React, { useCallback, useContext, useRef } from "react";
import { salService } from "../../../services/salService";
import GridTable from "common/Table";
import { SalProjectDraft } from "./ProjectDraft";
import { SalContext } from "../../../pages/Sal/provider";

const columns = [
  { key: "customer_code", label: "Codice", type: "string", sortable: true, filter: "text" },
  { key: "name", label: "Ragione sociale", type: "string", sortable: true, filter: "text" },
  { key: "vatNumber", label: "P.IVA", type: "string", sortable: true, filter: "numeric" },
  { key: "lastSal", label: "Ultimo SAL", type: "date", sortable: true, filter: "date" },
  { key: "totalSal", label: "Totale SAL", type: "number", sortable: true, filter: "number" },
];

export const SalDraft = React.memo(() => {

  const tableRef= useRef<any>();
  const { addOpen, removeOpen, draft } = useContext(SalContext);
  
  const loadData = useCallback(async (pagination, filter, sorting) => {
    const include = true;
    const tableResponse = await salService.getCustomersWithSal(
      pagination.currentPage,
      pagination.pageSize,
      filter,
      sorting,
      include,
    );

    return {
      data: tableResponse.data.map(td=>({
        ...td,
        gridtable_expanded:draft.customers.some(d=>d===td.id)
      })),
      meta: { total: tableResponse.meta.model },
    };
  }, [draft.customers]);

  const renderExpand = useCallback((rowProps) => (
    <SalProjectDraft customer={rowProps.dataItem} refreshParent={tableRef.current?.refreshTable}  />
  ), [tableRef.current]);

  return (
    <GridTable
      expand={{
        enabled: true,
        render: renderExpand,
        onExpandChange:(row:any,expanded:boolean)=>{
          if(expanded){
            addOpen("draft","customers",row.id);
          }else{
            removeOpen("draft","customers",row.id);
          }
        }
      }}
      rowStyle={(rowData) => ({
        background: rowData.oldSal ? 'rgba(255,0,0,0.2)' : rowData.missingSal ? 'rgba(255,209,0,0.2)' : 'rgba(0,255,0,0.2)',
      })}
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
    />
    
  );
});

