import React, { PropsWithRef, useEffect, useState } from "react";
import styles from './style.module.scss';
import SvgIcon from 'common/SvgIcon';
import {chevronLeftIcon, starIcon, starOutlineIcon, trashIcon, redoIcon} from 'common/icons';
import Typography from 'common/Typography';
import Button from 'common/Button';
import { StarFlag } from "../StarFlag/component";
import { notificationServiceHttp } from "../../services/notificationService";

export function MessageDetail(props:PropsWithRef<{
    id:number,
    onClose:()=>void
}>){

    const [data,setData] = useState<any>();

    useEffect(()=>{
        if(props.id){
            
            notificationServiceHttp.fetchResource(props.id).then(res=>{
                setData(res);
                notificationServiceHttp.updateStatus(props.id,"VIEWED");
            });
        }else{
            setData(undefined)
        }
    },[props.id])


  return <div className={styles.container+ ' ' + (data?styles.opened:'')}>
            <div className={styles.header}>
                {
                    data ?<>
                
                <Button size="large" themeColor="tertiary" fillMode="link" svgIcon={chevronLeftIcon} onClick={props.onClose} >
                    Indietro
                </Button>
                <div>
                <StarFlag n={data} type="DETAIL" className={styles.icon} />
                <SvgIcon className={styles.icon} flip="horizontal" size="xxlarge" themeColor="tertiary" icon={redoIcon} ></SvgIcon>
                <SvgIcon className={styles.icon} size="xxlarge" themeColor="error" icon={trashIcon} ></SvgIcon>
                </div>
                
                
                </>
                :null
                }
                
                

            </div>

            {data && <div className={styles.body}>
                <Typography.h3>{data.NotifyUser.content.title}</Typography.h3>
                <Typography.h5>{data.NotifyUser.content.sub_title}</Typography.h5>
                <Typography.p>{data.NotifyUser.content.text}</Typography.p>
            </div>}
        </div>
}