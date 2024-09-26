import React from 'react';
import { Upload, UploadProps } from "@progress/kendo-react-upload";
import { Button } from '@progress/kendo-react-buttons';
import { downloadIcon } from '@progress/kendo-svg-icons';

type CustomUploadProps = {
  onDownload?: () => void;
  multiple?: boolean;
} & UploadProps;

const UploadMultipleFileComponent: React.FC<CustomUploadProps> = (props) => {
  return (
    <div>
      <Upload
        {...props} 
        files={props.files || []} 
        multiple={props.multiple ?? true}
      />
      {props.onDownload && props.files && props.files.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <Button
            themeColor={"primary"}
            svgIcon={downloadIcon}
            onClick={props.onDownload}
          >
            Download
          </Button>
        </div>
      )}
    </div>
  );
};

export default UploadMultipleFileComponent;
