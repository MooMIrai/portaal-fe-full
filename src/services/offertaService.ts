import BaseHttpService from "common/services/BaseHTTPService"

class OffertaService extends BaseHttpService{

    getTableName(){
        return 'projects'
    }

}

export const offertaService = new OffertaService();