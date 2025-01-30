import React, { useEffect } from "react";
import { richiestaService } from "../../services/richiestaService";
import GridTable from "common/Table";
import Button from 'common/Button';
import {hyperlinkOpenIcon} from 'common/icons';

export function RequestByCandidate(props:{idCandidate:number,requests:Array<any>}){

    const loadData = (
        pagination: any,
        filter: any,
        sorting: any[],
    ) => {
        /* return richiestaService.getByCandidate(props.idCandidate, pagination.currentPage, pagination.pageSize).then(res => {
            return {
                data: res.candidates,
                meta: { total: res.total }
            }
        }) */
        return richiestaService.search(pagination.currentPage,pagination.pageSize,
            {
                logic: "or",
                filters: props.requests.map(r=>( { field: "id", operator: "eq", value: r.request_id }))
            }
            ,sorting,undefined,true)
    }
//Request.RequestingEmployee.Person
        const columns = [
            
                    //{ key: "date", label: "Data Richiesta", type: "date", sortable: true, filter: "date" },
                    { key: "Customer.name", label: "Cliente", type: "string", sortable: true, filter: "text" },
                    { key: "Location.description", label: "Citta di competenza", type: "string", sortable: true, filter: "text" },
                    { key: "RequestingEmployee.Person.firstName", label: "HR incaricaricata", type: "custom", render:(rowData)=><td>{rowData.RequestingEmployee.Person.firstName} {rowData.RequestingEmployee.Person.lastName}</td> },
                    { key: "CandidateProfile.description", label: "Profilo", type: "string", sortable: true, filter: "text" },
                    { key: "id", label: "Apri dettaglio", type: "custom", sortable: false, render:(rowData)=><td>
                        <Button themeColor="info" fillMode="outline" svgIcon={hyperlinkOpenIcon} onClick={()=>{
                            window.open('/richieste/'+rowData.id+'/'+props.idCandidate ,"Dettaglio richiesta", "width=700,height=500" )
                        }} >Apri dettaglio</Button>
                    </td> }
            ];
    

    return <GridTable
                
                filterable={true}
                sortable={true}
                getData={loadData}
                columns={columns}
                resizableWindow={true}
                initialHeightWindow={800}
                draggableWindow={true}
                initialWidthWindow={900}
                resizable={true}
                actions={() => []}
            />

}