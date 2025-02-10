import React from "react";
import GridTable from "common/Table";
import { StarFlag } from "../StarFlag/component";
import styles from './style.module.scss';
import Typography from 'common/Typography';
import AvatarIcon from 'common/AvatarIcon';

export function MessageSentDetail(props:{data,onRowClick}){

    const columns=[
        { key: "id", label: "", type: "custom", width:50, render:(n)=><td>
            <StarFlag n={n} type={"LIST"} className={styles.starIcon} />
        </td>},
        { key: "id", label: "Destinatario", type: "custom",  render:(n)=><td>
            <div style={{ display: 'flex', justifyContent:'flex-start', gap:15, alignItems:'center', paddingTop:5,paddingBottom:5 }}>
                <AvatarIcon name={n.Account.Person.firstName + ' ' + n.Account.Person.lastName} initials={
                    n.Account.Person.firstName[0].toUpperCase()
                    +n.Account.Person.lastName[0].toUpperCase()
                    } />
                    <div style={{display:'flex',flexDirection:'column', gap:0}}>
                        <Typography.h6>{n.Account.Person.firstName} {n.Account.Person.lastName}</Typography.h6>
                        <Typography.p>{n.Account.email}</Typography.p>
                    </div>
            </div>
        </td>},
        { key: "id", label: "Stato Notifica", type: "custom",  render:(n)=><td>
            {n.NotificationStatus.description || n.NotificationStatus.notificationStatus}
        </td>}
    ];

    const loadData =()=>{
        return Promise.resolve({data:props.data,meta:{total:props.data.length}})
    }


return <GridTable
            
           
            onRowClick={
                props.onRowClick
            }
            //ref={tableRef}
            pageable={false}
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
               
            ]}
            
            
        />

}