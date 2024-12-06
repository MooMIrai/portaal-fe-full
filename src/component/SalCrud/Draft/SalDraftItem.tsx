import React, { PropsWithChildren, useCallback, useRef, useState } from "react";
import { salService } from "../../../services/salService";
import GridTable from "common/Table";
import { SalCrud } from "../component";
import Button from 'common/Button';
import NotificationActions from 'common/providers/NotificationProvider';
import {fileAddIcon} from 'common/icons';

export const SalDraftItem = React.memo((props: PropsWithChildren<{ project: any, refreshParent:()=>void }>) => {

  const columns = [
    {
      key: "SalState", label: "Stato", type: "custom", render: (rowData) => <td>
        Sal creato in attesa di ok a fatturare
        <Button size="small" svgIcon={fileAddIcon} onClick={() => {
          updateToBilling(rowData.id).then(props.refreshParent)
        }}>Ok a fatturare</Button>
      </td>
    },
    { key: "actualDays", label: "Giorni Lavorati", type: "number" },
    { key: "amount", label: "Importo", type: "number" },
    { key: "notes", label: "Note", type: "text", sortable: true, filter: "text" },
    {
      key: "month", label: "Mese", type: "custom", sortable: true, filter: "number", render: (row) => {
        const date = new Date(new Date().getFullYear(), row.month - 1, 1);
        let monthStr = date.toLocaleString('it-IT', { month: 'long' }).toString();
        monthStr = monthStr.charAt(0).toUpperCase() + monthStr.slice(1).toLowerCase();
        return <td>{monthStr}</td>;
      }
    },
    { key: "year", label: "Anno", type: "number", sortable: true, filter: "number" }
  ];

  
  const [rows, setRows] = useState<Array<any>>();

  const updateToBilling = (id)=>{
    return new Promise((ok,ko)=>{
      NotificationActions.openConfirm('Sei sicuro di spostare il Sal in stato "A FATTURARE" ?',
        () => {
          ok(salService.updateResource(id,{SalState:'BILLING_OK'}));
        },
        'Conferma operazione',
        ko
      )
    })
    
  }

  const loadData = useCallback(async (pagination: any, filter: any, sorting: any[]) => {
    const include = true;
    const tableResponse = await salService.getSalFromProject(
      props.project.id,
      pagination.currentPage,
      pagination.pageSize,
      filter,
      sorting,
      include,
    );
    setRows(tableResponse.data);
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
        actions={() => ["edit", "delete", "create"]}
        formCrud={(row: any, type: string, closeModalCallback: any, refreshTable: any) => {
          let otherSal = rows;
          if (rows && row) {
            otherSal = rows.filter(s => s.id != row.id);
          }
          return (
            <>
              <SalCrud
                otherSal={otherSal}
                project={props.project}
                row={row}
                type={type}
                closeModalCallback={closeModalCallback}
                refreshTable={props.refreshParent}
                onNext={() => updateToBilling(row.id)}
              />
            </>
          )
        }}
      />
    </>
  );
});


