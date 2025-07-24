import React, { PropsWithChildren, useCallback, useContext } from "react";
import { salService } from "../../../services/salService";
import GridTable from "common/Table";
import { SalContext } from "../../../pages/Sal/provider";
import { SalCrud } from "../component";
import { omit } from "lodash";

function formatNumber(num) {
  if(typeof num != 'number') return num;
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(num);
}

const columns = [
  { key: "Sal.actualDays", label: "Giorni Lavorati", type: "number" },
  { key: "amount", label: "Importo",  type: "custom", render:(dataItem)=>{
    return <td>{formatNumber(dataItem.amount)}</td>
  } },
  { key:"billing_date", label:"Data fatturazione",type:'date',sortable:true,filter:'date'},
  { key: "billing_number", label: "Numero fattura", type: "text", sortable: true, filter: "text" },
  { key: "baf_number", label: "Numero autorizzazione", type: "text", filter: "text", sortable: true },
  { key: "month", label: "Mese", type: "custom", sortable: true, filter: "number", render:(row)=>{
    const date = new Date(new Date().getFullYear(), row.Sal.month - 1, 1);  
    let monthStr = date.toLocaleString('it-IT', { month: 'long' }).toString();
    monthStr = monthStr.charAt(0).toUpperCase() + monthStr.slice(1).toLowerCase();
  return <td>{monthStr}</td>;
  } },
  { key: "Sal.year", label: "Anno", type: "number", sortable: true, filter: "number" }
];

export const SalHistoryItem = React.memo((props: PropsWithChildren<{ project: any, refreshParent:()=>void }>) => {

  const { filters } = useContext(SalContext);

  const loadData = useCallback(async (pagination: any, filter: any, sorting: any[]) => {
    const include = true;
    const tableResponse = await salService.getHistoryBillFromProject(
      props.project.id,
      pagination.currentPage,
      pagination.pageSize,
      filter,
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
        className={"text-align-center"}
        getData={loadData}
        columns={columns}
        resizableWindow={true}
        initialHeightWindow={800}
        draggableWindow={true}
        initialWidthWindow={900}
        resizable={true}
        actions={() => ['show', 'edit', 'delete']}
        formCrud={(row: any, type: string, closeModalCallback: any, refreshTable: any)=>{
          
          return <SalCrud
                          //otherSal={otherSal}
                          project={props.project}
                          row={{...row.Sal, Bill: omit(row, ["Sal"])}}
                          type={type}
                          closeModalCallback={closeModalCallback}
                          refreshTable={props.refreshParent}
                          onNext={() => Promise.resolve()}
                        />
        }}
    />
    </>
  );
});


