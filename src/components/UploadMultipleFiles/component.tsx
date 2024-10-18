import React, { useEffect, useState, useRef } from 'react';
import { Upload, UploadProps } from "@progress/kendo-react-upload";
import { Button } from '@progress/kendo-react-buttons';
import { Droppable } from '@progress/kendo-react-common';
import { downloadIcon } from '@progress/kendo-svg-icons';
import styles from "./styles.module.scss";
import FileService from '../../services/FileService';

type CustomUploadProps = {
  onDownload?: (id: string, name: string) => Promise<{ fileId: string, fileName: string }>;
  multiple?: boolean;
  existingFile?: { name: string; id: string }[];
  onFileDrop?: (files: File[]) => void;
  isDroppable?: boolean;
} & UploadProps;

const UploadMultipleFileComponent: React.FC<CustomUploadProps> = (props) => {
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);
  const elementRef = useRef<HTMLDivElement>(null);
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);

  useEffect(() => {
    if (props.existingFile && props.existingFile.length > 0) {
      setSelectedFileNames(props.existingFile.map(file => file.name));
    }
  }, [props.existingFile]);

  const handleFileDownload = async (fileId: string, fileName: string) => {
    try {
      if (props.onDownload) {
        await props.onDownload(fileId, fileName);
        const blob = await FileService.getFileFromBE(fileId);
        FileService.onDownloadFile(blob, fileName);
      }
    } catch (error) {
      console.error('Errore durante il download del file:', error);
    }
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files) as File[];
    if (files.length > 0) {
      setDroppedFiles([...droppedFiles, ...files]);
      if (props.onFileDrop) {
        props.onFileDrop(files);
      }
    }
  };

  const handleDragOver = (event: any) => {
    event.preventDefault();
  };

  return (
    <div className={props.isDroppable ? styles.container : ''}>
      <div className={props.isDroppable ? styles.uploadAndDropContainer : ''}>
        <Upload
          {...props}
          files={props.files || []}
          multiple={props.multiple ?? true}
        />
        {props.isDroppable && (
          <Droppable childRef={elementRef}>
            <div
              ref={elementRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className={styles.droppableContainer}
            >
              <p className={styles.droppableText}>Trascina qui i file o usa l'upload</p>
            </div>
          </Droppable>
        )}
      </div>

      {props.existingFile && props.existingFile.length > 0 && (
        <div style={props.isDroppable ? {'width':'50%'} : { }}>
          <div style={props.isDroppable ? {} : { marginTop: '10px' }} className={styles.existingFilesContainer}>
            <h4 className={styles.existingFilesTitle}>File esistenti:</h4>
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
