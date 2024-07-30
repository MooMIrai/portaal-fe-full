class CRepo{

    write(key:string,value:string,exp?:Date){
        debugger;
        let expires="";
        if (exp) {
            expires = "; expires="+exp.toUTCString();
        }
        document.cookie = key+"="+value+expires+"; path=/";
        return true;
    }

    delete(key:string){
        this.write(key,'',new Date());
    }

    read(key:string){
        let cookie:Record<string,string> = {};
        document.cookie.split(';').forEach(function(el) {
            let split = el.split('=');
            cookie[split[0].trim()] = split.slice(1).join("=");
        })
        return cookie[key];
    }

}

export default new CRepo();