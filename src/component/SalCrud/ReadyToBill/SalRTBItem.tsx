import React, { PropsWithChildren, useCallback, useState } from "react";
import { salService } from "../../../services/salService";
import GridTable from "common/Table";
import { SalCrud } from "../component";
import NotificationActions from 'common/providers/NotificationProvider';
import {stampIcon} from 'common/icons';
import Button from 'common/Button';

export const SalRTBItem = React.memo((props: PropsWithChildren<{ project: any, refreshParent:()=>void }>) => {
  
  const [rows, setRows] = useState<Array<any>>();

  const columns = [
    { key: "SalState", label: "Stato", type: "custom", render:(rowData)=><td>
      Ok a fatturare
      { rowData.Bill ? 
      <Button size="small" svgIcon={stampIcon} onClick={() => {
        updateToBilled(rowData.id)
      }}>Conferma Fattura Fattura</Button>
      :null }
      
      </td> },
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
      meta: { total: tableResponse.meta.model },
    };
  }, [props.project.id]);

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
        filterable={true}
        sortable={true}
        getData={loadData}
        columns={columns}
        resizableWindow={true}
        initialHeightWindow={800}
        draggableWindow={true}
        initialWidthWindow={900}
        resizable={true}
        actions={() => [ "edit", "delete"]}
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


