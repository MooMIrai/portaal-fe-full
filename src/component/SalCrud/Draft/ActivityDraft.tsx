import React, { PropsWithChildren, useCallback } from "react";
import { salService } from "../../../services/salService";
import GridTable from "common/Table";
import { SalAllocationsDraft } from "./AllocationDraft";

const columns = [
  { key: "ActivityType.description", label: "Tipo Attività", type: "string", sortable: true, filter: "text" },
  { key: "description", label: "Descrizione", type: "string" },
  { key: "ActivityManager.Person", label: "Responsabile", type: "custom", render:(dataItem)=><td>{dataItem.ActivityManager.Person.firstName} {dataItem.ActivityManager.Person.lastName}</td> },
  { key: "start_date", label: "Data Inizio Attività", type: "date", sortable: true, filter: "date" },
  { key: "end_date", label: "Data Fine", type: "date", sortable: true, filter: "date" },
];

export const SalActivitiesDraft = React.memo((props: PropsWithChildren<{ project: any }>) => {
  const loadData = useCallback(async (pagination: any, filter: any, sorting: any[]) => {
    const include = true;
    const tableResponse = await salService.getActivitiesWithSal(
      props.project.id,
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
  }, [props.project.id]);


  const renderExpand = useCallback((rowProps) => (
    <SalAllocationsDraft activity={rowProps.dataItem} />
  ), []);


  return (
    <>
    <p>Attività del progetto {props.project.Offer.name}</p>
    <GridTable
        expand={{
            enabled: true,
            render: renderExpand,
          }}
          rowStyle={(rowData) => ({
            background: rowData.oldSal ? 'rgba(255,0,0,0.2)' : rowData.missingSal ? 'rgba(255,209,0,0.2)' : 'rgba(0,255,0,0.2)',
          })}
        filterable={true}
        sortable={true}
        getData={loadData}
        columns={columns}
        resizableWindow={true}
        initialHeightWindow={800}
        draggableWindow={true}
        initialWidthWindow={900}
        resizable={true}
    />
    </>
  );
});


