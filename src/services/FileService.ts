import NotificationProviderActions from "../components/Notification/provider";
import client from "./BEService";

class FileService{

    convertToBE(file:File){
        return file.arrayBuffer().then(arrayBuffer=>{
            return {
                name:file.name,
                data:Array.from(new Uint8Array(arrayBuffer)),
                size:file.size,
                status:2,
                file_name:file.name,
                content_type: file.type,
                extension:file.name.split('.').pop() || ''
            }
        })
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

    downloadFileFromUint8(fileData:Uint8Array,contentType:string,name:string){
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

}

export default new FileService();
