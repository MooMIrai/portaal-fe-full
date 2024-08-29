import BaseHttpService from "common/services/BaseHTTPService"
import client from "common/services/BEService";


class ProgettoService extends BaseHttpService{

    getTableName(){
        return 'projects'
    }


}

export const progettoService = new ProgettoService();