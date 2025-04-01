import React, { PropsWithChildren, useCallback } from "react";
import { salService } from "../../../services/salService";
import GridTable from "common/Table";
import { SalDraftItem } from "./SalDraftItem";

const columns = [
    { key: "Person.lastName", label: "Nominativo", type: "custom", render:(dataItem)=><td>{dataItem.Person.firstName} {dataItem.Person.lastName}</td> },
  { key: "start_date", label: "Data Inizio Progetto", type: "date", sortable: true, filter: "date" },
  { key: "end_date", label: "Data Fine Progetto", type: "date", sortable: true, filter: "date" },
];

export const SalAllocationsDraft = React.memo((props: PropsWithChildren<{ activity: any }>) => {
  const loadData = useCallback(async (pagination, filter, sorting) => {
    const include = true;
    const tableResponse = await salService.getAllocationsWithSal(
      props.activity.id,
      pagination.currentPage,
      pagination.pageSize,
      filter,
      sorting,
      include,
    );

    return {
      data: tableResponse.data,
      meta: { total: tableResponse.meta.total },
    };
  }, [props.activity.id]);

  const renderExpand = useCallback((rowProps) => (
    <SalDraftItem person={rowProps.dataItem} project={undefined} refreshParent={function (): void {
     
    } } />
  ), []);

  return (
    <>
    <p>Persone allocate su {props.activity.description}</p>
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
    />
    </>
  );
});


