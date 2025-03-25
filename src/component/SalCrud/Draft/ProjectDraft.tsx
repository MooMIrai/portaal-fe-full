import React, { PropsWithChildren, useCallback, useContext, useEffect, useRef } from "react";
import { salService } from "../../../services/salService";
import GridTable from "common/Table";
import { SalDraftItem } from "./SalDraftItem";
import { SalContext } from "../../../pages/Sal/provider";

const columns = [
  { key: "Offer.name", label: "Offerta", type: "string",sortable: true, filter: "text"  },
  { key: "Offer.ProjectType.description", label: "Tipo progetto", type: "string", sortable: true, filter: "text"  },
  { key: "Offer.Location.description", label: "Sede", type: "string",sortable: true },
  { key: "amount", label: "Importo", type: "number", sortable: true},
  { key: "totalBill", label: "Totale Sal Fatturato", type: "number", sortable: true},
  { key: "lastSal", label: "Data Ultimo Sal", type: "date", sortable: true, filter: "date" },
  { key: "start_date", label: "Data Inizio Progetto", type: "date", sortable: true, filter: "date" },
  { key: "end_date", label: "Data Fine Progetto", type: "date", sortable: true, filter: "date" }
];

export const SalProjectDraft = React.memo((props: PropsWithChildren<{ customer: any, refreshParent:()=>void }>) => {

  const tableRef= useRef<any>();
  const { addOpen, removeOpen, draft, filters } = useContext(SalContext);

  const loadData = useCallback(async (pagination, filter, sorting) => {
    const include = true;
    const tableResponse = await salService.getProjectsWithSal(
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
        gridtable_expanded:draft.projects.some(d=>d===td.id)
      })),
      meta: { total: tableResponse.meta.total },
    };
  }, [props.customer.id,draft.projects,filters]);



  const renderExpand = useCallback((rowProps) => (
    <SalDraftItem project={rowProps.dataItem} refreshParent={props.refreshParent} person={undefined} />
  ), []);

  return (
    <>
    <p>Progetti di {props.customer.name}</p>
    <GridTable
      expand={{
        enabled: true,
        render: renderExpand,
        onExpandChange:(row:any,expanded:boolean)=>{
          if(expanded){
            addOpen("draft","projects",row.id);
          }else{
            removeOpen("draft","projects",row.id);
          }
        }
      }}
      rowStyle={(rowData) => ({
        background: rowData.oldSal ? 'rgba(255,0,0,0.2)' : rowData.missingSal ? 'rgba(255,209,0,0.2)' : 'rgba(0,255,0,0.2)',
      })}
      filterable={false}
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
    </>
  );
});

