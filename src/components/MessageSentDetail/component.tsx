import React from "react";
import GridTable from "common/Table";
import { StarFlag } from "../StarFlag/component";
import styles from './style.module.scss';
import Typography from 'common/Typography';
import AvatarIcon from 'common/AvatarIcon';
import SvgIcon from 'common/SvgIcon';
import { trashIcon, clockArrowRotateIcon } from 'common/icons';

export function MessageSentDetail(props: { data, onRowClick }) {


    const stringToColor = (name: string) => {
        let hash = 0;

        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        const h = Math.abs(hash * 137) % 360;  // Maggiore variazione della tonalità
        const s = 40 + (Math.abs(hash) % 30); // Saturazione tra 40% e 70%
        const l = 40 + (Math.abs(hash) % 20); // Luminosità tra 40% e 60%

        return `hsl(${h}, ${s}%, ${l}%)`;
    }



    const columns = [
        {
            key: "id", label: "", type: "custom", width: 50, render: (n) => <td>
                <StarFlag n={n} type={"LIST"} className={styles.starIcon} />
            </td>
        },
        {
            key: "id", label: "Destinatario", type: "custom", render: (n) =>
                <td style={{ width: '20%' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 15, alignItems: 'center', paddingTop: 5, paddingBottom: 5 }}>
                        <AvatarIcon name={n.Account.Person.firstName + ' ' + n.Account.Person.lastName} initials={
                            n.Account.Person.firstName[0].toUpperCase()
                            + n.Account.Person.lastName[0].toUpperCase()
                        } />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            <Typography.h6>{n.Account.Person.firstName} {n.Account.Person.lastName}</Typography.h6>
                            <Typography.p>{n.Account.email}</Typography.p>
                        </div>
                    </div>
                </td>
        },
        {
            key: "id", label: "Stato Notifica", type: "custom",  width: 200, render: (n) => {
                const statusDescription = n.NotificationStatus.description || n.NotificationStatus.notificationStatus;
                return (
                    <td className={styles.statusColumn}>
                        <span style={statusDescription ? { background: stringToColor(statusDescription) } : undefined}>
                            {statusDescription}
                        </span>
                    </td>
                );
            }
        },
        {

            key: "id", label: "Allerta", type: "custom", width: 100, render: (n) => {

                // Collegare Chimata per mandare reset status ?

                const alertIcon = n.NotificationStatus.notificationStatus !== "SENT";
                const color = "Ritorno!";

                return (
                    <td className={styles.statusColumn}>
                        <span title="Regredisci a Inviato" style={alertIcon === true ? { background: '--kendo-color-secondary', width: "25px" } : { visibility: "hidden" }}>
                            <div> <SvgIcon className={styles.icon} size="xlarge" themeColor="default" icon={clockArrowRotateIcon} ></SvgIcon></div>
                        </span>
                    </td>
                );
            }
        },
        {

            key: "id", label: "Cestinato", type: "custom", width: 100, render: (n) => {
                const onTrash = n.isDeleted;

                return (
                    <td className={styles.statusColumn}>
                        <span title="on Trash" style={onTrash === true ? { background: stringToColor(onTrash), width: "25px" } : { visibility: "hidden" }}>
                            <div> <SvgIcon className={styles.icon} size="xlarge" themeColor="default" icon={trashIcon} ></SvgIcon></div>
                        </span>
                    </td>
                );
            }
        }
    ];

    const loadData = () => {
        return Promise.resolve({ data: props.data, meta: { total: props.data.length } })
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