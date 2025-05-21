import React, { useEffect, useState } from "react";
import { richiestaService } from "../../services/richiestaService";
import GridTable from "common/Table";
import { RichiesteCrud } from "../../components/RichiesteCrud/component";
import Button from 'common/Button'
import {myspaceIcon} from 'common/icons';
import Modal from 'common/Modal'; 
import { CandidateForRequest } from "../../components/CandidateForRequest/component";
import { useParams } from "react-router-dom";

export default function RequestPage(){

    const {id,candidateId} = useParams();

     const columns = [
    
            //{ key: "date", label: "Data Richiesta", type: "date", sortable: true, filter: "date" },
            { key: "Customer.name", label: "Cliente", type: "string", sortable: true, filter: "text" },
            { key: "Location.description", label: "Citta di competenza", type: "string", sortable: true, filter: "text" },
            { key: "RequestingEmployee.Person.firstName", label: "HR incaricata", type: "custom", render:(rowData)=><td>{rowData.RequestingEmployee.Person.firstName} {rowData.RequestingEmployee.Person.lastName}</td> },
            { key: "id", label: "Profilo", type: "custom", sortable: false, filter: false, render:(rowData)=><td>
              <Button size="small" svgIcon={myspaceIcon} onClick={() => {
                setCurrentrequest(rowData)
                setModalOpened(true);
                setCurrentrequestSkills(rowData.Skills)
              }}>{rowData.RecruitingAssignment?rowData.RecruitingAssignment.length:0} - Candidati Associati</Button>
            </td>} ,
            { key: "date_created", label: "Data Richiesta", type: "date", sortable: true, filter: "text" },
            {
                key: "SkillArea.name", label: "Skills", type: "custom", sortable: false, filter: "text", width: 250, render: (row) => {
          
                  if (row?.Skills == null || row.Skills.length == 0)
                    return <td></td>;
          
                  let skills = row.Skills;
                  let skillsDescription = skills.map(skill => skill.SkillArea.name).filter(name => name).join(", ");
          
                  return <td>
                    <span
                      title={skillsDescription}
                      style={{ cursor: "pointer" }}>
          
                      {skillsDescription}
                    </span>
                  </td>;
                }
              },
            { key: "CandidateProfile.description", label: "Profilo", type: "string", sortable: true, filter: "text" }
    ];

    const [modalOpened,setModalOpened] = useState<boolean>(false);
    const [currentrequest,setCurrentrequest] = useState<any>();
    const [currentrequestSkills,setCurrentrequestSkills] = useState<Array<any>>();

    useEffect(()=>{
      if(id){
        richiestaService.fetchResource(id).then(data=>{
          setCurrentrequest(data)
          setModalOpened(true);
          setCurrentrequestSkills(data.Skills)
        })
      }
    },[id])


      const loadData = (
          pagination: any,
          filter: any,
          sorting: any[],
        )=>{
          
          return richiestaService.search(pagination.currentPage,pagination.pageSize,filter,sorting,undefined,true)
      }
    
        return <>
          {!id && <GridTable
            writePermissions={["WRITE_RECRUITING_REQUEST"]}
            pageable={true}
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
            addedFilters={[
              {
                name: "requestingEmployee_id",
                label: "HR incaricata",
                type: "filter-autocomplete",
                options:{
                  getData:(search: string)=> richiestaService.getCurrentHR(search).then(res=> res?.map(r => ({id: r.account_id, name: `${r.firstName} ${r.lastName} (${r.email})`}))),
                  getValue:(v:any)=>v?.id
                }
              }
            ]}
        
            formCrud={(row: any, type: string, closeModalCallback: any, refreshTable: any) => (
              <RichiesteCrud row={row}  closeModalCallback={closeModalCallback} refreshTable={refreshTable} type={type} />
            )}
          />
        }
        <Modal title={"Cerca candidati per la richiesta "+ (currentrequest?'id:'+ (currentrequest.id_code || " -, ") + 'ref: '+ currentrequest.ref_code:'')}
          width="100%"
          height="100%"
            isOpen={modalOpened}
            onClose={()=>{
              if(id || candidateId){
                window.close();
              }else{
                setCurrentrequest(undefined)
                setModalOpened(false);
                setCurrentrequestSkills(undefined)
              }
            }}>
          {modalOpened && currentrequest && <CandidateForRequest requestId={currentrequest.id} requestSkills={currentrequestSkills} preselectedId={candidateId} />}
        </Modal>
       </>
}