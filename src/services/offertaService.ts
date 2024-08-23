import BaseHttpService from "common/services/BaseHTTPService"
import client from "common/services/BEService";
import { mapBillingTypeName, mapOutcomeTypeName } from "../adapters/offertaAdapters";
class OffertaService extends BaseHttpService{

    getTableName(){
        return 'projects'
    }

    getProjectType(term:string){
        return client.get('/api/v1/crud/projecttype?term='+term)
    }

    getBillingType(term:string){

        return client.get('/api/v1/projects/billingTypes').then(res=>{
            return res.data.map(p=>({id:p,name:mapBillingTypeName(p)})).filter(p=>!term || !term.length || p.name.toLowerCase().indexOf(term.toLocaleLowerCase())>=0);
        })
    }

    getOutcomeType(term:string){

        return client.get('/api/v1/projects/outcomeTypes').then(res=>{
            return res.data.map(p=>({id:p,name:mapOutcomeTypeName(p)})).filter(p=>!term || !term.length || p.name.toLowerCase().indexOf(term.toLocaleLowerCase())>=0);
        })
    }

}

export const offertaService = new OffertaService();