import React, { useEffect, useRef, useState } from "react";
// @ts-ignore
import styles from './style.module.scss';
import Typography from 'common/Typography';
import { notificationServiceHttp } from "../../services/notificationService";
import { MessageDetail } from "../../components/MessageDetail/component";
import { StarFlag } from "../../components/StarFlag/component";
import GridTable from "common/Table";
import { MessageCreate } from "../../components/MessageCreate/component";
import { useSocketConnected } from '../../hooks/useSocket';
import { useParams } from "react-router-dom";
import AvatarIcon from 'common/AvatarIcon';
import Switch from 'common/Switch';
import SvgIcon from 'common/SvgIcon';
import Button from 'common/Button';
import { trashIcon, warningTriangleIcon } from 'common/icons';
import NotificationProviderActions from "common/providers/NotificationProvider";

export function InboxPage() {
    const [notification, setNotification] = useState<any>();
    const paramsPath = useParams();
    const [showTrash, setShowTrash] = useState<boolean>(false);
    const tableRef = useRef<any>();
    const { connected, notificationService } = useSocketConnected();


    const refreshTable = ()=>{
        if (tableRef.current) {
            tableRef.current.refreshTable();
        }
    }

    useEffect(() => {
        if (connected && notificationService) {
            const offEvent = notificationService.onNewNotification(() => {
                refreshTable();
            });
            return offEvent;
        }
    }, [connected, notificationService]);

    const columns = [
        { key: "id", label: "", type: "custom", width: 50, render: (n) => <td>
            <StarFlag n={n} type={"LIST"} className={styles.starIcon} />
        </td> },
        { key: "id",width:'200px', label: "Destinatario", type: "custom", render: (n) => {
            if (!n.NotifyUser.ManagerAccount) {
                return <td>{n.user_created}</td>;
            }
            return <td>
                <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 15, alignItems: 'center', paddingTop: 5, paddingBottom: 5 }}>
                    <AvatarIcon name={`${n.NotifyUser.ManagerAccount.Person.firstName} ${n.NotifyUser.ManagerAccount.Person.lastName}`}
                        initials={`${n.NotifyUser.ManagerAccount.Person.firstName[0].toUpperCase()}${n.NotifyUser.ManagerAccount.Person.lastName[0].toUpperCase()}`} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        <Typography.h6>{n.NotifyUser.ManagerAccount.Person.firstName} {n.NotifyUser.ManagerAccount.Person.lastName}</Typography.h6>
                        <Typography.p>{n.NotifyUser.ManagerAccount.email}</Typography.p>
                    </div>
                </div>
            </td>;
        } },
        { key: "NotifyUser.content.title", width:'200px', label: "Titolo", type: "custom", render: (n) =>{
            if(n.NotifyUser.NotifyResponseType.responseType!=='NONE' && 
                (n.notificationStatus!=='RESPONDED' || n.notificationStatus!=='COMPLETED')){
                    return <td>
                        <div className={styles.mustReply}>
                            <SvgIcon icon={warningTriangleIcon} themeColor="error" /> 
                            <span>In attesa di risposta</span>
                        </div>
                        
                    </td>
            }
            return <td></td>;
        }},
        { key: "NotifyUser.content.title", label: "", type: "custom", render: (n) => <td>
            {n.NotifyUser.content.title} - {n.NotifyUser.content.sub_title}
        </td> },
        { key: "id", label: "", type: "custom", render: (n) => <td className={styles.dateColumn}>
            {new Date(n.NotifyUser.date_start).toLocaleDateString()}
        </td> },
    ];

    const loadData = (pagination: any) => notificationServiceHttp.getMy(pagination.pageSize, pagination.currentPage);
    const loadDataBin = (pagination: any) => notificationServiceHttp.getMyBin(pagination.pageSize, pagination.currentPage);

    return (
        <div className={styles.container}>
            {paramsPath.id ? null : (
                <GridTable
                    writePermissions={["WRITE_NOTIFICATION_INBOX"]}
                    key={showTrash ? "trash" : "inbox"} // Forza il re-render
                    rowStyle={(rowData) => ({
                        background: rowData.notificationStatus === 'SENT' ?
                            'var(--kendo-color-app-surface)' :
                            'var(--kendo-color-base)',
                    })}
                    onRowClick={(n) => setNotification(n)}
                    customToolBarComponent={() => (
                        <>
                        <div className={styles.switchContainer}>
                            <Typography.p>Visualizza il cestino</Typography.p>
                            <Switch
                                checked={showTrash}
                                onChange={(e) => setShowTrash(e.value)}
                                onLabel="Si"
                                offLabel="No"
                                themeColor="error"
                            />
                        </div>
                        {
                            showTrash && <div className={styles.btnClean}>
                            <Button onClick={()=>{
                                NotificationProviderActions.openConfirm(
                                    "Vuoi eliminare definitivamente tutte le notifiche nel cestino?",
                                    ()=>{
                                        notificationServiceHttp.deleteAllInbox().then(refreshTable)
                                    },
                                    'Conferma operazione'
                                )
                            }} themeColor='error' svgIcon={trashIcon} >Svuota tutto</Button>
                        </div>
                        }
                        
                        </>
                    )}
                    ref={tableRef}
                    pageable={true}
                    filterable={false}
                    sortable={false}
                    getData={showTrash ? loadDataBin : loadData} // Cambia la funzione dinamicamente
                    columns={columns}
                    resizableWindow={true}
                    initialHeightWindow={800}
                    draggableWindow={true}
                    initialWidthWindow={900}
                    resizable={true}
                    actions={() => ["create"]}
                    formCrud={(row: any, type: string, closeModalCallback: any) => (
                        <MessageCreate closeModal={closeModalCallback} />
                    )}
                />
            )}

            <MessageDetail onClose={() => {
                if (paramsPath.id) {
                    window.close();
                }
                setNotification(undefined);
                refreshTable();
            }} id={paramsPath.id || notification?.id} />
        </div>
    );
}
