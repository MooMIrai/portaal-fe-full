import React, { PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";
import { richiestaService } from "../../services/richiestaService";
import GridTable from "common/Table";
import Tab from 'common/Tab';
import { candidatoService } from "../../services/candidatoService";
import {checkCircleIcon ,xCircleIcon, pencilIcon, plusIcon} from 'common/icons';
import SvgIcon from 'common/SvgIcon';
import Accordion from 'common/Accordion';

export function CandidateForRequest(props: PropsWithChildren<{ requestId: number, requestSkills?:any[] }>) {

    const [selectedTab, setSelectedTab] = useState<number>(0);
    
    const tableAssigned= useRef<any>();
    const tableSystem = useRef<any>();
    const tableManual = useRef<any>();

    const columnsAssociated = [

        { key: "id", label: " ", type: "custom",width:'40px', render:(rowData)=> <td style={{cursor:'pointer'}} onClick={()=>alert('ciao')}><SvgIcon icon={pencilIcon} themeColor="warning" /></td> },
        { key: "id", label: "Nominativo", type: "custom", render:(rowData)=><td>{rowData.Candidate.Person.firstName} {rowData.Candidate.Person.lastName}</td>},
        { key: "RecruitingContact", label: "Contattato", type: "custom", render:(rowData)=><td>{rowData.RecruitingContact?<SvgIcon icon={checkCircleIcon} themeColor="success" />:<SvgIcon icon={xCircleIcon} themeColor="error" />}</td>},
        { key: "RecruitingInterview", label: "Colloquiato", type: "custom", render:(rowData)=><td>{rowData.RecruitingInterview?<SvgIcon icon={checkCircleIcon} themeColor="success" />:<SvgIcon icon={xCircleIcon} themeColor="error" />}</td>},
        { key: "RecruitingOffer", label: "Proposta economica", type: "custom", render:(rowData)=><td>{rowData.RecruitingOffer?<SvgIcon icon={checkCircleIcon} themeColor="success" />:<SvgIcon icon={xCircleIcon} themeColor="error" />}</td>},
        { key: "RecruitingFinalEvaluation", label: "Valutazione finale", type: "custom", render:(rowData)=><td>{rowData.RecruitingFinalEvaluation?<SvgIcon icon={checkCircleIcon} themeColor="success" />:<SvgIcon icon={xCircleIcon} themeColor="error" />}</td>},
        { key: "RecruitingSendCv", label: "Invio CV", type: "custom", render:(rowData)=><td>{rowData.RecruitingSendCv?<SvgIcon icon={checkCircleIcon} themeColor="success" />:<SvgIcon icon={xCircleIcon} themeColor="error" />}</td>},
        { key: "RecruitingSendContract", label: "Contratto", type: "custom", render:(rowData)=><td>{rowData.RecruitingSendContract?<SvgIcon icon={checkCircleIcon} themeColor="success" />:<SvgIcon icon={xCircleIcon} themeColor="error" />}</td>}
        /*{ key: "Location.description", label: "Citta di competenza", type: "string", sortable: true, filter: "text" },
        { key: "RequestingEmployee.Person.firstName", label: "HR incaricaricata", type: "custom", render:(rowData)=><td>{rowData.RequestingEmployee.Person.firstName} {rowData.RequestingEmployee.Person.lastName}</td> },
        
        { key: "CandidateProfile.description", label: "Profilo", type: "string", sortable: true, filter: "text" }*/
    ];

    const columns = [

        { key: "id", label: " ", type: "custom",width:'40px', render:(rowData)=> <td style={{cursor:'pointer'}} onClick={()=>alert('ciao')}><SvgIcon icon={plusIcon} themeColor="success" /></td> },
        { key: "Candidate.Person.firstName", label: "Nome", type: "string", sortable: false },
        { key: "Candidate.Person.lastName", label: "Cognome", type: "string", sortable: false },
        { key: "Candidate.CandidateProfile.description", label: "Mansione", type: "string", sortable: false },
        {
            key: "Candidate.Person.PersonSkillAreas.SkillArea.name", label: "Skills", type: "custom", sortable: false,  width: 250, render: (row) => {

                if (row?.Candidate?.Person?.PersonSkillAreas == null || !row.Candidate.Person.PersonSkillAreas.length)
                    return <td></td>;

                let skills = row.Candidate.Person.PersonSkillAreas;
                let skillsDescription = skills.map(skill => skill.SkillArea.name).filter(name => name).join(", ");

                return <td>
                    <span
                        title={skillsDescription}
                        style={{ cursor: "pointer", display:'flex', flexWrap:'wrap', gap:'5px' }}>
                         {skills.map((skill) =>{
                            let type:string='NONE';
                            if(row.Details.primarySkillIds.some(psi=>psi===skill.skillArea_id)){
                                type='PRIMARY'
                            }else if(row.Details.secondarySkillIds.some(psi=>psi===skill.skillArea_id)){
                                type='SECONDARY'
                            }else if(row.Details.languageSkillIds.some(psi=>psi===skill.skillArea_id)){
                                type ='LANGUAGE'
                            }
                            return <span style={{
                                
                                padding:'5px 10px',
                                border:'1px solid #dedede',
                                background:type==='PRIMARY'?'rgba(0,255,0,0.5)':type==='SECONDARY'?'rgba(255, 208, 0, 0.57)':type==='LANGUAGE'?'rgba(70, 69, 69, 0.51)':'transparent'
                            }}>{skill.SkillArea.name}</span>
                         }) }      
                        
                    </span>
                </td>;
            }
        }
        /*{ key: "Location.description", label: "Citta di competenza", type: "string", sortable: true, filter: "text" },
        { key: "RequestingEmployee.Person.firstName", label: "HR incaricaricata", type: "custom", render:(rowData)=><td>{rowData.RequestingEmployee.Person.firstName} {rowData.RequestingEmployee.Person.lastName}</td> },
        
        { key: "CandidateProfile.description", label: "Profilo", type: "string", sortable: true, filter: "text" }*/
    ];


    const columnsManual = [
        { key: "id", label: " ", type: "custom",width:'40px', render:(rowData)=> <td style={{cursor:'pointer'}} onClick={()=>alert('ciao')}><SvgIcon icon={plusIcon} themeColor="success" /></td> },
        { key: "Person.firstName", label: "Nome", type: "string", sortable: true, filter: "text" },
        { key: "Person.lastName", label: "Cognome", type: "string", sortable: true, filter: "text" },
        { key: "CandidateProfile.description", label: "Mansione", type: "string", sortable: true, filter: "text" },
        {
            key: "Person.PersonSkillAreas.SkillArea.name", label: "Skills", type: "custom", sortable: false, filter: "text", width: 250, render: (row) => {

                if (row?.Person?.PersonSkillAreas == null || row.Person.PersonSkillAreas.lenght == 0)
                    return <td></td>;

                let skills = row.Person.PersonSkillAreas;
                let skillsDescription = skills.map(skill => skill.SkillArea.name).filter(name => name).join(", ");
                
                
                
                return <td>
                <span
                    title={skillsDescription}
                    style={{ cursor: "pointer", display:'flex', flexWrap:'wrap', gap:'5px' }}>
                     {skills.map((skill) =>{
                        let type:string='NONE';
                        
                        if(props.requestSkills){
                            const skillFound =  props.requestSkills.find(rs=>rs.skillArea_id===skill.skillArea_id)
                            if(skillFound)
                                type = skillFound.type;
                        }
                       
                        return <span style={{
                            background:type==='PRIMARY'?'rgba(0,255,0,0.5)':type==='SECONDARY'?'rgba(255, 208, 0, 0.57)':type==='LANGUAGE'?'rgba(70, 69, 69, 0.51)':'transparent',
                            padding:'5px 10px',
                            border:'1px solid #dedede'
                        }}>{skill.SkillArea.name}</span>
                     }) }      
                    
                </span>
            </td>;
            }
        },

    ];

    const loadDataManual = (
        pagination: any,
        filter: any,
        sorting: any[],
    ) => {

        return candidatoService.search(pagination.currentPage, pagination.pageSize, filter, sorting, undefined, true)
    }


    const handleSelect = (e: any) => {
        setSelectedTab(e.selected);
    };

    const loadData = (
        pagination: any,
        filter: any,
        sorting: any[],
    ) => {
        return richiestaService.getPossibleCandidates(props.requestId, pagination.currentPage, pagination.pageSize).then(res => {
            return {
                data: res.candidates,
                meta: { total: res.total }
            }
        })
    }

    const loadDataAssociated = (
        
    ) => {
        return richiestaService.getDetails(props.requestId).then(res => {
            return {
                data: res[0].RecruitingAssignment,
                meta: { total: res[0].RecruitingAssignment.length }
            }
        })
    }

    return <>

    <span>
        Candidati Associati alla richiesta
    </span>
    <GridTable
        ref={tableAssigned}
        filterable={true}
        sortable={true}
        getData={loadDataAssociated}
        columns={columnsAssociated}
        resizableWindow={true}
        initialHeightWindow={800}
        draggableWindow={true}
        initialWidthWindow={900}
        resizable={true}
        actions={() => [


        ]}


    />
    <div style={{marginTop:20}}>
        <Accordion title="Aggiungi candidato" defaultOpened={false}>
        {
            props.requestSkills && 
                <span
                
                style={{ cursor: "pointer", display:'flex', flexWrap:'wrap', gap:'5px', alignItems:'center', marginBottom:15 }}>
                    <span> Skill richieste: </span>
                {props.requestSkills?.map((skill) =>{
                    let type:string=skill.type;
                    
                    return <span style={{
                        
                        padding:'5px 10px',
                        border:'1px solid #dedede',
                        background:type==='PRIMARY'?'rgba(0,255,0,0.5)':type==='SECONDARY'?'rgba(255, 208, 0, 0.57)':type==='LANGUAGE'?'rgba(70, 69, 69, 0.51)':'transparent'
                    }}>{skill.SkillArea.name}</span>
                }) }      
                
            </span>
            
        }
        <Tab
            renderAllContent={false}
            tabs={
                [
                    {
                        title: "Scelti dal sistema",
                        children: (
                            <GridTable
                            ref={tableSystem}
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


                                ]}


                            />
                        ),
                    },
                    {
                        title: "Ricerca Manuale",
                        children: (
                            <GridTable
                            ref={tableManual}
                            filterable={true}
                            sortable={true}
                            getData={loadDataManual}
                            columns={columnsManual}
                            resizableWindow={true}
                            initialHeightWindow={800}
                            draggableWindow={true}
                            initialWidthWindow={900}
                            resizable={true}
                            actions={() => [


                            ]}


                        />
                )
                    }
                ]
            }
            onSelect={handleSelect}
            selected={selectedTab}
        //button={{ label: props.type === 'view' ? "Esci" : "Salva", onClick: handleSubmit }}
        />
        </Accordion>
    </div>
</>


}