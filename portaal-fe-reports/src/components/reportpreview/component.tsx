import React, { useEffect } from "react";
import fileService from "common/services/FileService";
import Button from 'common/Button';
import {fileExcelIcon} from 'common/icons';
import styles from './style.module.scss';
import Typography from 'common/Typography'

export function ReportPreview(props:{ excelFile:any }) {
  //const [sheetNames,setSheetName] = useState<string[]>([]); // Nomi dei fogli
  //const [selectedSheet, setSelectedSheet] = useState<string>(''); // Primo foglio di default
  //const [excelData, setExcelData] = useState<Record<string,any>>();

  useEffect(()=>{
    if(props.excelFile){
        /* fileService.getJsonFromExcelBlob(props.excelFile).then((edata)=>{
            setExcelData(edata);
            setSheetName(Object.keys(edata));
            setSelectedSheet(Object.keys(edata)[0])
        }); */
        setTimeout(()=>{
          fileService.fromBlobToarrayBuffer(props.excelFile).then(arraybuffer=>{
            fileService.showExcelPreview(arraybuffer,"#report-container");
          })
        },500)
        
        
    }
  },[props.excelFile])


  return (
    <div style={{overflow:'auto'}} className={styles.container}>
      
        <Button svgIcon={fileExcelIcon} themeColor="success" onClick={()=>fileService.downloadBlobFile(props.excelFile,Date.now()+'.xlsx')}> Scarica</Button>
      {/* Tabs per selezionare il foglio */}
      <Typography.h3>Anteprima Excel</Typography.h3>
      {/* <div style={{ display: "flex", borderBottom: "2px solid #ddd" }}>
        {sheetNames.map((sheet) => (
          <button
            key={sheet}
            onClick={() => setSelectedSheet(sheet)}
            style={{
              padding: "10px 15px",
              marginRight: "5px",
              border: "none",
              borderBottom: selectedSheet === sheet ? "3px solid blue" : "none",
              background: "none",
              cursor: "pointer",
              fontWeight: selectedSheet === sheet ? "bold" : "normal"
            }}
          >
            {sheet}
          </button>
        ))}
      </div> */}

      <div id="report-container"></div>
      {/* Tabella con i dati del foglio selezionato */}
      {/* {excelData[selectedSheet]?.length > 0 ? (
        <table border={1} style={{ marginTop: "10px", width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {excelData[selectedSheet][0].map((cell, index) => (
                <th key={index} style={{ padding: "8px", background: "#f0f0f0", border: "1px solid #ddd" }}>
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {excelData[selectedSheet].slice(1).map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j} style={{ padding: "8px", border: "1px solid #ddd" }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ marginTop: "10px" }}>Nessun dato disponibile.</p>
      )} */}
    </div>
  );

}
