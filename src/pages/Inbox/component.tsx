import React, { useEffect, useState } from "react";
//@ts-ignore
import styles from './style.module.scss';
import Typography from 'common/Typography';
import { notificationServiceHttp } from "../../services/notificationService";
import SvgIcon from 'common/SvgIcon';
import {starOutlineIcon, starIcon} from 'common/icons';

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
                {n.isFlagged?<SvgIcon size="large" themeColor="warning" icon={starIcon} color={'yellow'}></SvgIcon>:<SvgIcon size="large" themeColor="warning" icon={starOutlineIcon}></SvgIcon>}
                <Typography.p>{n.user_created}</Typography.p>
                <Typography.p>{n.NotifyUser.content.title} - <span>{n.NotifyUser.content.sub_title}</span></Typography.p>
                <Typography.p>{new Date(n.NotifyUser.date_start).toLocaleDateString()}</Typography.p>
            </div>)
        }

    </div>
}