import React, { PropsWithChildren, useCallback, useContext } from "react";
import { salService } from "../../../services/salService";
import GridTable from "common/Table";
import { SalHistoryItem } from "./SalHistoryItem";
import { SalContext } from "../../../pages/Sal/provider";

function formatNumber(num) {
  if(typeof num != 'number') return num;
  return num.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
const columns = [
  { key: "Offer.name", label: "Offerta", type: "string",sortable: true, filter: "text"  },
  { key: "Offer.ProjectType.description", label: "Tipo progetto", type: "string", sortable: true, filter: "text"  },
  { key: "Offer.Location.description", label: "Sede", type: "string",sortable: true },
  { key: "Offer.billing_type", label: "Tipo Fatturazione", sortable: true,type: "custom",render:(data)=><td>{
    data.Offer.billing_type!=='Daily'?'A corpo':'Time material'
    }</td> },
  { key: "amount", label: "Importo", type: "custom", render:(dataItem)=>{
    return <td>{formatNumber(dataItem.amount)}</td>
  }, sortable: true},
  { key: "totalBill", label: "Totale Sal Fatturato", type: "custom", render:(dataItem)=>{
    return <td>{formatNumber(dataItem.totalBill)}</td>
  }, sortable: true},
  { key: "lastSal", label: "Data Ultimo Sal", type: "date", sortable: true, filter: "date" },
  { key: "start_date", label: "Data Inizio Progetto", type: "date", sortable: true, filter: "date" },
  { key: "end_date", label: "Data Fine Progetto", type: "date", sortable: true, filter: "date" },
];
export const SalHistoryProject = React.memo((props: PropsWithChildren<{ customer: any }>) => {

  const { filters } = useContext(SalContext);

  const loadData = useCallback(async (
    pagination: any,
    filter: any,
    sorting: any[],
  ) => {
    const include = true;

    const tableResponse = await salService.getHistoryBillFromCustomer(
      props.customer.id,
      pagination.currentPage,
      pagination.pageSize,
      filters,
      sorting,
      include,
    );


    return {
      data: tableResponse.data,
      meta:tableResponse.meta
      
    }

  },[filters]);

  const renderExpand = useCallback((rowProps) => (
    <SalHistoryItem project={rowProps.dataItem} />
  ), []);


  return <GridTable
    expand={{
      enabled: true,
      render: renderExpand,
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
     // 'show'
    ]}

  />

})