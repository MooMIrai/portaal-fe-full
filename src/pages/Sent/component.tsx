import React, { useCallback, useEffect, useRef, useState } from "react";
//@ts-ignore
import styles from './style.module.scss';
import Typography from 'common/Typography';
import { notificationServiceHttp } from "../../services/notificationService";
import { MessageDetail } from "../../components/MessageDetail/component";
import Button from 'common/Button';
import GridTable from "common/Table";
import { MessageCreate } from "../../components/MessageCreate/component";
import NotificationProviderActions from "common/providers/NotificationProvider";
import {useSocketConnected} from '../../hooks/useSocket';
import { notificationService } from "../../services/notification";
import { MessageSentDetail } from "../../components/MessageSentDetail/component";
import Switch from 'common/Switch';
import {trashIcon} from 'common/icons';

export function SentPage(){

    
    const [notification, setNotification] = useState<any>();
    
    const tableRef = useRef<any>();
    const {connected} = useSocketConnected();
    const [expanded,setExpanded] = useState<number[]>([]);
    const [showTrash, setShowTrash] = useState<boolean>(false);

    const refreshTable = ()=>{
        if(tableRef.current){
            tableRef.current.refreshTable();
        }
    }

    useEffect(()=>{
        if(connected && notificationService){
            const offEvent = notificationService.onNewNotification(()=>{
                refreshTable();
            });
            return offEvent;
        }
    },[connected,notificationService])

    const columns = [
        
        { key: "content.title", label: "Titolo", type: "custom",  render:(n)=><td>
            {n.content.title} - {n.content.sub_title}
        </td> },
        { key: "id", label: "", type: "custom",  render:(n)=><td className={styles.dateColumn}>
            {new Date(n.date_start).toLocaleDateString()}
        </td>},
        { key: "id", label: "Status", type: "custom",  render:(n)=>{
            const statusCount = n.NotificationDetail.filter(p=>p.NotificationStatus.notificationStatus==='RESPONDED').reduce((acc, item) => {
                const status = item.NotificationStatus.description; // Usa "description" invece di "notificationStatus"
                acc[status] = (acc[status] || 0) + 1;
                return acc;
            }, {});
            return <td className={Object.keys(statusCount).length?styles.statusColumn:''}>
            
            {Object.keys(statusCount).map((k)=><span>{k}<span className={styles.statusBadge}>{statusCount[k]}</span></span>)}
        </td>}},
        { key: "id", label: "Destinatari", type: "custom",  render:(n)=><td className={styles.dateColumn}>
        {
            n.isGlobal?'Tutti i dipendenti':
            n.NotificationDetail.map(nd=>nd.Account.Person.firstName + ' ' + nd.Account.Person.lastName).join(', ')
        },
        
        </td>} ,
        { key: "id", label: "", type: "custom",  render:(n)=><td>
            <Button svgIcon={trashIcon} themeColor={'error'} fillMode='link' onClick={()=>{

                if(showTrash){
                    NotificationProviderActions.openConfirm(
                        "Vuoi eliminare la conversazione definitivamente?",
                        ()=>{
                            notificationServiceHttp.deleteSent(n.id).then(refreshTable)
                        },
                        'Conferma operazione'
                    )
                }else{

                
                    NotificationProviderActions.openConfirm(
                        "Vuoi spostare la conversazione nel cestino?",
                        ()=>{
                            notificationServiceHttp.moveSentToTrash(n.id).then(refreshTable)
                        },
                        'Conferma operazione'
                    )
                }
            }} />
        </td>}
    ];


    const loadData = (pagination: any) => notificationServiceHttp.getMySent(pagination.pageSize, pagination.currentPage);
    const loadDataBin = (pagination: any) => notificationServiceHttp.getMySentBin(pagination.pageSize, pagination.currentPage);
    

    return <div className={styles.container}>
        <GridTable
            key={showTrash ? "trash" : "inbox"} // Forza il re-render
            expand={{
                enabled: true,
                onExpandChange:(data:any,isExpanded)=>{
                    if(isExpanded){
                        setExpanded([...expanded,data.id]);
                    }else{
                        setExpanded(expanded.filter(e=>e!=data.id));
                    }
                },
                render: (rowProps) => <MessageSentDetail onRowClick={(n)=>setNotification(n)} data={rowProps.dataItem.NotificationDetail}/>
            }}
            customToolBarComponent={() => (
                <>
                <div className={styles.switchContainer}>
                    <Typography.p>Visualizza il cestino</Typography.p>
                    <Switch
                        checked={showTrash}
                        onChange={(e) => setShowTrash(e.value)}
                        onLabel="Si"
                        offLabel="No"
                        themeColor="error"
                    />
                </div>
                {
                    showTrash && <div className={styles.btnClean}>
                    <Button onClick={()=>{
                        NotificationProviderActions.openConfirm(
                            "Vuoi eliminare definitivamente tutte le notifiche nel cestino?",
                            ()=>{
                                notificationServiceHttp.deleteAllSent().then(refreshTable)
                            },
                            'Conferma operazione'
                        )
                    }} themeColor='error' svgIcon={trashIcon} >Svuota tutto</Button>
                </div>
                
                }
                </>
            )}
            ref={tableRef}
            pageable={true}
            filterable={false}
            sortable={false}
            getData={showTrash ? loadDataBin : loadData}
            columns={columns}
            resizableWindow={true}
            initialHeightWindow={800}
            draggableWindow={true}
            initialWidthWindow={900}
            resizable={true}
            actions={() => [
                "create"
            ]}
            formCrud={(row: any, type: string, closeModalCallback: any, refreshTable: any) => (
                <MessageCreate closeModal={closeModalCallback} />
            )}
            
        />
        <MessageDetail 
            isSent
            onClose={()=>{
                setNotification(undefined);
                
                if(tableRef.current){
                    tableRef.current.refreshTable();
                }
                }} id={notification?.id} 
            />
  </div>
}

