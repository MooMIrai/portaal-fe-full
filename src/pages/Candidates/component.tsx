import React, { useEffect, useState } from "react";
import GridTable from "common/Table";
import { candidatoService } from "../../services/candidatoService";
import { CandidatiCrud } from "../../components/CandidatiCrud/component";
import Button from 'common/Button'
import Modal from 'common/Modal';
import { TestComponent } from "../../components/TestComponent/component";

export default function CandidatePage() {

  const [showModal,setShowModal] = useState<boolean>(false);

  const columns = [

    { key: "Person.firstName", label: "Nome", type: "string", sortable: true, filter: "text" },
    { key: "Person.lastName", label: "Cognome", type: "string", sortable: true, filter: "text" },
    { key: "CandidateProfile.description", label: "Mansione", type: "string", sortable: true, filter: "text" },
    {
      key: "Person.PersonSkillAreas.SkillArea.name", label: "Skills", type: "custom", sortable: true, filter: "text", width: 250, render: (row) => {

        if (row?.Person?.PersonSkillAreas == null || row.Person.PersonSkillAreas.lenght == 0)
          return <td></td>;

        let skills = row.Person.PersonSkillAreas;
        let skillsDescription = skills.map(skill => skill.SkillArea.name).filter(name => name).join(", ");

        if (skillsDescription.lenght > 50)
        {

        }

        let substring = !skillsDescription || skillsDescription.lenght <= 50 ? skillsDescription : `${skillsDescription.substring(0, 46)} ...`;

        return <td>
                <span
                  title={skillsDescription}
                  style={{ cursor: "pointer" }}
                >
                  {substring}
                </span>
              </td>;
      }
    },
    {
      key: "date_last_revision", label: "Data Ultima Revisione", type: "custom", sortable: true, filter: "date", width: 270, render: (row) => {

        let assignment = getMaxDateLog(row.RecruitingAssignments);

        if(assignment == null)
          return <td></td>;
        
        let date_last_revision = new Date(assignment).toLocaleDateString();

        return <td>{date_last_revision}</td>;
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

  return (
    <>
    <GridTable

      customToolBarComponent={()=>{
        return <Button themeColor={"info"} disabled={false} onClick={()=>{setShowModal(true)}}>Prova Modale</Button>
      }}

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
      title="Titolo"
      isOpen={showModal}
      onClose={()=>setShowModal(false)}
      width="100%"
      height="100%"
    >
      <TestComponent id={1} />
   </Modal>
   </>
  )
}