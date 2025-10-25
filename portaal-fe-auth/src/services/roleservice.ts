import client from "common/services/BEService";
import BaseHttpService from "common/services/BaseHTTPService";

class RoleServiceC extends BaseHttpService{


    getTableName() {
        return "role";
    }

    getAllPermissions(){
        return client.get("api/v1/crud/permission").then((res:any)=>res.data)
    }

    associatePermission(id:number,permissions:number[]){
        return client.patch("api/v1/role/updateRoleAssociation/"+id,{
            permission_ids:permissions
        }).then((res:any)=>res.data)
    }

}

export const RoleService = new RoleServiceC();