import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import styles from './styles.module.scss';
import { downloadIcon } from '@progress/kendo-svg-icons';
import { Loader } from '@progress/kendo-react-indicators';
import FileService from '../../services/FileService';
import { saveAs } from '@progress/kendo-file-saver';
type CustomUploadProps = {
  onDownload?: () => Promise<{fileId:string,fileName:string}>;
  multiple?: boolean;
  onFileChange: (fileData: {
    name: string;
    data: Array<any>;
    size: number;
    status: number;
    file_name: string;
    content_type: string;
    extension: string;
  }[]) => void;
  accept?: string;
  disabled?: boolean;
  existingFile?: { id: string, name: string; }[];
};

function UploadSingleFileComponent(props: CustomUploadProps) {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showGenerateAIButton, setShowGenerateAIButton] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputElement = event.target;
    const files = inputElement.files;
    if (files) {
      const fileDataArray = await FileService.convertListToBE(files);
      const fileArray = Array.from(files);

      setSelectedFileName(fileArray[0].name);
      setSelectedFile(fileArray[0]);
      setShowGenerateAIButton(true);
      props.onFileChange(fileDataArray);


    }
  };


  const triggerFileInputClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileDownload = async () => {
    try {
      if (props.onDownload) {
        const fileforDowload = await props.onDownload();  
        const { fileId, fileName} = fileforDowload
        console.log("fieldid",fileId)
        const blob = await FileService.getFileFromBE(fileId);  
       console.log("blob",blob)
       FileService.downloadBlobFile(blob,fileName)
      }
    } catch (error) {
      console.error('Errore durante il download del file:', error);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      {/* Bottone per triggerare il click sull'input file */}
      {!props.disabled && <Button type='button' themeColor="primary" svgIcon={downloadIcon} onClick={triggerFileInputClick}>
        Scegli file
      </Button>}


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
            File caricato: <strong>{props.existingFile?.[0]?.name}</strong>
          </p>
        )}
        {selectedFileName && (
          <p>
            File selezionato: <strong>{selectedFileName}</strong>
          </p>
        )}
        {props.onDownload && props.existingFile && !selectedFile && (
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
      </div>
    </div>
  );
}

export default UploadSingleFileComponent;
