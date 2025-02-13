import React, { useCallback, useEffect, useRef, useState } from "react";
//@ts-ignore
import styles from './style.module.scss';
import Typography from 'common/Typography';
import { notificationServiceHttp } from "../../services/notificationService";
import { MessageDetail } from "../../components/MessageDetail/component";
import Button from 'common/Button';
import GridTable from "common/Table";
import { MessageCreate } from "../../components/MessageCreate/component";
import NotificationProviderActions from "common/providers/NotificationProvider";
import { useSocketConnected } from '../../hooks/useSocket';
import { notificationService } from "../../services/notification";
import { MessageSentDetail } from "../../components/MessageSentDetail/component";
import Switch from 'common/Switch';
import SvgIcon from 'common/SvgIcon';
import { trashIcon, myspaceIcon, envelopeIcon, envelopeLinkIcon,cancelIcon, globeIcon, userIcon } from 'common/icons';
export function SentPage() {


    const [notification, setNotification] = useState<any>();

    const tableRef = useRef<any>();
    const { connected } = useSocketConnected();
    const [expanded, setExpanded] = useState<number[]>([]);
    const [showTrash, setShowTrash] = useState<boolean>(false);

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
    }, [connected, notificationService])

    const columns = [

        {
            key: "content.title", label: "Titolo", type: "custom", render: (n) => <td>
                <b>{n.content.title} </b>- {n.content.sub_title}
            </td>
        },
        {
            key: "id", label: "EMAIL", type: "custom", width: 100, render: (n) => {
                const onTrash = n.emailToSend;
                const label = "Email"
                return (
                    <td className={styles.statusColumn}>
                        <span title={label} className={styles.emailType} style={onTrash === true ? { background: '--kendo-color-primary' } : { visibility: "hidden" }}>
                            <div> <SvgIcon className={styles.icon} size="large" themeColor="default" icon={envelopeIcon} ></SvgIcon></div>
                        </span>
                    </td>
                );
            }
        },
        {
            key: "id", label: "", type: "custom", render: (n) => <td className={styles.dateColumn}>
                <b>{new Date(n.date_start).toLocaleDateString()}</b>
            </td>
        },
        {
            key: "id", label: "Status", type: "custom", render: (n) => {
                const statusCount = n.NotificationDetail.filter(p => p.NotificationStatus.notificationStatus === 'RESPONDED').reduce((acc, item) => {
                    const status = item.NotificationStatus.description; // Usa "description" invece di "notificationStatus"
                    acc[status] = (acc[status] || 0) + 1;
                    return acc;
                }, {});
                return <td className={Object.keys(statusCount).length ? styles.statusColumn : ''}>

                    {Object.keys(statusCount).map((k) => <span>{k}<span className={styles.statusBadge}>{statusCount[k]}</span></span>)}
                </td>
            }
        },
        {
            key: "id", label: "Destinatari", type: "custom", render: (n) => {

                const globalType = n.isGlobal;
                const label_global = "Pianeta"; 
                const label_group = "Gruppo";
                const label_user = "Utente";
                const length_details = n.NotificationDetail ? n.NotificationDetail.length : 0;
                const details = n.NotificationDetail.map(nd => nd.Account.Person.firstName + ' ' + nd.Account.Person.lastName).join(', ');

                if (globalType === true) {
                    const text = "Tutti i dipendenti"

                    return (
                        <td className={styles.statusColumn}>
                            <span title="Tutti i dipendenti" className={styles.emailType} style={globalType === true ? { background: '--kendo-color-secondary' } : { visibility: "hidden" }}>
                                <div> <SvgIcon className={styles.icon} size="medium" themeColor="default" icon={globeIcon} ></SvgIcon></div>
                            </span>
                            {
                                text
                            }
                        </td>

                    )
                } else if (globalType === false) {
                    if (length_details === 1) {
                        return (
                            <td className={styles.statusColumn}>
                                <span title={details} className={styles.emailType} style={globalType !== true ? { background: '--kendo-color-secondary' } : { visibility: "hidden" }}>
                                    <div> <SvgIcon className={styles.icon} size="medium" themeColor="default" icon={userIcon} ></SvgIcon></div>
                                </span>
                                {
                                    details
                                }
                            </td>
                        );
                    } else if (length_details > 1) {
                        return (
                            <td className={styles.statusColumn}>
                                <span title={details} className={styles.emailType} style={globalType !== true ? { background: '--kendo-color-secondary' } : { visibility: "hidden" }}>
                                    <div> <SvgIcon className={styles.icon} size="medium" themeColor="default" icon={myspaceIcon} ></SvgIcon></div>
                                </span>
                                {
                                    details
                                }
                            </td>
                        );
                    } else {
                        return (
                            <td className={styles.statusColumn}>
                                <span title={details} className={styles.emailType} style={globalType !== true ? { background: '--kendo-color-secondary' } : { visibility: "hidden" }}>
                                    <div> <SvgIcon className={styles.icon} size="medium" themeColor="default" icon={cancelIcon} ></SvgIcon></div>
                                </span>
                            </td>
                        );
                    }
                }
            }
        },
        /*
         {
             key: "id", label: "Destinatari", type: "custom", render: (n) => <td className={styles.dateColumn}>
                 {
                     n.isGlobal ? 'Tutti i dipendenti' :
                         n.NotificationDetail.map(nd => nd.Account.Person.firstName + ' ' + nd.Account.Person.lastName).join(', ')
                 },
 
             </td>
         },
        */
        {
            key: "id", label: "", type: "custom", render: (n) => <td>
                <Button svgIcon={trashIcon} themeColor={'error'} fillMode='link' className={styles.buttonAction} onClick={() => {

                    if (showTrash) {
                        NotificationProviderActions.openConfirm(
                            "Vuoi eliminare la conversazione definitivamente?",
                            () => {
                                notificationServiceHttp.deleteSent(n.id).then(refreshTable)
                            },
                            'Conferma operazione'
                        )
                    } else {


                        NotificationProviderActions.openConfirm(
                            "Vuoi spostare la conversazione nel cestino?",
                            () => {
                                notificationServiceHttp.moveSentToTrash(n.id).then(refreshTable)
                            },
                            'Conferma operazione'
                        )
                    }
                }} />
            </td>
        }
    ];


    const loadData = (pagination: any) => notificationServiceHttp.getMySent(pagination.pageSize, pagination.currentPage);
    const loadDataBin = (pagination: any) => notificationServiceHttp.getMySentBin(pagination.pageSize, pagination.currentPage);


    return <div className={styles.container}>
        <GridTable
            key={showTrash ? "trash" : "inbox"} // Forza il re-render
            expand={{
                enabled: true,
                onExpandChange: (data: any, isExpanded) => {
                    if (isExpanded) {
                        setExpanded([...expanded, data.id]);
                    } else {
                        setExpanded(expanded.filter(e => e != data.id));
                    }
                },
                render: (rowProps) => <MessageSentDetail onRowClick={(n) => setNotification(n)} data={rowProps.dataItem.NotificationDetail} />
            }}
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
                                        notificationServiceHttp.deleteAllSent().then(refreshTable)
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
            getData={showTrash ? loadDataBin : loadData}
            columns={columns}
            resizableWindow={true}
            initialHeightWindow={800}
            draggableWindow={true}
            initialWidthWindow={900}
            resizable={true}
            actions={() => [
                "create"
            ]}
            formCrud={(row: any, type: string, closeModalCallback: any, refreshTable: any) => (
                <MessageCreate closeModal={closeModalCallback} />
            )}

        />
        <MessageDetail
            isSent
            onClose={() => {
                setNotification(undefined);

                if (tableRef.current) {
                    tableRef.current.refreshTable();
                }
            }} id={notification?.id}
        />
    </div>
}

