import React, { PropsWithRef, useCallback, useEffect, useState } from "react";
import SvgIcon from 'common/SvgIcon';
import {chevronLeftIcon, trashIcon, redoIcon, checkIcon, xIcon} from 'common/icons';
import Typography from 'common/Typography';
import Button from 'common/Button';
import { StarFlag } from "../StarFlag/component";
import { notificationServiceHttp } from "../../services/notificationService";
import HtmlParser from 'common/HtmlParser';
import { MessageResponse } from "../MessageResponse/component";
import AvatarIcon from 'common/AvatarIcon';
import { MessageResponseView } from "../MessageResponse/view";
import NotificationProviderActions from "common/providers/NotificationProvider";
import authService from 'common/services/AuthService';
import styles from './style.module.scss';

export function MessageDetail(props:PropsWithRef<{
    id:number,
    onClose:()=>void,
    isSent?:boolean
}>){

    const [data,setData] = useState<any>();
    const [modalData,setModalData] = useState<any>();

    const updateData = useCallback(()=> {

        async function update () {

            if(props.id) {

                const res = await notificationServiceHttp.getDetail(props.id);

                if(!props.isSent && res.notificationStatus ==='SENT') {
                    await notificationServiceHttp.updateStatus(props.id,"VIEWED");
                    await notificationServiceHttp.getMyUnreadCount();
                }

                setData(res);
        
            }
        
            else {
                setData(undefined);
            }
        }

        update();
        
    }, [props.id]);

    useEffect(()=>{
       updateData();
    },[props.id]);

    const updateStatus=(confirm:boolean)=>{
        notificationServiceHttp.updateResponseStatus(props.id,confirm).then(()=>{
            NotificationProviderActions.openModal({ icon: true, style: 'success' }, "Operazione avvenuta con successo");
            updateData();
        })
    }   

    let dr;
    if(data && data.response){
        dr = JSON.parse(data.response)
    }

    let formValidation;
    if(data && data.NotifyUser.NotifyResponseType?.validations){
        formValidation = data.NotifyUser.NotifyResponseType.validations;
    }

  return <><div className={styles.container+ ' ' + (data?styles.opened:'')}>
            
                <div className={styles.header}>
                    {
                        data ?<>
                    
                    <Button size="large" themeColor="tertiary" fillMode="link" svgIcon={chevronLeftIcon} onClick={props.onClose} >
                        Indietro
                    </Button>
                    {
                        (
                            !props.isSent && authService.hasPermission('WRITE_NOTIFICATION_INBOX') || 
                            props.isSent && authService.hasPermission('WRITE_NOTIFICATION_MANAGER')
                        )  && <div>
                        
                        <StarFlag n={data} type="DETAIL" className={styles.icon} />
                    
                        {
                            !props.isSent && data?.NotifyUser?.responseType !='NONE' &&
                            (data?.notificationStatus ==='SENT' ||data?.notificationStatus==='VIEWED') &&
                            <SvgIcon onClick={()=>{
                                setModalData(data.NotifyUser.NotifyResponseType);
                            }} className={styles.icon} flip="horizontal" size="xxlarge" themeColor="tertiary" icon={redoIcon} ></SvgIcon>
                        }
                    
                        <SvgIcon
                            onClick={()=>{
                                if(data.isDeleted){
                                    NotificationProviderActions.openConfirm(
                                        "Vuoi eliminare definitivamente la notifica?",
                                        ()=>{
                                            notificationServiceHttp.deleteInbox(data.id);
                                            props.onClose();
                                        },
                                        'Conferma operazione'
                                    )
                                }else{
                                    NotificationProviderActions.openConfirm(
                                        "Vuoi spostare la notifica nel cestino?",
                                        ()=>{
                                            notificationServiceHttp.moveToTrash(data.id);
                                            props.onClose();
                                        },
                                        'Conferma operazione'
                                    )
                                }
                                
                            }}
                         className={styles.icon} size="xxlarge" themeColor="error" icon={trashIcon} ></SvgIcon>
                    </div>
                    }
                    
                    
                    
                    </>
                    :null
                    }

                </div>

        <div className={styles.bodyContainer}>
            
            
            {
                dr && <>
                
                <div className={styles.responseContainer}>
                    
                    <div className={styles.nameContainer}>
                        <AvatarIcon name={data.Account.Person.firstName + ' ' + data.Account.Person.lastName} initials={
                                        data.Account.Person.firstName[0].toUpperCase()
                                        +data.Account.Person.lastName[0].toUpperCase()
                        } />
                        <div>
                            <Typography.h5>{data.Account.Person.firstName + ' ' + data.Account.Person.lastName}</Typography.h5>
                            <Typography.p>{data.Account.email}</Typography.p>
                        </div>
                    </div>
                    {formValidation && dr && <MessageResponseView parameters={formValidation} valuesMap={dr} />}
                </div>
                {props.isSent && <div className={styles.confirmContainer}>
                    <Button onClick={()=>updateStatus(true)} themeColor="success" fillMode="link" svgIcon={checkIcon}> Conferma risposta</Button>
                    <Button onClick={()=>updateStatus(false)} themeColor="error" fillMode="link" svgIcon={xIcon}> Cancella risposta</Button>
                </div>}
                </>
            }
            {data && <div className={styles.body +(dr?' '+styles.hasResponse:'')}>
                
                {(() => {

                    const isSystemAccount = data.NotifyUser.ManagerAccount.email === "system@system.com";
                    const firstName = data.NotifyUser.ManagerAccount.Person?.firstName || (isSystemAccount ? "System" : '');
                    const lastName = data.NotifyUser.ManagerAccount.Person?.lastName || (isSystemAccount ? "Account" : '');

                    return (

                        <div className={styles.nameContainer}>

                            <AvatarIcon name={firstName + ' ' + lastName} initials={firstName[0].toUpperCase() + lastName[0].toUpperCase()} />

                            <div>

                                <Typography.h5>{firstName + ' ' + lastName}</Typography.h5>
                                <Typography.p>{data.NotifyUser.ManagerAccount?.email || ''}</Typography.p>

                            </div>

                        </div>
                    );

                })()}
                <Typography.h4>{data.NotifyUser.content.title}</Typography.h4>
                <Typography.h5>{data.NotifyUser.content.sub_title}</Typography.h5>
                <HtmlParser html={data.NotifyUser.content.text} />
            </div>}
            
            </div>
        </div>
        <MessageResponse onClose={() => { 
            setModalData(undefined);
            updateData();
         } } responseType={modalData} id={data?.id} />

        </>
}