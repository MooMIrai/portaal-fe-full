import React, { useEffect, useState } from "react";
//@ts-ignore
import styles from './style.module.scss';
import Typography from 'common/Typography';
import { notificationServiceHttp } from "../../services/notificationService";
import { MessageDetail } from "../../components/MessageDetail/component";
import { StarFlag } from "../../components/StarFlag/component";

export function InboxPage(){

    const [notificationList, setNotificationList] = useState<any[]>([]);
    const [notification, setNotification] = useState<any>();
    

    const getList=()=>notificationServiceHttp.getMy().then(res=>{
        setNotificationList(res.data);
    })

    useEffect(()=>{
        getList();  
    },[])



    return <div className={styles.container}>

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
    </div>
}