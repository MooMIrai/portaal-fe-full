import React, { PropsWithChildren, useCallback, useRef } from "react";
import { salService } from "../../../services/salService";
import GridTable from "common/Table";
import { SalActivitiesDraft } from "./ActivityDraft";
import { SalDraftItem } from "./SalDraftItem";

const columns = [
  { key: "Offer.name", label: "Offerta", type: "string",sortable: true, filter: "text"  },
  { key: "Offer.ProjectType.description", label: "Tipo progetto", type: "string", sortable: true, filter: "text"  },
  { key: "start_date", label: "Data Inizio Progetto", type: "date", sortable: true, filter: "date" },
  { key: "end_date", label: "Data Fine Progetto", type: "date", sortable: true, filter: "date" },
];

export const SalProjectDraft = React.memo((props: PropsWithChildren<{ customer: any, refreshTableParent:()=>void }>) => {

  const tableRef = useRef<any>();

  const loadData = useCallback(async (pagination, filter, sorting) => {
    const include = true;
    const tableResponse = await salService.getProjectsWithSal(
      props.customer.id,
      pagination.currentPage,
      pagination.pageSize,
      filter,
      sorting,
      include,
    );

    return {
      data: tableResponse.data,
      meta: { total: tableResponse.meta.model },
    };
  }, [props.customer.id]);

  const renderExpand = useCallback((rowProps) => (
    <SalDraftItem project={rowProps.dataItem} refreshTableParent={()=>{
      props.refreshTableParent();
      tableRef.current?.refreshTable();
    }} />
  ), []);

  return (
    <>
    <p>Progetti di {props.customer.name}</p>
    <GridTable
      expand={{
        enabled: true,
        render: renderExpand,
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
    </>
  );
});

