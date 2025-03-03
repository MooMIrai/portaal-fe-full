import React, { useCallback, useContext, useRef } from "react";
import { salService } from "../../../services/salService";
import GridTable from "common/Table";
import { SalProjectDraft } from "./ProjectDraft";
import { SalContext } from "../../../pages/Sal/provider";
import { offertaService } from "../../../services/offertaService";
import { CrudGenericService } from "../../../services/personaleServices";


const columns = [
  { key: "customer_code", label: "Codice", type: "string", sortable: true  },
  { key: "name", label: "Ragione sociale", type: "string", sortable: true },
  { key: "vatNumber", label: "P.IVA", type: "string", sortable: true },
  { key: "lastSal", label: "Ultimo SAL", type: "date", sortable: true },
  { key: "totalSal", label: "Totale SAL", type: "number", sortable: true },
];




export const SalDraft = React.memo(() => {

  const tableRef= useRef<any>();
  const { addOpen, removeOpen, draft, setFilters } = useContext(SalContext);

  
  const loadData = useCallback(async (pagination, filter, sorting) => {
    const include = true;

    const tableResponse = await salService.getCustomersWithSal(
      pagination.currentPage,
      pagination.pageSize,
      filter,
      sorting,
      include,
    );
    setFilters(filter);
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

