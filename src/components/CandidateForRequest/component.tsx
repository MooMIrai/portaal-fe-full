import React, { PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";
import { richiestaService } from "../../services/richiestaService";
import GridTable from "common/Table";
import Tab from 'common/Tab';
import { candidatoService } from "../../services/candidatoService";
import {checkCircleIcon ,xCircleIcon, pencilIcon, plusIcon, reportElementIcon ,fileIcon} from 'common/icons';
import SvgIcon from 'common/SvgIcon';
import Accordion from 'common/Accordion';
import { CandidateStepper } from "../CandidateStepper/component";
import Modal from 'common/Modal';
import NotificationActions from 'common/providers/NotificationProvider';
import { CandidateLogs } from "../CandidateLogs/component";
import fileService from 'common/services/FileService';
import Typography from 'common/Typography';
import AvatarIcon from 'common/AvatarIcon';

export function CandidateForRequest(props: PropsWithChildren<{ requestId: number, requestSkills?:any[],preselectedId?:string }>) {

    const [currentPerson,setCurrentPerson] = useState<any>();
    const [currentTimeline,setCurrentTimeline] = useState<any>();
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const [loading,setLoading] = useState<boolean>(false);
    
    const tableAssigned= useRef<any>();
    const tableSystem = useRef<any>();
    const tableManual = useRef<any>();
    const tableSystemDip = useRef<any>();
    const tableManualDip = useRef<any>();

    const columnsAssociated = [

        { key: "id", label: " ", type: "custom",width:'40px', render:(rowData)=> <td style={{cursor:'pointer'}} onClick={()=>setCurrentPerson(rowData)} title="gestisci"><SvgIcon icon={pencilIcon} themeColor="warning" /></td> },
        { key: "id", label: " ", type: "custom",width:'45px', render:(rowData)=> <td style={{cursor:'pointer'}} onClick={()=>setCurrentTimeline(rowData)} title="visualizza log"><SvgIcon icon={reportElementIcon} themeColor="info" /></td> },
        { key: "id", label: "CV", type: "custom", width:45, render:(rowData)=>{
        
            if(rowData.Candidate){
                if(rowData.Candidate.Person.files && rowData.Candidate.Person.files.length){
                    return <td style={{cursor:'pointer'}} title="Vedi il cv" onClick={()=>{
                      fileService.openFromBE(rowData.Candidate.Person.files[0])
                    }} ><SvgIcon  icon={fileIcon} /></td>
                  }
            }else{
                if(rowData.Person?.files && rowData.Person.files.length){
                    return <td style={{cursor:'pointer'}} title="Vedi il cv" onClick={()=>{
                      fileService.openFromBE(rowData.Person.files[0])
                    }} ><SvgIcon  icon={fileIcon} /></td>
                }
            }

              
              return <td></td>
        }},
        { key: "id", label: "Nominativo", type: "custom", render:(rowData)=> {

            const personData = rowData.Candidate?.Person || rowData.Person;
            if(!personData) return <td></td>;

        return <td>
            <div style={{ display: 'flex', justifyContent:'flex-start', gap:15, alignItems:'center', paddingTop:5,paddingBottom:5, textAlign: "start" }}>
                <AvatarIcon name={personData.firstName + ' ' + personData.lastName} initials={
                    personData.firstName[0].toUpperCase()
                    +personData.lastName[0].toUpperCase()
                    } />
                    <div style={{display:'flex',flexDirection:'column', gap:0}}>
                        <Typography.h6>{personData.firstName} {personData.lastName}</Typography.h6>
                        <Typography.p>{personData.privateEmail}</Typography.p>
                    </div>
            </div>
        </td>}},
        { key: "RecruitingContact", label: "Contattato", type: "custom", render:(rowData)=><td>{rowData.RecruitingContact?.length > 0 ? <SvgIcon icon={checkCircleIcon} themeColor="success" />:<SvgIcon icon={xCircleIcon} themeColor="error" />}</td>},
        { key: "RecruitingInterview", label: "Colloquiato", type: "custom", render:(rowData)=><td>{rowData.RecruitingInterview?.length > 0 ? <SvgIcon icon={checkCircleIcon} themeColor="success" />:<SvgIcon icon={xCircleIcon} themeColor="error" />}</td>},
        { key: "RecruitingFinalEvaluation", label: "Valutazione finale", type: "custom", render:(rowData)=><td>{rowData.RecruitingFinalEvaluation?<SvgIcon icon={checkCircleIcon} themeColor="success" />:<SvgIcon icon={xCircleIcon} themeColor="error" />}</td>},
        { key: "RecruitingOffer", label: "Proposta economica", type: "custom", render:(rowData)=><td>{rowData.RecruitingOffer?<SvgIcon icon={checkCircleIcon} themeColor="success" />:<SvgIcon icon={xCircleIcon} themeColor="error" />}</td>},
        { key: "RecruitingSendCv", label: "Invio CV", type: "custom", render:(rowData)=><td>{rowData.RecruitingSendCv?<SvgIcon icon={checkCircleIcon} themeColor="success" />:<SvgIcon icon={xCircleIcon} themeColor="error" />}</td>},
        { key: "RecruitingSendContract", label: "Contratto", type: "custom", render:(rowData)=><td>{rowData.RecruitingSendContract?<SvgIcon icon={checkCircleIcon} themeColor="success" />:<SvgIcon icon={xCircleIcon} themeColor="error" />}</td>},
        { key: "RecruitingCreateAccount", label: "Account", type: "custom", render: (rowData) => {
            const personData = rowData.Candidate?.Person || rowData.Person;
            return (
                <td>
                    {personData.Accounts?.[0] 
                    ? <SvgIcon icon={checkCircleIcon} themeColor="success" />
                    :<SvgIcon icon={xCircleIcon} themeColor="error" />}
                </td>
            );
        }}
        /*{ key: "Location.description", label: "Citta di competenza", type: "string", sortable: true, filter: "text" },
        { key: "RequestingEmployee.Person.firstName", label: "HR incaricaricata", type: "custom", render:(rowData)=><td>{rowData.RequestingEmployee.Person.firstName} {rowData.RequestingEmployee.Person.lastName}</td> },
        
        { key: "CandidateProfile.description", label: "Profilo", type: "string", sortable: true, filter: "text" }*/
    ];

    const columns = [

        { key: "id", label: " ", type: "custom",width:'40px', render:(rowData)=> <td style={{cursor:'pointer'}} onClick={()=>handleAssociate(rowData.Candidate)}><SvgIcon icon={plusIcon} themeColor="success" /></td> },
        { key: "id", label: "CV", type: "custom", width:45, render:(rowData)=>{
        
            if(rowData.Candidate.Person.files && rowData.Candidate.Person.files.length){
              return <td style={{cursor:'pointer'}} title="Vedi il cv" onClick={()=>{
                fileService.openFromBE(rowData.Candidate.Person.files[0])
              }} ><SvgIcon  icon={fileIcon} /></td>
            }
            return <td></td>
        }},
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

    const columnsDip = [

        { key: "id", label: " ", type: "custom",width:'40px', render:(rowData)=> <td style={{cursor:'pointer'}} onClick={()=>handleAssociateDip(rowData.Employee)}><SvgIcon icon={plusIcon} themeColor="success" /></td> },
        { key: "id", label: "CV", type: "custom", width:45, render:(rowData)=>{
        
            if(rowData.files && rowData.files.length){
              return <td style={{cursor:'pointer'}} title="Vedi il cv" onClick={()=>{
                fileService.openFromBE(rowData.Employee.files[0])
              }} ><SvgIcon  icon={fileIcon} /></td>
            }
            return <td></td>
        }},
        { key: "Employee.firstName", label: "Nome", type: "string", sortable: false },
        { key: "Employee.lastName", label: "Cognome", type: "string", sortable: false },
        //{ key: "Candidate.CandidateProfile.description", label: "Mansione", type: "string", sortable: false },
        {
            key: "Employee.PersonSkillAreas.SkillArea.name", label: "Skills", type: "custom", sortable: false,  width: 250, render: (row) => {

                if (row?.Employee.PersonSkillAreas == null || !row.Employee.PersonSkillAreas.length)
                    return <td></td>;

                let skills = row.Employee.PersonSkillAreas;
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
        { key: "id", label: " ", type: "custom",width:'40px', render:(rowData)=> {
            if(tableAssigned.current?.grid._data?.some(d=>d.dataItem.candidate_id === rowData.id)){
                return <td></td>
            }
            return <td style={{cursor:'pointer'}} onClick={()=>handleAssociate(rowData)}><SvgIcon icon={plusIcon} themeColor="success" /></td>
        } },
        { key: "id", label: "CV", type: "custom", width:45, render:(rowData)=>{
        
            if(rowData.Person?.files && rowData.Person.files.length){
              return <td style={{cursor:'pointer'}} title="Vedi il cv" onClick={()=>{
                fileService.openFromBE(rowData.Person.files[0])
              }} ><SvgIcon  icon={fileIcon} /></td>
            }
            return <td></td>
        }},
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

    const columnsManualDip = [
        { key: "id", label: " ", type: "custom",width:'40px', render:(rowData)=> {
            if(tableAssigned.current?.grid._data?.some(d=>d.dataItem.person_id === rowData.id)){
                return <td></td>
            }
            return <td style={{cursor:'pointer'}} onClick={()=>handleAssociateDip(rowData)}><SvgIcon icon={plusIcon} themeColor="success" /></td>
        } },
        { key: "id", label: "CV", type: "custom", width:45, render:(rowData)=>{
        
            if(rowData.files && rowData.files.length){
              return <td style={{cursor:'pointer'}} title="Vedi il cv" onClick={()=>{
                fileService.openFromBE(rowData.files[0])
              }} ><SvgIcon  icon={fileIcon} /></td>
            }
            return <td></td>
        }},
        { key: "firstName", label: "Nome", type: "string", sortable: true, filter: "text" },
        { key: "lastName", label: "Cognome", type: "string", sortable: true, filter: "text" },
        { key: "CandidateProfile.description", label: "Mansione", type: "string", sortable: true, filter: "text" },
        {
            key: "PersonSkillAreas.SkillArea.name", label: "Skills", type: "custom", sortable: false, filter: "text", width: 250, render: (row) => {

                if (row?.PersonSkillAreas == null || row.PersonSkillAreas.lenght == 0)
                    return <td></td>;

                let skills = row.PersonSkillAreas;
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

    const loadDataManualDip = (
        pagination: any,
        filter: any,
        sorting: any[],
    ) => {
        filter.filters.push({
            "field": "isExternal",
            "value": false,
            "operator": "eq"
        });

        return candidatoService.searchDip(pagination.currentPage, pagination.pageSize, filter, sorting, undefined, true)
    }


    const handleSelect = (e: any) => {
        setSelectedTab(e.selected);
    };


    const handleAssociate = (candidate:any)=>{
        NotificationActions.openConfirm('Sei sicuro di associare "'+
             candidate.Person.firstName + ' '+ candidate.Person.lastName + '" alla richiesta?',
            () => {
                setLoading(true)
                richiestaService.associateCandidate(candidate.id,props.requestId).then(res=>{
                    NotificationActions.openModal(
                        { icon: true, style: "success" },
                        "Operazione avvenuta con successo "
                      );
                    if(tableAssigned.current){
                        tableAssigned.current.refreshTable();
                    }
                    /*if(tableManual.current){
                        tableManual.current.refreshTable();
                    }
                    if(tableSystem.current){
                        tableSystem.current.refreshTable();
                    }*/
                }).finally(()=>setLoading(false))
            },
            'Conferma azione'
        )
    }

    const handleAssociateDip = (person:any)=>{
        NotificationActions.openConfirm('Sei sicuro di associare "'+
             person.firstName + ' '+person.lastName + '" alla richiesta?',
            () => {
                setLoading(true)
                richiestaService.associatePerson(person.id,props.requestId).then(res=>{
                    NotificationActions.openModal(
                        { icon: true, style: "success" },
                        "Operazione avvenuta con successo "
                      );
                    if(tableAssigned.current){
                        tableAssigned.current.refreshTable();
                    }
                    /*if(tableManual.current){
                        tableManual.current.refreshTable();
                    }
                    if(tableSystem.current){
                        tableSystem.current.refreshTable();
                    }*/
                }).finally(()=>setLoading(false))
            },
            'Conferma azione'
        )
    }

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

    const loadDataDip = (
        pagination: any,
        filter: any,
        sorting: any[],
    ) => {
        return richiestaService.getPossibleCandidatesDip(props.requestId, pagination.currentPage, pagination.pageSize).then(res => {
            return {
                data: res.employee,
                meta: { total: res.total }
            }
        })
    }

    const loadDataAssociated = (
        pagination: any,
        filter: any
    ) => {

        return richiestaService.getDetails(props.requestId, pagination.currentPage, pagination.pageSize, filter).then(res => {
            
            const dataR = res.data.filter(p=>{
                return !props.preselectedId || (p.Candidate && p.Candidate.id===parseInt(props.preselectedId));
            });
            
            return {
                data:dataR,
                meta: { total: res.meta.total }
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
        className={"text-align-center"}
        resizableWindow={true}
        initialHeightWindow={800}
        draggableWindow={true}
        initialWidthWindow={900}
        resizable={true}
        addedFilters={[
            {
                name: "Person.firstName",
                label: "Nome",
                type: "text"
            },
            {
                name: "Person.lastName",
                label: "Cognome",
                type: "text"
            }
        ]}
        actions={() => [


        ]}


    />
    {!props.preselectedId && <div style={{marginTop:20}}>
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
        { !loading && <Tab
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
        />}
        </Accordion>
        <Accordion title="Aggiungi dipendente" defaultOpened={false}>
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
        { !loading && <Tab
            renderAllContent={false}
            tabs={
                [
                    {
                        title: "Scelti dal sistema",
                        children: (
                            <GridTable
                                ref={tableSystemDip}
                                filterable={true}
                                sortable={true}
                                getData={loadDataDip}
                                columns={columnsDip}
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
                            ref={tableManualDip}
                            filterable={true}
                            sortable={true}
                            getData={loadDataManualDip}
                            columns={columnsManualDip}
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
        />}
        </Accordion>
    </div>}
    <Modal title="Gestisci il candidato"
        width="70%"
        height="90%"
        isOpen={currentPerson}
        onClose={()=>{
           
            setCurrentPerson(undefined);
            tableAssigned.current.refreshTable();
            
        }}>
        {currentPerson && <CandidateStepper data={currentPerson}/>}
    </Modal>
    <Modal title="Vedi storico"
        width="70%"
        height="90%"
        isOpen={currentTimeline}
        onClose={()=>{
           
            setCurrentTimeline(undefined);
            
            
        }}>
        {currentTimeline && <CandidateLogs data={currentTimeline} />}
    </Modal>
</>


}