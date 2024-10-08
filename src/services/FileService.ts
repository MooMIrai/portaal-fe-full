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

}

export default new FileService();
