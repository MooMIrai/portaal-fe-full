import React from "react";
import { richiestaService } from "../../services/richiestaService";
import GridTable from "common/Table";
import { RichiesteCrud } from "../../components/RichiesteCrud/component";

/*
[
  {
    "name": "requestingEmployee_id",
    "type": "number",
    "enum": null,
    "required": true,
    "isArray": false
  },
  {
    "name": "RequestState",
    "type": "enum",
    "enum": [
      "A",
      "S",
      "C",
      "E"
    ],
    "required": true,
    "isArray": false
  },
  {
    "name": "Priority",
    "type": "enum",
    "enum": [
      "L",
      "M",
      "H",
      "U"
    ],
    "required": false,
    "isArray": false
  },
  {
    "name": "customer_id",
    "type": "number",
    "enum": null,
    "required": true,
    "isArray": false
  },
  {
    "name": "ref_code",
    "type": "string",
    "enum": null,
    "required": false,
    "isArray": false
  },
  {
    "name": "location_id",
    "type": "number",
    "enum": null,
    "required": true,
    "isArray": false
  },
  {
    "name": "id_code",
    "type": "string",
    "enum": null,
    "required": false,
    "isArray": false
  },
  {
    "name": "WorkModel",
    "type": "enum",
    "enum": [
      "R",
      "S",
      "H"
    ],
    "required": true,
    "isArray": false
  },
  {
    "name": "candidateProfile_id",
    "type": "number",
    "enum": null,
    "required": true,
    "isArray": false
  },
  {
    "name": "profileType",
    "type": "string",
    "enum": null,
    "required": false,
    "isArray": false
  },
  {
    "name": "Seniority",
    "type": "enum",
    "enum": [
      "J",
      "J_A",
      "M",
      "M_A",
      "S",
      "S_A"
    ],
    "required": false,
    "isArray": false
  },
  {
    "name": "Skills",
    "type": "nestedObject",
    "required": true,
    "nested": [
      {
        "name": "skillArea_id",
        "type": "number",
        "enum": null,
        "required": true,
        "isArray": false
      },
      {
        "name": "type",
        "type": "enum",
        "enum": [
          "PRIMARY",
          "SECONDARY",
          "LANGUAGE"
        ],
        "required": true,
        "isArray": false
      }
    ],
    "isArray": true
  },
  {
    "name": "notes",
    "type": "string",
    "enum": null,
    "required": false,
    "isArray": false
  },
  {
    "name": "saleRate",
    "type": "number",
    "enum": null,
    "required": true,
    "isArray": false
  },
  {
    "name": "continuative",
    "type": "boolean",
    "enum": null,
    "required": true,
    "isArray": false
  }
]
*/
export default function RequestPage(){
     const columns = [
    
            //{ key: "date", label: "Data Richiesta", type: "date", sortable: true, filter: "date" },
            { key: "Customer.name", label: "Cliente", type: "string", sortable: true, filter: "text" },
            { key: "Location.description", label: "Citta di competenza", type: "string", sortable: true, filter: "text" },
            { key: "RequestingEmployee.Person.firstName", label: "HR incaricaricata", type: "custom", render:(rowData)=><td>{rowData.RequestingEmployee.Person.firstName} {rowData.RequestingEmployee.Person.lastName}</td> },
            { key: "CandidateProfile.description", label: "Profilo", type: "string", sortable: true, filter: "text" }
          ];
          
        const loadData = (
            pagination: any,
            filter: any,
            sorting: any[],
          )=>{
            
           return richiestaService.search(pagination.currentPage,pagination.pageSize,filter,sorting,undefined,true)
        }
    
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
         actions={()=>[
           "create",
           "edit",
           "delete",
           
         ]}
     
         formCrud={(row: any, type: string, closeModalCallback: any, refreshTable: any) => (
           <RichiesteCrud row={row}  closeModalCallback={closeModalCallback} refreshTable={refreshTable} type={type} />
         )}
       />
}