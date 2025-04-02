import NotificationProviderActions from "../components/Notification/provider";
import client from "./BEService";
import { saveAs } from '@progress/kendo-file-saver';
import * as XLSX from 'xlsx';
//@ts-ignore
import ExcelViewer from 'excel-viewer';
class FileService{

    convertToBE(file:File,provider?:"DRIVE"|"DATABASE"){
        return file.arrayBuffer().then(arrayBuffer=>{
            return {
                name:file.name,
                data:Array.from(new Uint8Array(arrayBuffer)),
                size:file.size,
                status:2,
                file_name:file.name,
                content_type: file.type,
                extension:file.name.split('.').pop() || '',
                provider:provider || "DRIVE"
            }
        })
    }

    convertLinkToBE(link:string,provider?:"DRIVE"|"DATABASE"){
        return Promise.resolve({
            provider:provider || "DRIVE",
            direct_link: link
        });
    }

    combineDataToBE(data:{
        name: string;
        data: number[];
        size: number;
        status: number;
        file_name: string;
        content_type: string;
        extension: string;
        provider: "DRIVE" | "DATABASE";
    }[],toDelete?:string[],property?:string,deleteOnDrive?:boolean){
        const ret:any = {
            create:data
        }
        if(toDelete && toDelete.length){
            ret.delete={
                deletedFiles:[{
                    uniqueIdentifiers:toDelete,
                    property:property
                }
                ],
                deleteFilesFromProvider: deleteOnDrive === undefined?false:deleteOnDrive
            }
        }
        if(property){
            ret.create = ret.create.map((d:any)=>({...d,property}));
        }
        return ret;
    }

    combineLinksToBE(data:{
        direct_link: string;
        provider: "DRIVE" | "DATABASE";
    }[],toDelete?:string[],property?:string,deleteOnDrive?:boolean){
        const ret:any = {
            create:data
        }
        if(toDelete && toDelete.length){
            ret.delete={
                deletedFiles:[{
                    uniqueIdentifiers:toDelete,
                    property:property
                }
                ],
                deleteFilesFromProvider: deleteOnDrive === undefined?false:deleteOnDrive
            }
        }
        if(property){
            ret.create = ret.create.map((d:any)=>({...d,property}));
        }
        return ret;
    }

    convertBlobToBE(file:Blob,filename?:'string'){
        return file.arrayBuffer().then(arrayBuffer=>{
            return {
                name:filename,
                data:Array.from(new Uint8Array(arrayBuffer)),
                size:file.size,
                status:2,
                file_name:filename,
                content_type: file.type,
                extension:filename?filename.split('.').pop():''
            }
        })
    }

    convertListToBE(files:FileList){
        return Promise.all(Array.from(files).map((f)=>this.convertToBE(f)));
    }

    getFileFromBE(id:string){
        return client.get(
            `api/v1/files/stream/${id}`,{
              responseType: 'blob', 
          }).then(res=>res.data);
    }

    openFileFromBlob(data:Blob){
        NotificationProviderActions.openFilePreview(URL.createObjectURL(data));
    }

    openFileFromLink(data:string){
        NotificationProviderActions.openFilePreview(data);
    }

    urlFromUint8(fileData:Uint8Array,contentType:string){
        const uint8Array = new Uint8Array(fileData);
    
        // Crea un Blob dai dati
        const blob = new Blob([uint8Array], { type: contentType });
        // Crea un URL temporaneo per il blob
       return URL.createObjectURL(blob);
    }
 
    downloadFileFromUint8(fileData:Uint8Array,name:string,contentType?:string,){
        const uint8Array = new Uint8Array(fileData);
    
        // Crea un Blob dai dati
        const blob = new Blob([uint8Array], { type: contentType });

        // Crea un link di download temporaneo
        const link = document.createElement('a');
        
        // Crea un URL temporaneo per il blob
        link.href = URL.createObjectURL(blob);
        
        // Imposta il nome del file
        link.download = name;
        
        // Simula il click sul link per avviare il download
        link.click();
        
        // Rilascia l'URL una volta completato il download
        URL.revokeObjectURL(link.href);
    }

    downloadBlobFile(blob: Blob, name: string) {
        return saveAs(blob,name)
    }

    openFromBE(value:any){
        if(value.provider==='DRIVE'){
            window.open(value.google_drive.view_link);
         }else{
            this.getFileFromBE(value.uniqueRecordIdentifier)
                       .then(this.openFileFromBlob)
         }
       
    }
    
    selectFile() {
        return new Promise((resolve, reject) => {
          const input = document.createElement('input');
          input.type = 'file';
          
        
      
          input.addEventListener('change', (event:any) => {
            if(!event || !event.target || !event.target.files)
                return reject();
            const file =event.target.files[0];
            if (file) {
              resolve(file);
            } else {
              reject('No file selected');
            }
            // Rimuovi l'input dopo l'uso
            input.remove();
          });
      
          input.addEventListener('cancel', () => {

            reject('File selection was canceled');
            // Rimuovi l'input dopo l'uso
            input.remove();
          });
      
          input.click();
        });
    }

    selectFiles() {
        return new Promise((resolve, reject) => {
          const input = document.createElement('input');
          input.type = 'file';
          
        
      
          input.addEventListener('change', (event:any) => {
            if(!event || !event.target || !event.target.files)
                return reject();
            const file =event.target.files;
            if (file) {
              resolve(file);
            } else {
              reject('No file selected');
            }
            // Rimuovi l'input dopo l'uso
            input.remove();
          });
      
          input.addEventListener('cancel', () => {

            reject('File selection was canceled');
            // Rimuovi l'input dopo l'uso
            input.remove();
          });
      
          input.click();
        });
    }

    getJsonFromExcelBlob(fileBlob:Blob){
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
              try {
                if(e.target){

                
                    const arrayBuffer = e.target.result;
                    const workbook = XLSX.read(arrayBuffer, { type: "array" });
            
                    const result:any = {};
                    workbook.SheetNames.forEach((sheetName) => {
                        const sheet = workbook.Sheets[sheetName];

                        const sheetRef= sheet["!ref"];
                        if(sheetRef){
                            // Ottieni il range massimo (es. "A1:D10")
                            const range = XLSX.utils.decode_range(sheetRef);
                            const numRows = range.e.r + 1; // Numero di righe
                            const numCols = range.e.c + 1; // Numero di colonne
                
                            // Inizializza la matrice vuota con `null`
                            const jsonData = Array.from({ length: numRows }, () => Array(numCols).fill(null));
                
                            // Riempie la matrice basandosi sulle coordinate delle celle
                            for (const cellAddress in sheet) {
                            if (cellAddress[0] === "!") continue; // Ignora i metadati di SheetJS
                
                            const cell = sheet[cellAddress];
                            const { r, c } = XLSX.utils.decode_cell(cellAddress);
                            jsonData[r][c] = cell.v;
                            }
                            result[sheetName] = jsonData;
                        }
                    });
            
                    resolve(result);
                }else{
                    throw new Error('file corrupted')
                }
              } catch (error) {
                reject(error);
              }
            };
        
            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(fileBlob);
          });
    }

    fromBlobToarrayBuffer(fileBlob:Blob){
        return new Promise((ok,ko)=>{
            const fileReader = new FileReader();
            fileReader.onload = function(event) {
                if(event.target)
                    ok(event.target.result);
                else
                    ko('error')
            };
            fileReader.readAsArrayBuffer(fileBlob);
        })
        
    }

    showExcelPreview(file:ArrayBuffer,container:string|HTMLElement){
        new ExcelViewer(container,file)
    }
}

export default new FileService();
