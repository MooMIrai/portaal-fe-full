import React, { useEffect, useState } from "react";
import Button from 'common/Button';
import { deviceService } from "../../services/deviceService";
import SignDocumentScanner from 'common/SignDocumentScanner';
import { UploadSingleFileInput } from 'common/Fields'
import NotificationActions from 'common/providers/NotificationProvider';
import { AutoCompletePerson } from "./customFields";
import fileService from 'common/services/FileService';
interface RelateDeviceProps {
    devices: any[],
    onSubmit:()=>void
}

export function RelateDevice(props: RelateDeviceProps) {

    const [person, setPerson] = useState<any>();
    const [uploadedFile,setUploadedFile] = useState<any>();
    const [previewUrl,setPreviewUrl] = useState<string>("");
    const [signedFile,setSignedFile] = useState<any>();

    useEffect(()=>{
        
        if(signedFile){
            setPreviewUrl(fileService.urlFromUint8(signedFile.data,signedFile.content_type));
        }else if(uploadedFile){
            setPreviewUrl(fileService.urlFromUint8(uploadedFile.data,uploadedFile.content_type));
        }else{
            deviceService.produceAssignPdf(person?.id, new Date(),
                props.devices.map(d=>[d.DeviceType.name,d.model,d.serial_number]),
            ).then(f=>{
                setPreviewUrl(fileService.urlFromUint8(f.data,f.content_type))
            })
        }
    },[signedFile,uploadedFile,person])

    useEffect(()=>{
        return ()=>URL.revokeObjectURL(previewUrl);
    },[previewUrl])

    return <div style={{display:"flex",justifyContent:'space-between',height:'100%',gap:15}}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        <table style={{ border: '1px solid #000' }}>
            <tbody>
            {props.devices.map(d => <tr key={d.serial_number}>
                <td>{d.DeviceType.name}</td>
                <td>{d.model}</td>
                <td>{d.serial_number}</td>
            </tr>)}
            </tbody>
        </table>
        <AutoCompletePerson label="Seleziona dipendente" value={person} onChange={(e)=>{
            setPerson(e.value);
            setSignedFile(undefined);
            setUploadedFile(undefined);
            
        }} />
        {
            person && <>
                <span>Scegli scaricare il modulo non firmato (dalla preview alla tua destra) e ricaricalo <br/> firmato da qui</span>
  
                <UploadSingleFileInput  onChange={(e) => {
                    if(e.value?.create){
                        setUploadedFile(e.value.create[0]);
                        setSignedFile(undefined)
                    }  
                    }} value={uploadedFile} name="waiver" />

                <span>Oppure fai firmare con il tablet il documento</span>
                <SignDocumentScanner
                    name={person.name} surname={""} description="Firma il documento di approvazione"
                    onSign={(sign) => { 
                        deviceService.produceAssignPdf(person.id, new Date(),
                            props.devices.map(d=>[d.DeviceType.name,d.model,d.serial_number]),
                            sign
                        ).then(file=>{
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
            </>
        }

    {person && (uploadedFile || signedFile) ?<Button type="button" themeColor="success" onClick={()=>{
        
        deviceService.assignDevices(person.id,props.devices.map(p=>p.id),signedFile || uploadedFile).then(()=>{
            NotificationActions.openModal(
                { icon: true, style: "success" },
                "Dispositivi associati"
            );
            props.onSubmit();
        })
    }}>
        Conferma Assegnazione
    </Button>:null}
    </div>
    <div style={{flex:1}}>
        
        {previewUrl && previewUrl.length ?<iframe width={'100%'} height={'100%'} src={previewUrl} />:null}
        
    </div>
    </div>
    
}