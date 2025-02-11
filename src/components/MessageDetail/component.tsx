import React, { PropsWithRef, useCallback, useEffect, useState } from "react";
import styles from './style.module.scss';
import SvgIcon from 'common/SvgIcon';
import {chevronLeftIcon, trashIcon, redoIcon} from 'common/icons';
import Typography from 'common/Typography';
import Button from 'common/Button';
import { StarFlag } from "../StarFlag/component";
import { notificationServiceHttp } from "../../services/notificationService";
import HtmlParser from 'common/HtmlParser';
import { MessageResponse } from "../MessageResponse/component";

export function MessageDetail(props:PropsWithRef<{
    id:number,
    onClose:()=>void,
    isSent?:boolean
}>){

    const [data,setData] = useState<any>();
    const [modalData,setModalData] = useState<any>();

    const updateData = useCallback(()=>{
        if(props.id ){
            
            notificationServiceHttp.fetchResource(props.id).then(res=>{
                setData(res);
                if(!props.isSent && res.NotificationStatus.notificationStatus==='SENT')
                    notificationServiceHttp.updateStatus(props.id,"VIEWED");
            });
        }else{
            setData(undefined)
        }
    },[props.id])

    useEffect(()=>{
       updateData();
    },[props.id]);


  return <><div className={styles.container+ ' ' + (data?styles.opened:'')}>
            <div className={styles.header}>
                {
                    data ?<>
                
                <Button size="large" themeColor="tertiary" fillMode="link" svgIcon={chevronLeftIcon} onClick={props.onClose} >
                    Indietro
                </Button>
                <div>
                    <StarFlag n={data} type="DETAIL" className={styles.icon} />
                
                    {
                        !props.isSent && data?.NotifyUser?.NotifyResponseType?.responseType!='NONE' &&
                         (data?.NotificationStatus?.notificationStatus==='SENT' ||data?.NotificationStatus?.notificationStatus==='VIEWED') &&
                         <SvgIcon onClick={()=>{
                            setModalData(data.NotifyUser.NotifyResponseType);
                        }} className={styles.icon} flip="horizontal" size="xxlarge" themeColor="tertiary" icon={redoIcon} ></SvgIcon>
                    }
                
                    <SvgIcon className={styles.icon} size="xxlarge" themeColor="error" icon={trashIcon} ></SvgIcon>
                </div>
                
                
                </>
                :null
                }

            </div>

            {data && <div className={styles.body}>
                <Typography.h3>{data.NotifyUser.content.title}</Typography.h3>
                <Typography.h5>{data.NotifyUser.content.sub_title}</Typography.h5>
                <HtmlParser html={data.NotifyUser.content.text} />
            </div>}
        </div>
        <MessageResponse onClose={() => { 
            setModalData(undefined);
            updateData();
         } } responseType={modalData} id={data?.id} />
        </>
}