import React, { useEffect, useState } from 'react';
import { Upload, UploadProps } from "@progress/kendo-react-upload";
import { Button } from '@progress/kendo-react-buttons';
import { downloadIcon } from '@progress/kendo-svg-icons';
import styles from "./styles.module.scss"
import { saveAs } from '@progress/kendo-file-saver';
import FileService from '../../services/FileService';
type CustomUploadProps = {
  onDownload?: (id: string, name: string) => Promise<{ fileId: string, fileName: string }>;
  multiple?: boolean;
  existingFile?: { name: string; id: string }[];
} & UploadProps;

const UploadMultipleFileComponent: React.FC<CustomUploadProps> = (props) => {
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);

  useEffect(() => {
    if (props.existingFile && props.existingFile.length > 0) {
      setSelectedFileNames(props.existingFile.map(file => file.name));
    }
  }, [props.existingFile]);


  const handleFileDownload = async (fileId: string, fileName: string) => {
    try {
      if (props.onDownload) {
        await props.onDownload(fileId, fileName);
        console.log("fieldid", fileId)
        const blob = await FileService.getFileFromBE(fileId);
        console.log("blob", blob)
        FileService.onDownloadFile(blob, fileName)
      }
    } catch (error) {
      console.error('Errore durante il download del file:', error);
    }
  };
  return (
    <div>
      <Upload
        {...props}
        files={props.files || []}
        multiple={props.multiple ?? true}
      />

      {props.existingFile && props.existingFile.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4>File esistenti:</h4>
          <div className={styles.existingFilesContainer}>
            <ul>
              {props.existingFile.map((file, index) => (
                <li key={file.id} className={styles.existingFilesList}>
                  {file.name}
                  <Button
                    themeColor={"primary"}
                    svgIcon={downloadIcon}
                    onClick={() => handleFileDownload(file.id, file.name)}
                  >
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadMultipleFileComponent;
