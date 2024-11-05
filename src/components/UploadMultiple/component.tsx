import React, { useEffect, useState } from "react";
import Modal from "../Modal/component";
import UploadSingleFileComponent from "../UpLoadSingleFile/component";
import styles from './styles.module.scss';
import {  downloadIcon, plusIcon, trashIcon } from "@progress/kendo-svg-icons";
import { Button, ButtonGroup } from "@progress/kendo-react-buttons";
import FileService from "../../services/FileService";

interface UploadMultipleProps {
    isReadOnly:boolean;
    onChange?: (value:Array<any>)=>void;
    existingFiles?:Array<any>,
    name:string
}

export default function UploadMultiple(props:UploadMultipleProps){

    const [openSingle,setOpenSingle] = useState<boolean>(false);
    const [currentSingle,setCurrentSingle] = useState<any>();
    const [values,setValues] = useState<any[]>([]);
    const [removedExisting,setRemovedExisting] = useState<Array<string>>([]);

    useEffect(()=>{
        if(props.onChange){
            const value = FileService.combineDataToBE(values,removedExisting,props.name)
            props.onChange(value);
        }
    },[values,removedExisting])

    const handleValue = ()=>{
        if(currentSingle && currentSingle.create){
            setValues([...values,...currentSingle.create]);
            handleCloseSingle();
            setCurrentSingle(undefined);
        }
    };

    const handleRemove = (index:number)=> {
        setValues(values.filter((el,indexInArray)=>indexInArray!==index));
    }

    const handleRemoveExisting = (data:any)=>{
        setRemovedExisting([...removedExisting,data.uniqueIdentifier])
    }

    const handleCloseSingle = ()=> setOpenSingle(false)


    const valuerender = values && values.length? values.map((file,index) => (
        <li key={(file.direct_link || file.name)+'_'+index} className={styles.existingFilesList}>
          {file.direct_link || file.name}
          {!props.isReadOnly && <ButtonGroup>
            <Button
                themeColor={"error"}
                svgIcon={trashIcon}
                onClick={() => handleRemove(index)}
            >
            </Button>
            <Button 
                themeColor={"primary"}
                svgIcon={downloadIcon}
                onClick={()=>{
                    FileService.openFileFromLink(FileService.urlFromUint8(file.data,file.content_type))
                }}
            />
          </ButtonGroup>}
        </li>
      )):<>Nessun file selezionato</>

    
    const existinggFileFiltered = props.existingFiles && props.existingFiles.length?
    props.existingFiles.filter(e=>!removedExisting.some(p=>p === e.uniqueIdentifier))
    :[]

    const existingRender =existinggFileFiltered && existinggFileFiltered.length?<div className={styles.existingFilesContainer} style={{marginTop:10}}>
    <h4 className={styles.existingFilesTitle}>File esistenti:</h4>
    <ul className={styles.existingFilesListContainer}>
    {existinggFileFiltered.map((file) => (
            <li key={file.uniqueIdentifier} className={styles.existingFilesList}>
                {file.file_name}
                {!props.isReadOnly && <ButtonGroup>
                <Button
                    themeColor={"error"}
                    svgIcon={trashIcon}
                    onClick={() => handleRemoveExisting(file)}
                >
                </Button>
                <Button 
                    themeColor={"primary"}
                    svgIcon={downloadIcon}
                    onClick={()=>{
                       window.open(file.google_drive.view_link,'__blank')
                    }}
                />
                </ButtonGroup>}
            </li> ))
    }
            </ul>
            </div>
   :<></>

    return <>
        <div className={styles.existingFilesContainer}>
            {!props.isReadOnly && <Button  svgIcon={plusIcon} themeColor={"success"} onClick={()=>setOpenSingle(true)}>Aggiungi file</Button>}
            <h4 className={styles.existingFilesTitle}>File selezionati:</h4>
            <ul className={styles.existingFilesListContainer}>
                {valuerender}
            </ul>
        </div>
        {existingRender}
        
        <Modal 
            isOpen={openSingle} 
            title={"Seleziona File"}
            callToAction={"Aggiungi"} 
            onClose={handleCloseSingle}
            onSubmit={handleValue}
            showModalFooter={true}>

        <UploadSingleFileComponent 
                onFileChange={setCurrentSingle} name={props.name} />
        </Modal>
    </>

}