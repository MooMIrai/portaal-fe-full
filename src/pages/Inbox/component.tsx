import React, { useEffect, useRef, useState } from "react";
//@ts-ignore
import styles from './style.module.scss';
import Typography from 'common/Typography';
import { notificationServiceHttp } from "../../services/notificationService";
import { MessageDetail } from "../../components/MessageDetail/component";
import { StarFlag } from "../../components/StarFlag/component";
import GridTable from "common/Table";
import { MessageCreate } from "../../components/MessageCreate/component";

import {useSocketConnected} from '../../hooks/useSocket';


export function InboxPage(){

    
    const [notification, setNotification] = useState<any>();
    
    const tableRef = useRef<any>();
    const {connected,notificationService} = useSocketConnected();

    useEffect(()=>{
        if(connected && notificationService){
            notificationService.onNewNotification((arg)=>{

                if(tableRef.current){
                    tableRef.current.refreshTable();
                }
            })
        }
        
    },[connected,notificationService])

    const columns = [
        { key: "id", label: "", type: "custom", width:50, render:(n)=><td>
            <StarFlag n={n} type={"LIST"} className={styles.starIcon} />
        </td>},
        { key: "user_created", label: "Mittente", type: "string", sortable: false },
        { key: "NotifyUser.content.title", label: "Titolo", type: "string" },
        { key: "NotifyUser.content.sub_title", label: "Sottotitolo", type: "string"},
        { key: "id", label: "", type: "custom",  render:(n)=><td className={styles.dateColumn}>
            {new Date(n.NotifyUser.date_start).toLocaleDateString()}
        </td>},
    ];

    const loadData = (
        pagination: any,
        filter: any,
        sorting: any[],
      ) => {
    
        return notificationServiceHttp.getMy(pagination.pageSize,pagination.currentPage)
      }
    

    return <div className={styles.container}>
        <GridTable
            rowStyle={(rowData) => ({
                background: rowData.NotificationStatus.notificationStatus==='SENT' ?
                'var(--kendo-color-app-surface)' :
                 'var(--kendo-color-base)' ,
            })}
            onRowClick={(n)=>{
                setNotification(n)
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
            <MessageCreate />
            )}
            
        />
        <MessageDetail onClose={()=>{
            setNotification(undefined);
            if(tableRef.current){
                tableRef.current.refreshTable();
            }
            }} id={notification?.id} />
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

