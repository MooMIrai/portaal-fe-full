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
import Button from 'common/Button';
import SvgIcon from 'common/SvgIcon';
import { myspaceIcon, envelopeIcon, borderColorIcon, trashIcon, checkIcon, globeIcon, userIcon, undoIcon, paperclipIcon } from 'common/icons';
import NotificationProviderActions from "common/providers/NotificationProvider";

export function InboxPage() {
    const [notification, setNotification] = useState<any>();
    const paramsPath = useParams();
    const [showTrash, setShowTrash] = useState<boolean>(false);
    const tableRef = useRef<any>();
    const { connected, notificationService } = useSocketConnected();


    const refreshTable = () => {
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
        {
            key: "id", label: "", type: "custom", width: 50, render: (n) => <td>
                <StarFlag n={n} type={"LIST"} className={styles.starIcon} />
            </td>
        },
        {
            key: "id", label: "Destinatario", type: "custom", render: (n) => {
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
            }
        },
        {

            key: "id", label: "HaveResponse", type: "custom", width: 100, render: (n) => {
                const responseType = n.NotifyUser.NotifyResponseType.responseType !== 'NONE'
                    && n.NotificationStatus.notificationStatus !== "COMPLETED"
                    && n.NotificationStatus.notificationStatus !== "RESPONDED";

                const label_to_respond = "NOtifica_con_RISposTA"
                const label_to_completed = "Completato"

                if (n.NotificationStatus.notificationStatus === "COMPLETED") {

                    return (
                        <td className={styles.statusColumn}>
                            <span title="Notifica COMPLETATA" className={styles.emailType} style={responseType === true ? { background: '--kendo-color-secondary' } : { visibility: "hidden" }}>
                                <div> <SvgIcon className={styles.icon} size="medium" themeColor="default" icon={checkIcon} ></SvgIcon></div>
                            </span>
                        </td>
                    );
                }

                return (
                    <td className={styles.statusColumn}>
                        <span title="Rispondi" className={styles.emailType} style={responseType === true ? { background: '--kendo-color-secondary' } : { visibility: "hidden" }}>
                            <div> <SvgIcon className={styles.icon} size="medium" themeColor="default" icon={undoIcon} ></SvgIcon></div>
                        </span>
                    </td>
                );
            }
        },
        {

            key: "id", label: "EMAIL", type: "custom", width: 100, render: (n) => {

                const emailType = n.NotifyUser.emailToSend;
                let label = "Email"

                if (n.NotifyUser?.EmailLog.length > 0) {

                    debugger;
                    const haveAttach = n.NotifyUser?.EmailLog?.some(emailLog => emailLog.name_attach) 
                    // DA verifcare, ci sono email LOG ??
                    label = "Email con allegato..";

                    return (

                        <td className={styles.statusColumn}>
                            <span title={label} className={styles.emailType} style={haveAttach === true ? { background: '--kendo-color-secondary' } : { visibility: "hidden" }}>
                                <div> <SvgIcon className={styles.icon} size="medium" themeColor="default" icon={paperclipIcon} ></SvgIcon></div>
                            </span>
                        </td>
                    );
                }

                return (
                    <td className={styles.statusColumn}>
                        <span title="Email" className={styles.emailType} style={emailType === true ? { background: '--kendo-color-secondary' } : { visibility: "hidden" }}>
                            <div> <SvgIcon className={styles.icon} size="medium" themeColor="default" icon={envelopeIcon} ></SvgIcon></div>
                        </span>
                    </td>
                );
            }
        },
        {
            key: "NotifyUser.content.title", label: "Titolo", type: "custom", render: (n) => <td>
                <b>{n.NotifyUser.content.title}</b> - {n.NotifyUser.content.sub_title}
            </td>
        },
        {
            key: "id", label: "", type: "custom", render: (n) => <td className={styles.dateColumn}>
                <b> {new Date(n.NotifyUser.date_start).toLocaleDateString()}</b>
            </td>
        },
    ];

    const loadData = (pagination: any) => notificationServiceHttp.getMy(pagination.pageSize, pagination.currentPage);
    const loadDataBin = (pagination: any) => notificationServiceHttp.getMyBin(pagination.pageSize, pagination.currentPage);

    return (
        <div className={styles.container}>
            {paramsPath.id ? null : (
                <GridTable
                    key={showTrash ? "trash" : "inbox"} // Forza il re-render
                    rowStyle={(rowData) => ({
                        background: rowData.NotificationStatus.notificationStatus === 'SENT' ?
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
                                    <Button onClick={() => {
                                        NotificationProviderActions.openConfirm(
                                            "Vuoi eliminare definitivamente tutte le notifiche nel cestino?",
                                            () => {
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
