import React, { PropsWithChildren, useCallback } from "react";
import { salService } from "../../../services/salService";
import GridTable from "common/Table";

const columns = [
  { key: "SalState", label: "Stato", type: "custom", render:(rowData)=><td>Ok a fatturare</td> },
  { key: "actualDays", label: "Giorni Lavorati", type: "number" },
  { key: "amount", label: "Importo", type: "number" },
  { key: "notes", label: "Note", type: "text", sortable: true, filter: "text" },
  { key: "month", label: "Mese", type: "custom", sortable: true, filter: "number", render:(row)=>{
    const date = new Date(new Date().getFullYear(), row.month - 1, 1);  
    let monthStr = date.toLocaleString('it-IT', { month: 'long' }).toString();
    monthStr = monthStr.charAt(0).toUpperCase() + monthStr.slice(1).toLowerCase();
  return <td>{monthStr}</td>;
  } },
  { key: "year", label: "Anno", type: "number", sortable: true, filter: "number" }
];

export const SalRTBItem = React.memo((props: PropsWithChildren<{ project: any }>) => {
  const loadData = useCallback(async (pagination: any, filter: any, sorting: any[]) => {
    const include = true;
    const tableResponse = await salService.getSalRTBFromProject(
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



  return (
    <>
    <p>Sal di {props.project.Offer.name}</p>
    
    <GridTable
        filterable={true}
        sortable={true}
        getData={loadData}
        columns={columns}
        resizableWindow={true}
        initialHeightWindow={800}
        draggableWindow={true}
        initialWidthWindow={900}
        resizable={true}
        actions={() => [ "edit", "delete", "create"]}
    />
    </>
  );
});


