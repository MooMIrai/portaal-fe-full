import React, { PropsWithRef } from "react";
import styles from './style.module.scss';
import SvgIcon from 'common/SvgIcon';
import {chevronLeftIcon, starIcon, starOutlineIcon, trashIcon, redoIcon} from 'common/icons';
import Typography from 'common/Typography';
import Button from 'common/Button';

export function MessageDetail(props:PropsWithRef<{
    currentMessage?:any,
    onClose:()=>void
}>){



  return <div className={styles.container+ ' ' + (props.currentMessage?styles.opened:'')}>
            <div className={styles.header}>
                {
                    props.currentMessage ?<>
                
                <Button size="large" themeColor="tertiary" fillMode="link" svgIcon={chevronLeftIcon} onClick={props.onClose} >
                    Indietro
                </Button>
                <div>
                {
                    props.currentMessage.isFlagged?
                    <SvgIcon className={styles.icon} size="xxlarge" themeColor="warning" icon={starIcon} ></SvgIcon>
                    :<SvgIcon className={styles.icon} size="xxlarge" themeColor="warning" icon={starOutlineIcon}></SvgIcon>
                }
                <SvgIcon className={styles.icon} flip="horizontal" size="xxlarge" themeColor="tertiary" icon={redoIcon} ></SvgIcon>
                <SvgIcon className={styles.icon} size="xxlarge" themeColor="error" icon={trashIcon} ></SvgIcon>
                </div>
                
                
                </>
                :null
                }
                
                

            </div>

            {props.currentMessage && <div className={styles.body}>
                <Typography.h3>{props.currentMessage.NotifyUser.content.title}</Typography.h3>
                <Typography.h5>{props.currentMessage.NotifyUser.content.sub_title}</Typography.h5>
                <Typography.p>{props.currentMessage.NotifyUser.content.text}</Typography.p>
            </div>}
        </div>
}