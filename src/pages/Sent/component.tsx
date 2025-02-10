import React, { useCallback, useEffect, useRef, useState } from "react";
//@ts-ignore
import styles from './style.module.scss';
import Typography from 'common/Typography';
import { notificationServiceHttp } from "../../services/notificationService";
import { MessageDetail } from "../../components/MessageDetail/component";
import { StarFlag } from "../../components/StarFlag/component";
import GridTable from "common/Table";
import { MessageCreate } from "../../components/MessageCreate/component";

import {useSocketConnected} from '../../hooks/useSocket';
import { notificationService } from "../../services/notification";
import { MessageSentDetail } from "../../components/MessageSentDetail/component";


export function SentPage(){

    
    const [notification, setNotification] = useState<any>();
    
    const tableRef = useRef<any>();
    const {connected} = useSocketConnected();

    useEffect(()=>{
        if(connected && notificationService){
            const offEvent = notificationService.onNewNotification(()=>{
                if(tableRef.current){
                    tableRef.current.refreshTable();
                }
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
        { key: "id", label: "Destinatari", type: "custom",  render:(n)=><td className={styles.dateColumn}>
        {
            n.isGlobal?'Tutti i dipendenti':
            n.NotificationDetail.map(nd=>nd.Account.Person.firstName + ' ' + nd.Account.Person.lastName).join(', ')
        }
    </td>} ,
    ];

    const loadData = (
        pagination: any,
        filter: any,
        sorting: any[],
      ) => {
    
        return notificationServiceHttp.getMySent(pagination.pageSize,pagination.currentPage)
      }
    

    return <div className={styles.container}>
        <GridTable
            expand={{
                enabled: true,
                render: (rowProps) => <MessageSentDetail onRowClick={(n)=>setNotification(n)} data={rowProps.dataItem.NotificationDetail}/>
            }}
            ref={tableRef}
            pageable={true}
            filterable={false}
            sortable={false}
            getData={loadData}
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


    /* return <div className={styles.container}>

        {
            notificationList?.map((n,ni)=><div onClick={()=>setNotification(n)} key={n.id} className={styles.list+ ' ' +  (n.NotificationStatus.notificationStatus==='SENT'?styles.unread:'')+ ' '+(ni===notificationList.length-1?styles.lastlist:'')}>
                <StarFlag n={n} type={"LIST"} className={styles.starIcon} />
                <Typography.p>{n.user_created}</Typography.p>
                <Typography.p>{n.NotifyUser.content.title} - <span>{n.NotifyUser.content.sub_title}</span></Typography.p>
                <Typography.p>{new Date(n.NotifyUser.date_start).toLocaleDateString()}</Typography.p>
            </div>)
        }
        <MessageDetail onClose={()=>{
            setNotification(undefined);
            getList();
            }} id={notification?.id} />
    </div> */
}

