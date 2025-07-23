import React, { useCallback, useContext, useRef } from "react";
import { salService } from "../../../services/salService";
import GridTable from "common/Table";
import { SalHistoryProject } from "./HistoryProject";
import { SalContext } from "../../../pages/Sal/provider";
import { CrudGenericService } from "../../../services/personaleServices";
import { offertaService } from "../../../services/offertaService";

function formatNumber(num) {
  if(typeof num != 'number') return num;
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(num);
}
const columns = [
  { key: "name", label: "Ragione sociale", type: "string", sortable: true },
  { key: "totalAmount", label: "Totale Importo Progetti", type: "custom", render:(dataItem)=>{
    return <td>{formatNumber(dataItem.totalAmount)}</td>
  }, sortable: true },
  { key: "totalBill", label: "Totale SAL Fatturato", type: "custom", render:(dataItem)=>{
    return <td>{formatNumber(dataItem.totalBill)}</td>
  }, sortable: true }
];

export const SalHistoryCustomer = React.memo(() => {

  const { setFilters } = useContext(SalContext);
   const tableRef= useRef<any>();

  const loadData = useCallback(async (pagination, filter, sorting) => {
    const include = true;
    const tableResponse = await salService.getHistoryBillCustomer(
      pagination.currentPage,
      pagination.pageSize,
      filter,
      sorting,
      include,
    );
    setFilters(filter);
    return {
      data: tableResponse.data,
      meta: tableResponse.meta
    };
  }, []);

  const renderExpand = useCallback((rowProps) => (
    <SalHistoryProject customer={rowProps.dataItem} refreshParent={tableRef.current?.refreshTable}/>
  ), []);

  return (
    <GridTable
    writePermissions={["WRITE_SALES_SAL"]}
      expand={{
        enabled: true,
        render: renderExpand,
      }}
      className={"no-justify-th"}
      ref={tableRef}
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
      addedFilters={[
              {
                name: "month",
                label: "Mese",
                type: "filter-autocomplete",
                options:{
                  getData:(term:string)=> Promise.resolve([
                    { id: 1, name: "Gennaio" },
                    { id: 2, name: "Febbraio" },
                    { id: 3, name: "Marzo" },
                    { id: 4, name: "Aprile" },
                    { id: 5, name: "Maggio" },
                    { id: 6, name: "Giugno" },
                    { id: 7, name: "Luglio" },
                    { id: 8, name: "Agosto" },
                    { id: 9, name: "Settembre" },
                    { id: 10, name: "Ottobre" },
                    { id: 11, name: "Novembre" },
                    { id: 12, name: "Dicembre" }
                  ].filter(p=>!term || p.name.toLowerCase().indexOf(term.toLowerCase())>=0)),
                  getValue:(v:any)=>v?.id
                }
              },
              {
                name: "year",
                label: "Anno",
                type: "number"
              },
              {
                name: "offer_id",
                label: "Offerta",
                type: "filter-autocomplete",
                options:{
                  getData:(term:string)=> offertaService.searchOfferte(term).then(res=>res.data),
                  getValue:(v:any)=>v?.id
                }
              },
              {
                name: "customer_id",
                label: "Cliente",
                type: "filter-autocomplete",
                options:{
                  getData:(term:string)=> salService.searchCustomer(term),
                  getValue:(v:any)=>v?.id
              }   
              },
              {
                name: "billing_number",
                label: "Numero fattura",
                type: "string"
              },
              {
                name: "person_id",
                label: "Dipendente(digita un carattere per la ricerca)",
                type: "filter-autocomplete",
                options:{
                  getData:(term:string)=> CrudGenericService.searchAccount(term).then(res=> res?res.map(r=>({id:r.person_id,name:r.firstName+ ' '+r.lastName})):[]),
                  getValue:(v:any)=>v?.id
                },    
              }
            ]}
    />
  );
});

