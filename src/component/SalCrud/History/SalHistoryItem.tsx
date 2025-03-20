import React, { PropsWithChildren, useCallback, useContext } from "react";
import { salService } from "../../../services/salService";
import GridTable from "common/Table";
import { SalContext } from "../../../pages/Sal/provider";

const columns = [
  { key: "SalState", label: "Stato", type: "custom", render:(rowData)=><td>Sal Fatturato</td> },
  { key: "actualDays", label: "Giorni Lavorati", type: "number" },
  { key: "amount", label: "Importo", type: "number" },
  { key:"billing_date", label:"Data fatturazione",type:'date',sortable:true,filter:'date'},
  { key: "notes", label: "Note", type: "text", sortable: true, filter: "text" },
  { key: "month", label: "Mese", type: "custom", sortable: true, filter: "number", render:(row)=>{
    const date = new Date(new Date().getFullYear(), row.month - 1, 1);  
    let monthStr = date.toLocaleString('it-IT', { month: 'long' }).toString();
    monthStr = monthStr.charAt(0).toUpperCase() + monthStr.slice(1).toLowerCase();
  return <td>{monthStr}</td>;
  } },
  { key: "year", label: "Anno", type: "number", sortable: true, filter: "number" }
];

export const SalHistoryItem = React.memo((props: PropsWithChildren<{ project: any }>) => {

  const { filters } = useContext(SalContext);

  const loadData = useCallback(async (pagination: any, filter: any, sorting: any[]) => {
    const include = true;
    const tableResponse = await salService.getHistoryBillFromProject(
      props.project.id,
      pagination.currentPage,
      pagination.pageSize,
      filters,
      sorting,
      include,
    );

    return {
      data: tableResponse.data,
      meta: tableResponse.meta
    };
  }, [props.project.id,filters]);



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
        actions={() => ['show']}
    />
    </>
  );
});


