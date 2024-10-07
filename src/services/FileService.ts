class FileService{

    convertToBE(file:File){
        return file.arrayBuffer().then(arrayBuffer=>{
            return {
                name:file.name,
                data:new Uint8Array(arrayBuffer),
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

}

export default new FileService();
