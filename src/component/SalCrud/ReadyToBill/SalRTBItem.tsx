import React, { PropsWithChildren, useCallback, useContext, useState } from "react";
import { salService } from "../../../services/salService";
import GridTable from "common/Table";
import { SalCrud } from "../component";
import NotificationActions from 'common/providers/NotificationProvider';
import {stampIcon} from 'common/icons';
import Button from 'common/Button';
import authService from 'common/services/AuthService';
import { SalContext } from "../../../pages/Sal/provider";


function formatNumber(num) {
  if(typeof num != 'number') return num;
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(num);
}
export const SalRTBItem = React.memo((props: PropsWithChildren<{ project: any, refreshParent:()=>void }>) => {
  
  const [rows, setRows] = useState<Array<any>>();
  const { filters } = useContext(SalContext);


  const columns = [
    { key: "SalState", label: "Stato", type: "custom", render:(rowData)=><td>
      Ok a fatturare
      { rowData.Bill && authService.hasPermission("WRITE_SALES_SAL") ? 
      <Button size="small" svgIcon={stampIcon} onClick={() => {
        updateToBilled(rowData.id)
      }}>Conferma Fattura Fattura</Button>
      :null }
      
      </td> },
    { key: "actualDays", label: "Giorni Lavorati", type: "number" },
    { key: "amount", label: "Importo",type: "custom", render:(dataItem)=>{
      return <td>{formatNumber(dataItem.amount)}</td>
    } },
    { key: "notes", label: "Note", type: "text", sortable: true, filter: "text" },
    { key: "month", label: "Mese", type: "custom", sortable: true, filter: "number", render:(row)=>{
      const date = new Date(new Date().getFullYear(), row.month - 1, 1);  
      let monthStr = date.toLocaleString('it-IT', { month: 'long' }).toString();
      monthStr = monthStr.charAt(0).toUpperCase() + monthStr.slice(1).toLowerCase();
    return <td>{monthStr}</td>;
    } },
    { key: "year", label: "Anno", type: "number", sortable: true, filter: "number" }
  ];

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
    setRows(tableResponse.data)
    return {
      data: tableResponse.data,
      meta: { total: tableResponse.meta.total },
    };
  }, [props.project.id,filters]);

  const updateToBilled = (id)=>{
    return new Promise((ok,ko)=>{
      NotificationActions.openConfirm('Sei sicuro di spostare il Sal in stato "FATTURATO" ?',
        () => {
          ok(salService.updateResource(id,{SalState:'BILLED'}))
        },
        'Conferma operazione',
        ko
      )
    })
    
  }


  return (
    <>
    <p>Sal di {props.project.Offer.name}</p>
    
    <GridTable
        writePermissions={["WRITE_SALES_SAL"]}
        filterable={true}
        sortable={true}
        getData={loadData}
        columns={columns}
        resizableWindow={true}
        initialHeightWindow={800}
        draggableWindow={true}
        initialWidthWindow={900}
        resizable={true}
        actions={() => ["show", "edit", "delete"]}
        formCrud={(row: any, type: string, closeModalCallback: any, refreshTable: any) => {
          let otherSal = rows;
          if (rows && row) {
            otherSal = rows.filter(s => s.id != row.id);
          }
          return (
            
              <SalCrud
                otherSal={otherSal}
                project={props.project}
                row={row}
                type={type}
                closeModalCallback={closeModalCallback}
                refreshTable={props.refreshParent}
                onNext={() => updateToBilled(row.id)}
              />
            
          )
        }}
    />
    </>
  );
});


