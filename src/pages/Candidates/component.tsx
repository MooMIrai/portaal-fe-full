import React, { useEffect, useState } from "react";
import GridTable from "common/Table";
import { candidatoService } from "../../services/candidatoService";
import { CandidatiCrud } from "../../components/CandidatiCrud/component";
import Modal from 'common/Modal';
import SvgIcon from 'common/SvgIcon';
import {fileIcon, myspaceIcon} from 'common/icons';
import fileService from 'common/services/FileService'
import Button from 'common/Button';
import { RequestByCandidate } from "../../components/RequestByCandidate/component";

export default function CandidatePage() {

  const [showModal, setShowModal] = useState<boolean>(false);
  const [recruitingAssignments,setRecruitingAssignments] = useState<any[] | undefined>();
  const [candidateSelected,setCandidateSelected] = useState<any>();

  const columns = [
    { key: "Person.files", label: "CV", type: "custom", width:50, render:(rowData)=>{

      if(rowData.Person?.files && rowData.Person.files.length){
        return <td style={{cursor:'pointer'}} title="Vedi il cv" onClick={()=>{
          fileService.openFromBE(rowData.Person.files[0])
        }} ><SvgIcon  icon={fileIcon} /></td>
      }
      return <td></td>
    }},
    { key: "id", label: "Richieste", type: "custom", sortable: false, filter: false, render:(rowData)=><td>
                  <Button size="small" svgIcon={myspaceIcon}
                  disabled = {!rowData.RecruitingAssignments || !rowData.RecruitingAssignments.length}
                   onClick={() => {
                      setRecruitingAssignments(rowData.RecruitingAssignments);
                      setShowModal(true);
                      setCandidateSelected(rowData)
                  }}>{rowData.RecruitingAssignments?rowData.RecruitingAssignments.length:0} - Richieste Associate</Button>
                </td>} ,
    { key: "Person.firstName", label: "Nome", type: "string", sortable: true, filter: "text" },
    { key: "Person.lastName", label: "Cognome", type: "string", sortable: true, filter: "text" },
    
    { key: "CandidateProfile.description", label: "Mansione", type: "string", sortable: true, filter: "text" },
    {
      key: "Person.PersonSkillAreas.SkillArea.name", label: "Skills", type: "custom", sortable: false, filter: "text", width: 250, render: (row) => {

        if (row?.Person?.PersonSkillAreas == null || row.Person.PersonSkillAreas.length == 0)
          return <td></td>;

        let skills = row.Person.PersonSkillAreas;
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
  //  { key: "last_update_assignment", label: "Data Ultima Azione", type: "date", sortable: true, filter: "date", width: 270 },
  {
    key: "last_update_assignment", label: "Data Ultima Azione", type: "custom", sortable: true, filter: "date", width: 270, render: (row) => {

      if (row.last_update_assignment == null || row.last_update_assignment == undefined)
        return <td></td>;

      let date_action = new Date(row.last_update_assignment).toLocaleDateString();

      return <td>{date_action}</td>;
    }
  },
  ];

  const loadData = (
    pagination: any,
    filter: any,
    sorting: any[],
  ) => {

    return candidatoService.search(pagination.currentPage, pagination.pageSize, filter, sorting, undefined, true)
  }

  // REMOVE ???
  const getMaxDateLog = (assignment: any): Date | null => {

    let maxDate: Date | null = null;

    const updateMaxDate = (date?: Date) => {
      if (date && (!maxDate || date > maxDate)) {
        maxDate = date;
      }
    };

    assignment.forEach(item => {
      updateMaxDate(item?.RecruitingContact?.date_log);

      if (item?.RecruitingInterview) {
        item.RecruitingInterview?.forEach(interview => {
          updateMaxDate(interview.date_log);
        });
      }

      updateMaxDate(item?.RecruitingSendContract?.date_log);
      updateMaxDate(item?.RecruitingOffer?.date_log);
      updateMaxDate(item?.RecruitingSendCv?.date_log);
      updateMaxDate(item?.RecruitingFinalEvaluation?.date_log);
    });

    return maxDate;
  }

  let title = "";
  if(candidateSelected && candidateSelected.Person){
    title="Dettaglio richieste di "+ candidateSelected.Person.firstName + ' '+ candidateSelected.Person.lastName;
  }

  return (
    <>
      <GridTable
        writePermissions={["WRITE_RECRUITING_CANDIDATE"]}
        /*customToolBarComponent={() => {
          return <Button themeColor={"info"} disabled={false} onClick={() => { setShowModal(true) }}>Prova Modale</Button>
        }}*/
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
        actions={() => [
          "create",
          "edit",
          "delete",

        ]}

        formCrud={(row: any, type: string, closeModalCallback: any, refreshTable: any) => (
          <CandidatiCrud refreshTable={refreshTable} type={type} row={row} closeModalCallback={closeModalCallback} />
        )}
      />
      
      <Modal
        title={title}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        width="100%"
        height="100%"
      >
        {recruitingAssignments && candidateSelected && <RequestByCandidate idCandidate={candidateSelected.id} requests={recruitingAssignments} />}
      </Modal>
    </>
  )
}