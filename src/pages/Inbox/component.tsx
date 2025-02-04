import React, { useEffect, useState } from "react";
//@ts-ignore
import styles from './style.module.scss';
import Typography from 'common/Typography';
import { notificationServiceHttp } from "../../services/notificationService";

export function InboxPage(){

    const [notificationList, setNotificationList] = useState<any[]>([]);
    
    useEffect(()=>{

        notificationServiceHttp.getMy().then(res=>{
            setNotificationList(res.data);
        })
    },[])


    return <div className={styles.container}>

        {
            notificationList?.map(n=><div key={n.id} className={styles.list+ ' ' +  (n.NotificationStatus.notificationStatus==='SENT'?styles.unread:'')}>
                <Typography.p>{n.user_created}</Typography.p>
                <Typography.p>{n.NotifyUser.content.title} - {n.NotifyUser.content.sub_title}</Typography.p>
                <Typography.p>{new Date(n.NotifyUser.date_start).toLocaleDateString()}</Typography.p>
            </div>)
        }

    </div>
}