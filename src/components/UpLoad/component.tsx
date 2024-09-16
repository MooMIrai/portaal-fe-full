import React from 'react'
import { Upload, UploadProps } from "@progress/kendo-react-upload";
import { Button } from '@progress/kendo-react-buttons';
import styles from "./styles.module.scss"
import { downloadIcon } from '@progress/kendo-svg-icons';
type CustomUploadProps={
  onDownload?:()=> void;
  multiple?:boolean
} & UploadProps

function UploadComponent(props:CustomUploadProps) {
  return (
    <div>
    <Upload
    {...props} 
    multiple={props.multiple ?? false}
    />
    {props.onDownload && 
    <div className={styles.buttonDownload}>
    <Button themeColor={"primary"} svgIcon={downloadIcon} onClick={props.onDownload}>Download</Button>
    </div>}
    </div>
  )
}

export default UploadComponent