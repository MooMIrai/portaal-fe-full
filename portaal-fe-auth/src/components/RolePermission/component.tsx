import { PropsWithRef, useCallback, useEffect, useState } from "react";
import Modal from 'common/Modal';
import React from "react";
import { RoleService } from "../../services/roleservice";
import Button from 'common/Button';
import NotificationProviderActions from "common/providers/NotificationProvider";

import styles from './styles.module.scss';

export function RolePermission(props: PropsWithRef<{ idRole: number, open: boolean, onClose: () => void }>) {

    const [allList, setAllList] = useState<Array<any>>([]);
    const [selected, setSelected] = useState<Array<number>>([]);

    useEffect(() => {
        RoleService.getAllPermissions().then((res: any) => setAllList(res.data))
    }, [])

    useEffect(() => {
        if (props.idRole) {
            RoleService.fetchResource(props.idRole).then((res: any) => {
                if(res && res.Permission){
                    setSelected(res.Permission.map((p:any)=>p.id));
                }
            })
        }

    }, [props.idRole]);

    const IsSelected = (id: number) => selected.some(s => s === id)

    const toggleSelected = (id: number) => {
        if (IsSelected(id)) {
            setSelected(selected.filter(s => s != id))
        } else {
            setSelected([...selected, id])
        }
    }

    const handleAssociate = useCallback(() => {
        RoleService.associatePermission(props.idRole, selected).then(() => {
            NotificationProviderActions.openModal({ icon: true, style: 'success' }, "Operazione avvenuta con successo");
        });
    }, [selected, props.idRole])


    return <Modal
        title="Associa permessi al ruolo"
        isOpen={props.open}
        onClose={props.onClose}

    >
        <div className={styles.container}>
            {
                allList.map((p, i) => <div onClick={() => toggleSelected(p.id)} className={styles.input} key={"permission_" + i}>
                    <span style={{display: "flex", gap: "5px"}}><input type="checkbox" checked={IsSelected(p.id)} />
                        {p.description} </span><small><code>{p.type_permission}</code></small>
                </div>)
            }
            <Button className={styles.button} themeColor={'primary'} onClick={handleAssociate}>Salva</Button>
        </div>


    </Modal>

}