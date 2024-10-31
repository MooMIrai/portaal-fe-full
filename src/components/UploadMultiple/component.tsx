import React, { useEffect, useState } from "react";
import Modal from "../Modal/component";
import UploadSingleFileComponent from "../UpLoadSingleFile/component";
import styles from './styles.module.scss';
import {  downloadIcon, plusIcon, trashIcon } from "@progress/kendo-svg-icons";
import { Button, ButtonGroup } from "@progress/kendo-react-buttons";


interface UploadMultipleProps {
    isReadOnly:boolean;
    onChange?: (value:Array<any>)=>void;
    existingFiles?:Array<any>
}

export default function UploadMultiple(props:UploadMultipleProps){

    const [openSingle,setOpenSingle] = useState<boolean>(false);
    const [currentSingle,setCurrentSingle] = useState<any>();
    const [values,setValues] = useState<any[]>([]);

    useEffect(()=>{
        if(props.onChange){
            props.onChange(values);
        }
    },[values,props.onChange])

    const handleValue = ()=>{
        if(currentSingle){
            setValues([...values,...currentSingle]);
            handleCloseSingle();
            setCurrentSingle(undefined);
        }
    };

    const handleRemove = (index:number)=> {
        setValues(values.filter((el,indexInArray)=>indexInArray!==index));
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
                    debugger;
                }}
            />
          </ButtonGroup>}
        </li>
      )):<>Nessun file selezionato</>

    const existingRender = props.existingFiles && props.existingFiles.length?<div className={styles.existingFilesContainer} style={{marginTop:10}}>
    <h4 className={styles.existingFilesTitle}>File esistenti:</h4>
    <ul className={styles.existingFilesListContainer}>
    {props.existingFiles.map((file,index) => (
            <li key={file.uniqueIdentifier} className={styles.existingFilesList}>
                {file.file_name}
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
            onFileChange={setCurrentSingle} />
        </Modal>
    </>

}