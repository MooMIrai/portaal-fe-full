import React, { useState } from "react";
import Button from 'common/Button';
import { useDeviceAssignedContext } from "../UserWithDeviceAssigned/context";
import Modal from 'common/Modal';

export function UnassignDevices(){

    const { checkboxes } = useDeviceAssignedContext();
    const [showModal,setShowModal] = useState<boolean>(false);

    const isDisabled = !checkboxes || !Object.keys(checkboxes).length

    return <>
        <Button themeColor="success" type="button" disabled={isDisabled} onClick={()=>{
            setShowModal(true);
        }} >
            Restituisci Dispositivi selezionati
        </Button>
        <Modal
            title="Restituzione dispositivi"
            isOpen={showModal}
            onClose={()=>setShowModal(false)}
            width="100%"
            height="100%"
        >
            <div style={{display:"flex",justifyContent:'space-between',height:'100%',gap:15}}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                <table style={{ border: '1px solid #000' }}>
                    <tbody>
                    {!isDisabled && checkboxes[Object.keys(checkboxes)[0]].map(d => <tr key={d.Stock.serial_number}>
                        <td>{d.Stock.DeviceType?.name}</td>
                        <td>{d.Stock.model}</td>
                        <td>{d.Stock.serial_number}</td>
                    </tr>)}
                    </tbody>
                </table>
                </div>
                <div style={{flex:1}}>
        
                    {
                        //previewUrl && previewUrl.length ?<iframe width={'100%'} height={'100%'} src={previewUrl} />:null
                    }
                    
                </div>
            </div>
        </Modal>
    </>
}