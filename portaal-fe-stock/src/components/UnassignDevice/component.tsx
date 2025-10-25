import React, { useEffect, useState } from "react";
import Button from 'common/Button';
import { useDeviceAssignedContext } from "../UserWithDeviceAssigned/context";
import Modal from 'common/Modal';
import { deviceService } from "../../services/deviceService";
import fileService from 'common/services/FileService';
import NotificationActions from 'common/providers/NotificationProvider';
import SignDocumentScanner from 'common/SignDocumentScanner';
import { UploadSingleFileInput } from 'common/Fields';

function ModalComponent(props:{onSubmit:()=>void}) {

    const { checkboxes } = useDeviceAssignedContext();
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [uploadedFile, setUploadedFile] = useState<any>();
    const [signedFile, setSignedFile] = useState<any>();

    useEffect(() => {
        if (signedFile) {
            setPreviewUrl(fileService.urlFromUint8(signedFile.data, signedFile.content_type));
        } else if (uploadedFile) {
            setPreviewUrl(fileService.urlFromUint8(uploadedFile.data, uploadedFile.content_type));
        } else {
            const isDisabledC = !checkboxes || !Object.keys(checkboxes).length;
            if (!isDisabledC) {
                const personId = Object.keys(checkboxes)[0];
                deviceService.produceRestitutionPdf(
                    parseInt(personId),
                    new Date(),
                    checkboxes[personId].map(d => [d.Stock.DeviceType ? d.Stock.DeviceType.name : "", d.Stock.model, d.Stock.serial_number])
                ).then(f => {
                    setPreviewUrl(fileService.urlFromUint8(f.data, f.content_type))
                })
            }
        }

    }, [signedFile, uploadedFile, checkboxes]);

    useEffect(() => {
        return () => URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);

    const handleUnassign = ()=>{
        const personId = Object.keys(checkboxes)[0];
        deviceService.unassignDevices(checkboxes[personId].map(p=>p.id),signedFile || uploadedFile).then(()=>{
            NotificationActions.openModal(
                { icon: true, style: "success" },
                "Dispositivi associati"
            );
            props.onSubmit();
        })
    }

    return <div style={{ display: "flex", justifyContent: 'space-between', height: '100%', gap: 15 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            <table style={{ border: '1px solid #000' }}>
                <tbody>
                    {checkboxes[Object.keys(checkboxes)[0]].map(d => <tr key={d.Stock.serial_number}>
                        <td>{d.Stock.DeviceType?.name}</td>
                        <td>{d.Stock.model}</td>
                        <td>{d.Stock.serial_number}</td>
                    </tr>)}
                </tbody>
            </table>
            <span>Scegli scaricare il modulo non firmato (dalla preview alla tua destra) e ricaricalo <br /> firmato da qui</span>

            <UploadSingleFileInput name="receipt" onChange={(e) => {
                if (e.value?.create) {
                    setUploadedFile(e.value.create[0]);
                    setSignedFile(undefined)
                }
            }} value={uploadedFile} />

            <span>Oppure fai firmare con il tablet il documento</span>
            <SignDocumentScanner
                name={""} surname={""} description="Firma il documento di restituzione"
                onSign={(sign) => {
                    const personId = Object.keys(checkboxes)[0];
                    deviceService.produceAssignPdf(parseInt(personId), new Date(),
                        checkboxes[personId].map(d => [d.Stock.DeviceType ? d.Stock.DeviceType.name : "", d.Stock.model, d.Stock.serial_number]),
                        sign
                    ).then(file => {
                        setSignedFile(file);
                        setUploadedFile(undefined)
                    })
                }}
                onError={() => {

                    NotificationActions.openModal(
                        { icon: true, style: "error" },
                        "Errore di collegamento con il tablet.\nControlla di aver installato il driver."
                    );

                }}
            />
            {uploadedFile || signedFile ?<Button type="button" themeColor="success" onClick={handleUnassign}>
            Restituisci dispositivo
        </Button>:null}
        </div>
        <div style={{ flex: 1 }}>

            {
                previewUrl && previewUrl.length ? <iframe width={'100%'} height={'100%'} src={previewUrl} /> : null
            }

        </div>
    </div>
}

export function UnassignDevices(props:{
    handleRefresh:()=>void
}) {

    const { checkboxes } = useDeviceAssignedContext();
    const [showModal, setShowModal] = useState<boolean>(false);


    const isDisabled = !checkboxes || !Object.keys(checkboxes).length;

    const handleSubmit = ()=>{
        setShowModal(false);
        props.handleRefresh();
    }

    return <>
        <Button themeColor="success" type="button" disabled={isDisabled} onClick={() => {
            setShowModal(true);
        }} >
            Restituisci Dispositivi selezionati
        </Button>
        <Modal
            title="Restituzione dispositivi"
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            width="100%"
            height="100%"
        >
            {showModal && <ModalComponent onSubmit={handleSubmit} />}
        </Modal>
    </>
}