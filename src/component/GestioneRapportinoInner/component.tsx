import React from "react"
import GridTable from "common/Table";
import { TimesheetsService } from "../../services/rapportinoService";

export function GestioneRapportinoInner(props:{id:number}){

    const columns = [
        { key: "customer", label: "Cliente", type: "string" },
        { key: "activity", label: "Attività", type: "string" },
        { key: "hours", label: "Ore lavorate", type: "number" },
        { key: "hours", label: "Giorni lavorati", type: "custom" , render:(rowData)=>{
            return <td>{(rowData.hours/8).toFixed(2)}</td>
        } },
      ];

    const loadData = async () => {

            
            const tableResponse = await TimesheetsService.getDettaglioGestioneRapportino(
              props.id
            );
        
            return {
              data: tableResponse,
              meta:{total:tableResponse.length}
              
            }
        
    };

    return <div>
            
            <GridTable
            //writePermissions={["WRITE_TIMESHEET_MANAGER"]}
            filterable={false}
            pageable={false}
            sortable={false}
            getData={loadData}
            columns={columns}
            resizableWindow={true}
            initialHeightWindow={800}
            draggableWindow={true}
            initialWidthWindow={900}
            resizable={true}
            actions={() => [
              
            ]}
            formCrud={(row: any, type: string, closeModalCallback: any, refreshTable: any) => (
              <>
                
              </>
            )}
          />
          </div>

}