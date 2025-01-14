import React, { useState } from "react";
import { richiestaService } from "../../services/richiestaService";
import GridTable from "common/Table";
import { RichiesteCrud } from "../../components/RichiesteCrud/component";
import Button from 'common/Button'
import {tellAFriendIcon} from 'common/icons';
import Modal from 'common/Modal'; 
import { CandidateForRequest } from "../../components/CandidateForRequest/component";

export default function RequestPage(){
     const columns = [
    
            //{ key: "date", label: "Data Richiesta", type: "date", sortable: true, filter: "date" },
            { key: "Customer.name", label: "Cliente", type: "string", sortable: true, filter: "text" },
            { key: "Location.description", label: "Citta di competenza", type: "string", sortable: true, filter: "text" },
            { key: "RequestingEmployee.Person.firstName", label: "HR incaricaricata", type: "custom", render:(rowData)=><td>{rowData.RequestingEmployee.Person.firstName} {rowData.RequestingEmployee.Person.lastName}</td> },
            { key: "id", label: "Profilo", type: "custom", sortable: false, filter: false, render:(rowData)=><td>
              <Button size="small" svgIcon={tellAFriendIcon} onClick={() => {
                setCurrentrequestId(rowData.id)
                setModalOpened(true);
                setCurrentrequestSkills(rowData.Skills)
              }}>{rowData.RecruitingAssignment?rowData.RecruitingAssignment.length:0} - Candidati Associati</Button>
            </td>} ,
            { key: "CandidateProfile.description", label: "Profilo", type: "string", sortable: true, filter: "text" }
          ];

    const [modalOpened,setModalOpened] = useState<boolean>(false);
    const [currentrequestId,setCurrentrequestId] = useState<number>();
    const [currentrequestSkills,setCurrentrequestSkills] = useState<Array<any>>();

      const loadData = (
          pagination: any,
          filter: any,
          sorting: any[],
        )=>{
          
          return richiestaService.search(pagination.currentPage,pagination.pageSize,filter,sorting,undefined,true)
      }
    
        return <>
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
          actions={()=>[
            "create",
            "edit",
            "delete",
            
          ]}
      
          formCrud={(row: any, type: string, closeModalCallback: any, refreshTable: any) => (
            <RichiesteCrud row={row}  closeModalCallback={closeModalCallback} refreshTable={refreshTable} type={type} />
          )}
        />
        <Modal title="Cerca candidati per la richiesta "
          width="100%"
          height="100%"
            isOpen={modalOpened}
            onClose={()=>{
              setCurrentrequestId(undefined)
              setModalOpened(false);
              setCurrentrequestSkills(undefined)
            }}>
          {modalOpened && currentrequestId && <CandidateForRequest requestId={currentrequestId} requestSkills={currentrequestSkills} />}
        </Modal>
       </>
}