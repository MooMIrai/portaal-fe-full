import NotificationProviderActions from "../components/Notification/provider";
import client from "./BEService";
import { saveAs } from '@progress/kendo-file-saver';
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
    }[],toDelete?:string[],property?:string){
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
                deleteFilesFromProvider: true
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
    
}

export default new FileService();
