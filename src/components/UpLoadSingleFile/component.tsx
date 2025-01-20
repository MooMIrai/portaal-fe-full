import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import styles from './styles.module.scss';
import { downloadIcon, googleIcon } from '@progress/kendo-svg-icons';
import FileService from '../../services/FileService';
import NotificationProviderActions from '../Notification/provider';


type CustomUploadProps = {
  onDownload?: () => void;
  multiple?: boolean;
  onFileChange: (fileData: {
    name?: string;
    data?: Array<any>;
    size?: number;
    status?: number;
    file_name?: string;
    content_type?: string;
    extension?: string;
    provider?:string,
    direct_link?:string
  }[]) => void;
  accept?: string;
  disabled?: boolean;
  existingFile?: { id: string, name: string; }[];
  name:string,
  externalValue?:FileList 
};

function UploadSingleFileComponent(props: CustomUploadProps) {
  const [selectedFileName, setSelectedFileName] = useState<string | null | undefined>(null);
  const [selectedFile, setSelectedFile] = useState<File | null >(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedLink,setSelectedLink] = useState<string>();
  const [deleteDrive,setDeleteDrive] = useState<boolean | undefined>();

  useEffect(()=>{
    
    if(props.externalValue){
      debugger;
      convertFiles(props.externalValue);
    }
  },[props.externalValue])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputElement = event.target;
    const files = inputElement.files;
    await convertFiles(files);
  };

  const convertFiles = async (files:FileList| null )=>{
    if (files) {
      const fileDataArray = await FileService.convertListToBE(files);
      const fileArray = Array.from(files);

      setSelectedFileName(fileArray[0].name);
      setSelectedFile(fileArray[0]);
      setSelectedLink(undefined);

      if(deleteDrive===undefined && props.existingFile && props.existingFile.length){
          NotificationProviderActions.openConfirm(
            "Vuoi eliminare il file anche su drive?",
            ()=>{
              setDeleteDrive(true);
              props.onFileChange(FileService.combineDataToBE(fileDataArray,props.existingFile?.map(p=>p.id),props.name,true));
            },
            'Conferma operazione',
            ()=>{
              setDeleteDrive(false);
              props.onFileChange(FileService.combineDataToBE(fileDataArray,props.existingFile?.map(p=>p.id),props.name,false));
            }
          )
      }else{
        props.onFileChange(FileService.combineDataToBE(fileDataArray,props.existingFile?.map(p=>p.id),props.name,deleteDrive));
      }

      


    }
  }

  const triggerFileInputClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileDownload = async () => {
    /* try {
      if (props.onDownload) {
        const fileforDowload = await props.onDownload();  
        const { fileId } = fileforDowload
        const blob = await FileService.getFileFromBE(fileId);  
        FileService.openFileFromBlob(blob)
      }
    } catch (error) {
      console.error('Errore durante il download del file:', error);
    } */
   if(props.onDownload){
    props.onDownload();
   }
  };

  const handlePasteLink = ()=> {
    // Controlla se l'API Clipboard è supportata
    if (!navigator.clipboard) {
      return NotificationProviderActions.openModal({style:"warning",icon:true},"Clipboard non supportata");
    }
  
    // Ottieni il testo dalla clipboard
    return navigator.clipboard.readText()
      .then((text) => {
        // Verifica che il testo sia un link di Google Drive
        const googleDriveRegex = /^https:\/\/(drive|docs)\.google\.com\/(?:file\/d\/|open\?id=)[\w-]+/;
        if (googleDriveRegex.test(text)) {
          
          FileService.convertLinkToBE(text).then(res=>{
            props.onFileChange([res]);
            setSelectedFileName(text);
            setSelectedFile(null);
            setSelectedLink(text);
          });
         
        } else {
          NotificationProviderActions.openModal({style:"warning",icon:true},"Il contenuto della clipboard non è un link valido di Google Drive.");
        }
      })
      .catch(() => {
        NotificationProviderActions.openModal({style:"error",icon:true},"Errore nella lettura della clipboard. Copia nuovamente il link.");
        
      });
  }
  

  return (
    <div className={styles.uploadContainer}>
      {/* Bottone per triggerare il click sull'input file */}
      {!props.disabled && <>
        <Button type='button' themeColor="primary" svgIcon={downloadIcon} onClick={triggerFileInputClick}>
          Scegli file
        </Button>
        <span>Oppure</span>
        <Button type='button' themeColor="secondary" svgIcon={googleIcon} onClick={handlePasteLink}>
          Incolla il link del file presente su Google Drive
        </Button>
      </>}


      <input
        type="file"
        ref={inputRef}
        style={{ display: 'none' }}
        disabled={props.disabled}
        onChange={handleFileChange}
        accept={props.accept}
        multiple={props.multiple}
      />
      <div className={styles.fileInfoContainer}>
        {props.existingFile && !selectedFileName && (
          <p>
            File caricato: <strong><small>{props.existingFile?.[0]?.name}</small></strong>
          </p>
        )}
        {selectedFileName && (
          <p>
            File selezionato: <strong><small>{selectedFileName}</small></strong>
          </p>
        )}
        {props.onDownload && props.existingFile && !selectedFile && !selectedLink && (
          <div>
            <Button
              type='button'
              themeColor={"primary"}
              svgIcon={downloadIcon}
              onClick={handleFileDownload}
            >
              Scarica
            </Button>
          </div>
        )}
        {
          /* selectedLink && !selectedFileName && (<div>
            <Button
              type='button'
              themeColor={"primary"}
              svgIcon={googleBoxIcon}
              onClick={()=>window.open(selectedLink, "_blank")}
            >
              Visualizza il file Google
            </Button>
          </div>)*/
        }
      </div>
    </div>
  );
}

export default UploadSingleFileComponent;
