import React from "react";
import Button from 'common/Button';
import { deviceService } from "../../services/deviceService";
import SignDocumentScanner from 'common/SignDocumentScanner';
import {UploadSingleFileInput} from 'common/Fields'

interface RelateDeviceProps{
    devices:any[]
}

export function RelateDevice(props:RelateDeviceProps){
    return <div style={{display:'flex',flexDirection:'column',gap:15}}>
        <table border={1}>
            {props.devices.map(d=><tr key={d.serial_number}>
                <td>{d.DeviceType.name}</td>
                <td>{d.model}</td>
                <td>{d.serial_number}</td>
            </tr>)}
        </table>
        <span>Scegli scaricare il </span>
        <Button themeColor="info" type="button" onClick={()=>{
            deviceService.produceAssignPdf(undefined,new Date(),
            [['Pc portatile','MSI katana','SN123456677'],['Smartphone','iphone 16','SN123456677']],
          )
        }}>Modulo vuoto</Button>
        <span>e ricaricalo compilato da qui</span>
       
            <span><UploadSingleFileInput onChange={()=>{}} value={null} /></span>
            <span>Oppure fai firmare con il tablet il documento</span>
            <SignDocumentScanner 
                name="" surname="" description="Firma il documento di approvazione" 
                onSign={(data)=>{console.log(data)}}
                onError={(err)=>console.log(err)}
            />
        
    </div>
}