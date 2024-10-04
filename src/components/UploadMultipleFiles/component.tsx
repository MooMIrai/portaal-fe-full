import React, { useEffect, useState } from 'react';
import { Upload, UploadProps } from "@progress/kendo-react-upload";
import { Button } from '@progress/kendo-react-buttons';
import { downloadIcon } from '@progress/kendo-svg-icons';
import styles from "./styles.module.scss"
type CustomUploadProps = {
  onDownload?: (id: string, name:string) => void;
  multiple?: boolean;
  existingFile?: { name: string; id: string }[];  // Array of files
} & UploadProps;

const UploadMultipleFileComponent: React.FC<CustomUploadProps> = (props) => {
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);

  useEffect(() => {
    if (props.existingFile && props.existingFile.length > 0) {
      setSelectedFileNames(props.existingFile.map(file => file.name));
    }
  }, [props.existingFile]);

  return (
    <div>
      {/* Upload Component */}
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
                    onClick={() => props.onDownload && props.onDownload(file.id, file.name)}   // Pass file ID to download handler
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
