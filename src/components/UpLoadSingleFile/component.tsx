import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@progress/kendo-react-buttons';
import styles from './styles.module.scss';
import { downloadIcon } from '@progress/kendo-svg-icons';
import { Loader } from '@progress/kendo-react-indicators';

type CustomUploadProps = {
  onDownload?: () => void;
  multiple?: boolean;
  onFileChange: (fileData: { name: string; extension: string; data: number[]; size: number; status: number }[]) => void;
  accept?: string;
  disabled?: boolean;
  onFileUpload?: (file: File) => void; 
  existingFile?: { id:string, name: string;}[]; 
};

function UploadSingleFileComponent(props: CustomUploadProps) {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showGenerateAIButton, setShowGenerateAIButton] = useState<boolean>(false); 
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);


  useEffect(() => {
    if (props.existingFile) {
      console.log("existingFile:", props.existingFile);  
      setSelectedFileName(props.existingFile?.[0].name);
    }
  }, [props.existingFile]);


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputElement = event.target;
    const files = inputElement.files;
    if (files) {
      const fileArray = Array.from(files);
      const fileDataArray = await Promise.all(
        fileArray.map(async (file) => {
          const arrayBuffer = await file.arrayBuffer();
          const byteArray = new Uint8Array(arrayBuffer);
          const fileExtension = file.name.split('.').pop() || '';
          return {
            name: file.name,
            extension: fileExtension,
            data: Array.from(byteArray),
            size: file.size,
            status: 2,
          };
        })
      );
      setSelectedFileName(fileArray[0].name);
      setSelectedFile(fileArray[0]); 
      setShowGenerateAIButton(true); 
      props.onFileChange(fileDataArray);
 
      
    }
  };
  const handleGenerateAIClick = async () => {
    if (selectedFile && props.onFileUpload) {
      setIsLoading(true); 
      try {
        await props.onFileUpload(selectedFile);  
      } finally {
        setIsLoading(false);  
      }
    }
  };


  const triggerFileInputClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className={styles.uploadContainer}>
      {/* Bottone per triggerare il click sull'input file */}
      {!props.disabled && <Button themeColor="primary" svgIcon={downloadIcon} onClick={triggerFileInputClick}>
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
        {props.existingFile && props.onDownload && (
          <p>
            File caricato: <strong>{props.existingFile?.[0]?.name}</strong>
          </p>
        )}
        {selectedFileName && !props.onDownload && (
          <p>
            File selezionato: <strong>{selectedFileName}</strong>
          </p>
        )}
        {props.onDownload && props.existingFile && (
          <div>
            <Button themeColor={"primary"} svgIcon={downloadIcon} onClick={props.onDownload}>
            </Button>
          </div>

        )}
          {showGenerateAIButton && (
          <div>
            {isLoading ? (  
              <Loader size="medium" type="infinite-spinner" />
            ) : ( 
              <Button
                themeColor="secondary"
                onClick={handleGenerateAIClick}  
              >
                Genera AI
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadSingleFileComponent;
